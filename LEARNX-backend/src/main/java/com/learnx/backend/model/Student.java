package com.learnx.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "students")
@Getter
@Setter
@NoArgsConstructor
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String rollNo;

    @Column(nullable = false, length = 120)
    private String name;

    private Double cgpa;

    @Column(length = 20)
    private String section;

    @Column(length = 120)
    private String department;

    @Column(length = 20)
    private String batch;

    // Plain text for the demo only. Hash it before real use.
    @Column(length = 60)
    private String password;

    public Student(String rollNo, String name, Double cgpa, String section,
                   String department, String batch, String password) {
        this.rollNo = rollNo;
        this.name = name;
        this.cgpa = cgpa;
        this.section = section;
        this.department = department;
        this.batch = batch;
        this.password = password;
    }
}