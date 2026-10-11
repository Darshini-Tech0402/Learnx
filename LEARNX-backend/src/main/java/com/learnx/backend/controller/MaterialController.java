package com.learnx.backend.controller;

import com.learnx.backend.dto.ApiDtos.MaterialDto;
import com.learnx.backend.service.MaterialService;
import com.learnx.backend.storage.FileStorageService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/materials")
public class MaterialController {

    private final MaterialService materials;

    public MaterialController(MaterialService materials) {
        this.materials = materials;
    }

    @GetMapping
    public List<MaterialDto> list(@RequestParam(required = false) String courseCode) {
        return materials.list(courseCode);
    }

    // Faculty upload
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public MaterialDto upload(@RequestParam String courseCode,
                              @RequestParam String title,
                              @RequestParam(required = false) String category,
                              @RequestParam(defaultValue = "faculty") String uploadedBy,
                              @RequestParam("file") MultipartFile file) {
        return materials.upload(courseCode, title, category, uploadedBy, file);
    }

    @GetMapping("/{id}/file")
    public ResponseEntity<Resource> file(@PathVariable Long id,
                                         @RequestParam(defaultValue = "false") boolean inline) {
        return FileStorageService.respond(materials.download(id), inline);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        materials.delete(id);
    }
}