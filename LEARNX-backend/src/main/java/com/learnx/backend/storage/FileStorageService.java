package com.learnx.backend.storage;

import com.learnx.backend.config.LearnxProperties;
import com.learnx.backend.common.NotFoundException;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

@Service
public class FileStorageService {

    public record StoredFile(String storedName, String originalName, String contentType, long sizeBytes) {}

    public record Download(Resource resource, String fileName, String contentType) {}

    private static final Set<String> ALLOWED = Set.of("pdf", "doc", "docx", "pptx", "zip");

    private final Path root;

    public FileStorageService(LearnxProperties props) throws IOException {
        this.root = Paths.get(props.storage().dir()).toAbsolutePath().normalize();
        Files.createDirectories(root);
    }

    public StoredFile store(MultipartFile file, String folder) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        String original = Paths.get(StringUtils.cleanPath(
                Objects.requireNonNullElse(file.getOriginalFilename(), "file"))).getFileName().toString();
        String ext = StringUtils.getFilenameExtension(original);
        ext = ext == null ? "" : ext.toLowerCase(Locale.ROOT);

        if (!ALLOWED.contains(ext)) {
            throw new IllegalArgumentException("Only PDF, DOC, DOCX, PPTX or ZIP files are accepted");
        }

        try {
            byte[] head;
            try (InputStream in = file.getInputStream()) {
                head = in.readNBytes(8);
            }
            if (!matchesSignature(ext, head)) {
                throw new IllegalArgumentException("File content does not match its extension");
            }

            Path dir = resolveFolder(folder);
            Files.createDirectories(dir);
            String storedName = UUID.randomUUID() + "." + ext;
            try (InputStream in = file.getInputStream()) {
                Files.copy(in, dir.resolve(storedName), StandardCopyOption.REPLACE_EXISTING);
            }
            return new StoredFile(storedName, original, contentTypeFor(ext), file.getSize());
        } catch (IOException e) {
            throw new UncheckedIOException("Could not save the file", e);
        }
    }

    public Download open(String folder, String storedName, String originalName, String contentType) {
        Path p = resolveFolder(folder).resolve(storedName).normalize();
        if (!p.startsWith(root) || !Files.exists(p)) {
            throw new NotFoundException("File not found on the server");
        }
        return new Download(new FileSystemResource(p), originalName, contentType);
    }

    public void delete(String folder, String storedName) {
        try {
            Files.deleteIfExists(resolveFolder(folder).resolve(storedName).normalize());
        } catch (IOException e) {
            throw new UncheckedIOException("Could not delete the file", e);
        }
    }

    // Shared response builder: attachment by default, inline when the browser should preview it
    public static ResponseEntity<Resource> respond(Download d, boolean inline) {
        ContentDisposition cd = (inline ? ContentDisposition.inline() : ContentDisposition.attachment())
                .filename(d.fileName())
                .build();
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(d.contentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, cd.toString())
                .body(d.resource());
    }

    private Path resolveFolder(String folder) {
        Path p = root.resolve(folder).normalize();
        if (!p.startsWith(root)) {
            throw new IllegalArgumentException("Invalid storage folder");
        }
        return p;
    }

    private static boolean matchesSignature(String ext, byte[] h) {
        return switch (ext) {
            case "pdf" -> startsWith(h, 0x25, 0x50, 0x44, 0x46);   // %PDF
            case "doc" -> startsWith(h, 0xD0, 0xCF, 0x11, 0xE0);   // OLE compound file
            default -> startsWith(h, 0x50, 0x4B, 0x03, 0x04);      // docx, pptx, zip (ZIP containers)
        };
    }

    private static boolean startsWith(byte[] h, int... sig) {
        if (h.length < sig.length) return false;
        for (int i = 0; i < sig.length; i++) {
            if ((h[i] & 0xFF) != sig[i]) return false;
        }
        return true;
    }

    private static String contentTypeFor(String ext) {
        return switch (ext) {
            case "pdf" -> "application/pdf";
            case "doc" -> "application/msword";
            case "docx" -> "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            case "pptx" -> "application/vnd.openxmlformats-officedocument.presentationml.presentation";
            default -> "application/zip";
        };
    }
}