package com.learnx.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "faculty")
@Getter
@Setter
@NoArgsConstructor
public class Faculty {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String facultyId;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(length = 60)
    private String designation;

    @Column(length = 120)
    private String department;

    // Plain text for the demo only.
    @Column(length = 60)
    private String password;

    // Course codes this faculty teaches, comma separated, e.g. "AIML,LAB-AIML"
    @Column(length = 200)
    private String courses;

    // Sections this faculty handles, comma separated, e.g. "J,K,M"
    @Column(length = 60)
    private String sections;
}