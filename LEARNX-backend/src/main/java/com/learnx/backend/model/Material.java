package com.learnx.backend.model;

import com.learnx.backend.storage.FileStorageService.StoredFile;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "materials")
@Getter
@Setter
@NoArgsConstructor
public class Material {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "course_id")
    private Course course;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 40)
    private String category;

    @Column(nullable = false, length = 80)
    private String storedName;

    @Column(nullable = false, length = 255)
    private String originalName;

    @Column(nullable = false, length = 120)
    private String contentType;

    @Column(nullable = false)
    private long sizeBytes;

    @Column(nullable = false, length = 40)
    private String uploadedBy;

    @Column(nullable = false)
    private Instant uploadedAt = Instant.now();

    public Material(Course course, String title, String category, String uploadedBy, StoredFile file) {
        this.course = course;
        this.title = title;
        this.category = category;
        this.uploadedBy = uploadedBy;
        this.storedName = file.storedName();
        this.originalName = file.originalName();
        this.contentType = file.contentType();
        this.sizeBytes = file.sizeBytes();
    }
}