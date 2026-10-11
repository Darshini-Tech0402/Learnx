package com.learnx.backend.controller;

import com.learnx.backend.repository.StudentRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Locale;

@RestController
@RequestMapping("/api")
public class RosterController {

    public record StudentRowDto(String roll, String name, Double cgpa, String section,
                                String department, String batch) {}

    private final StudentRepository students;

    public RosterController(StudentRepository students) {
        this.students = students;
    }

    // GET /api/students?section=J
    @GetMapping("/students")
    public List<StudentRowDto> bySection(@RequestParam String section) {
        return students.findBySectionOrderByRollNoAsc(section.trim().toUpperCase(Locale.ROOT)).stream()
                .map(s -> new StudentRowDto(s.getRollNo(), s.getName(), s.getCgpa(),
                        s.getSection(), s.getDepartment(), s.getBatch()))
                .toList();
    }
}