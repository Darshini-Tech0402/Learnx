package com.learnx.backend.seed;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.learnx.backend.model.*;
import com.learnx.backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final String DEPT = "Computer Science and Engineering";
    private static final String BATCH = "2024-2028";

    // Sections and how many students each one has
    private static final String[] SECTIONS = {"J", "K", "L", "M"};
    private static final int[] COUNTS = {65, 60, 60, 60};

    // 13 first names x 5 last names: gives 65 different full names
    private static final String[] FIRST = {"Aarav", "Vihaan", "Ananya", "Ishaan", "Diya", "Kabir", "Meera",
            "Arjun", "Sneha", "Rohan", "Pooja", "Aditya", "Kavya"};
    private static final String[] LAST = {"Reddy", "Sharma", "Iyer", "Verma", "Patel"};

    // Shape of catalog.json. The "students" part is ignored; students are generated below.
    public record SeedData(List<SeedCourse> courses, List<SeedAssignment> assignments, List<SeedStudent> students) {}
    public record SeedCourse(String code, String name, List<SeedUnit> units) {}
    public record SeedUnit(String slug, String title, String summary, List<SeedQuestion> questions) {}
    public record SeedQuestion(String text, List<String> options, int correctIndex, String explanation) {}
    public record SeedAssignment(String courseCode, String title, String topic, LocalDateTime dueAt) {}
    public record SeedStudent(String rollNo, String name, Double cgpa, String section) {}

    private final ObjectMapper mapper;
    private final CourseRepository courses;
    private final UnitRepository units;
    private final AssignmentRepository assignments;
    private final StudentRepository students;
    private final FacultyRepository faculty;

    public DataSeeder(ObjectMapper mapper, CourseRepository courses, UnitRepository units,
                      AssignmentRepository assignments, StudentRepository students,
                      FacultyRepository faculty) {
        this.mapper = mapper;
        this.courses = courses;
        this.units = units;
        this.assignments = assignments;
        this.students = students;
        this.faculty = faculty;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (courses.count() == 0) seedCatalog();
        seedStudents();
        seedFaculty();
    }

    private void seedCatalog() throws Exception {
        SeedData data;
        try (InputStream in = new ClassPathResource("seed/catalog.json").getInputStream()) {
            data = mapper.readValue(in, SeedData.class);
        }

        for (SeedCourse sc : data.courses()) {
            Course course = courses.save(new Course(sc.code(), sc.name()));
            for (int u = 0; u < sc.units().size(); u++) {
                SeedUnit su = sc.units().get(u);
                Unit unit = new Unit(su.slug(), su.title(), su.summary(), u, course);
                for (int q = 0; q < su.questions().size(); q++) {
                    SeedQuestion sq = su.questions().get(q);
                    unit.addQuestion(new Question(sq.text(), sq.options(), sq.correctIndex(), sq.explanation(), q));
                }
                units.save(unit);
            }
        }

        for (SeedAssignment sa : data.assignments()) {
            Course course = courses.findByCode(sa.courseCode())
                    .orElseThrow(() -> new IllegalStateException("Unknown course " + sa.courseCode()));
            assignments.save(new Assignment(course, sa.title(), sa.topic(), sa.dueAt()));
        }
    }

    // Creates each student if missing, otherwise updates the existing row.
    // Nothing is deleted, so quiz results and uploads (stored by roll number) are kept.
    private void seedStudents() {
        int g = 0; // running number across all sections, used for names and CGPA
        for (int s = 0; s < SECTIONS.length; s++) {
            String section = SECTIONS[s];
            for (int n = 1; n <= COUNTS[s]; n++) {
                g++;
                String roll = section + String.format("%02d", n);

                String name = FIRST[(g - 1) % FIRST.length] + " " + LAST[(g - 1) % LAST.length];
                String password = roll.toLowerCase() + "@123";
                double cgpa = Math.round((6 + ((g * 37) % 35) / 10.0) * 100) / 100.0;

                // Your own login keeps its password and name
                if (roll.equals("J65")) {
                    name = "T Darshini Deetya";
                    password = "student123";
                    cgpa = 8.5;
                }

                Student st = students.findByRollNo(roll).orElseGet(Student::new);
                st.setRollNo(roll);
                st.setName(name);
                st.setCgpa(cgpa);
                st.setSection(section);
                st.setDepartment(DEPT);
                st.setBatch(BATCH);
                st.setPassword(password);
                students.save(st);
            }
        }
    }

    private void seedFaculty() {
        upsertFaculty("FAC01", "Dr. Ravi Kumar", "Professor", "faculty1", "AIML,LAB-AIML");
        upsertFaculty("FAC02", "Dr. Sunitha Reddy", "Associate Professor", "faculty2", "OS,LAB-OS");
        upsertFaculty("FAC03", "Mr. Anil Varma", "Assistant Professor", "faculty3", "ACA");
        upsertFaculty("FAC04", "Ms. Priya Nair", "Assistant Professor", "faculty4", "");
    }

    private void upsertFaculty(String id, String name, String designation, String password, String courseCodes) {
        Faculty f = faculty.findByFacultyId(id).orElseGet(Faculty::new);
        f.setFacultyId(id);
        f.setName(name);
        f.setDesignation(designation);
        f.setDepartment(DEPT);
        f.setPassword(password);
        f.setCourses(courseCodes);
        f.setSections("J,K,L,M");
        faculty.save(f);
    }
}