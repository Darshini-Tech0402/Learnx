package com.learnx.backend.model;

import com.learnx.backend.storage.FileStorageService.StoredFile;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "submissions")
@Getter
@Setter
@NoArgsConstructor
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "assignment_id")
    private Assignment assignment;

    @Column(nullable = false, length = 20)
    private String rollNo;

    @Column(nullable = false, length = 80)
    private String storedName;

    @Column(nullable = false, length = 255)
    private String originalName;

    @Column(nullable = false, length = 120)
    private String contentType;

    @Column(nullable = false)
    private long sizeBytes;

    // Every re-upload is a new version. The highest version is current.
    @Column(nullable = false)
    private int version;

    @Column(nullable = false)
    private Instant submittedAt = Instant.now();

    public Submission(Assignment assignment, String rollNo, StoredFile file, int version) {
        this.assignment = assignment;
        this.rollNo = rollNo;
        this.storedName = file.storedName();
        this.originalName = file.originalName();
        this.contentType = file.contentType();
        this.sizeBytes = file.sizeBytes();
        this.version = version;
    }
}