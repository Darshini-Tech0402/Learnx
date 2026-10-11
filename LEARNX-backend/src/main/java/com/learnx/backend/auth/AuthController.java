package com.learnx.backend.auth;

import com.learnx.backend.model.Faculty;
import com.learnx.backend.model.Student;
import com.learnx.backend.repository.FacultyRepository;
import com.learnx.backend.repository.StudentRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    // Every student can see every subject
    private static final List<String> STUDENT_COURSES = List.of("AIML", "OS", "ACA", "LAB-AIML", "LAB-OS");

    public record LoginRequest(@NotBlank String username, @NotBlank String password) {}

    public record LoginResponse(
            String role,
            String name,
            String rollNo,
            String facultyId,
            String department,
            String designation,
            String batch,
            String section,
            Double cgpa,
            List<String> courses,
            List<String> sections) {}

    private final StudentRepository students;
    private final FacultyRepository faculty;

    public AuthController(StudentRepository students, FacultyRepository faculty) {
        this.students = students;
        this.faculty = faculty;
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest req) {
        String id = req.username().trim().toUpperCase(Locale.ROOT);

        Optional<Student> st = students.findByRollNo(id);
        if (st.isPresent() && req.password().equals(st.get().getPassword())) {
            Student s = st.get();
            return new LoginResponse("student", s.getName(), s.getRollNo(), null,
                    s.getDepartment(), null, s.getBatch(), s.getSection(), s.getCgpa(),
                    STUDENT_COURSES, List.of());
        }

        Optional<Faculty> fa = faculty.findByFacultyId(id);
        if (fa.isPresent() && req.password().equals(fa.get().getPassword())) {
            Faculty f = fa.get();
            return new LoginResponse("faculty", f.getName(), null, f.getFacultyId(),
                    f.getDepartment(), f.getDesignation(), null, null, null,
                    split(f.getCourses()), split(f.getSections()));
        }

        throw new IllegalArgumentException("Invalid ID or password.");
    }

    private static List<String> split(String value) {
        if (value == null || value.isBlank()) return List.of();
        return Arrays.stream(value.split(","))
                .map(String::trim)
                .filter(x -> !x.isEmpty())
                .toList();
    }
}