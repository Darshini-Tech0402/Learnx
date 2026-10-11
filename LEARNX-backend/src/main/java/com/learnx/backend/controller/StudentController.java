package com.learnx.backend.controller;

import com.learnx.backend.dto.ApiDtos.*;
import com.learnx.backend.service.QuizService;
import com.learnx.backend.service.StudentService;
import com.learnx.backend.service.SubmissionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students/{roll}")
public class StudentController {

    private final StudentService students;
    private final QuizService quizzes;
    private final SubmissionService submissions;

    public StudentController(StudentService students, QuizService quizzes, SubmissionService submissions) {
        this.students = students;
        this.quizzes = quizzes;
        this.submissions = submissions;
    }

    @GetMapping("/summary")
    public StudentSummaryDto summary(@PathVariable String roll) {
        return students.summary(roll);
    }

    @GetMapping("/quiz-attempts")
    public List<QuizAttemptDto> quizAttempts(@PathVariable String roll) {
        return quizzes.attemptsFor(roll);
    }

    @GetMapping("/submissions")
    public List<SubmissionDto> submissions(@PathVariable String roll) {
        return submissions.list(null, roll);
    }

    @GetMapping("/mastery")
    public List<Long> mastery(@PathVariable String roll) {
        return students.masteredQuestionIds(roll);
    }

    @PutMapping("/mastery/{questionId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void setMastery(@PathVariable String roll,
                           @PathVariable Long questionId,
                           @Valid @RequestBody MasteryRequest request) {
        students.setMastered(roll, questionId, request.mastered());
    }
}