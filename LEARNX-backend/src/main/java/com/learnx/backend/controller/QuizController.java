package com.learnx.backend.controller;

import com.learnx.backend.dto.ApiDtos.*;
import com.learnx.backend.service.QuizService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quiz-attempts")
public class QuizController {

    private final QuizService quizzes;

    public QuizController(QuizService quizzes) {
        this.quizzes = quizzes;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public QuizResultDto submit(@Valid @RequestBody SubmitQuizRequest request) {
        return quizzes.submit(request);
    }

    // Faculty view: every attempt across the class
    @GetMapping
    public List<QuizAttemptDto> all() {
        return quizzes.allAttempts();
    }
}