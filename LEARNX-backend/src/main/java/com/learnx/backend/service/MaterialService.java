package com.learnx.backend.service;

import com.learnx.backend.common.NotFoundException;
import com.learnx.backend.dto.ApiDtos.MaterialDto;
import com.learnx.backend.model.Course;
import com.learnx.backend.model.Material;
import com.learnx.backend.repository.CourseRepository;
import com.learnx.backend.repository.MaterialRepository;
import com.learnx.backend.storage.FileStorageService;
import com.learnx.backend.storage.FileStorageService.Download;
import com.learnx.backend.storage.FileStorageService.StoredFile;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@Transactional
public class MaterialService {

    private static final String FOLDER = "materials";

    private final MaterialRepository materials;
    private final CourseRepository courses;
    private final FileStorageService storage;

    public MaterialService(MaterialRepository materials, CourseRepository courses, FileStorageService storage) {
        this.materials = materials;
        this.courses = courses;
        this.storage = storage;
    }

    public MaterialDto upload(String courseCode, String title, String category, String uploadedBy, MultipartFile file) {
        Course course = courses.findByCode(courseCode)
                .orElseThrow(() -> new NotFoundException("Course " + courseCode + " not found"));
        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException("Title is required");
        }
        StoredFile stored = storage.store(file, FOLDER);
        String cat = (category == null || category.isBlank()) ? "Lecture Notes" : category.trim();
        return toDto(materials.save(new Material(course, title.trim(), cat, uploadedBy, stored)));
    }

    @Transactional(readOnly = true)
    public List<MaterialDto> list(String courseCode) {
        List<Material> found = courseCode == null
                ? materials.findAllByOrderByUploadedAtDesc()
                : materials.findByCourseCodeOrderByUploadedAtDesc(courseCode);
        return found.stream().map(MaterialService::toDto).toList();
    }

    @Transactional(readOnly = true)
    public Download download(Long id) {
        Material m = find(id);
        return storage.open(FOLDER, m.getStoredName(), m.getOriginalName(), m.getContentType());
    }

    public void delete(Long id) {
        Material m = find(id);
        String stored = m.getStoredName();
        materials.delete(m);
        storage.delete(FOLDER, stored);
    }

    private Material find(Long id) {
        return materials.findById(id)
                .orElseThrow(() -> new NotFoundException("Material " + id + " not found"));
    }

    private static MaterialDto toDto(Material m) {
        return new MaterialDto(m.getId(), m.getCourse().getCode(), m.getTitle(), m.getCategory(),
                m.getOriginalName(), m.getSizeBytes(), m.getUploadedAt());
    }
}