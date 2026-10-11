package com.learnx.backend.service;

import com.learnx.backend.common.NotFoundException;
import com.learnx.backend.dto.ApiDtos.*;
import com.learnx.backend.model.*;
import com.learnx.backend.repository.QuizAttemptRepository;
import com.learnx.backend.repository.StudentRepository;
import com.learnx.backend.repository.UnitRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class QuizService {

    private final UnitRepository units;
    private final QuizAttemptRepository attempts;
    private final StudentRepository students;

    public QuizService(UnitRepository units, QuizAttemptRepository attempts, StudentRepository students) {
        this.units = units;
        this.attempts = attempts;
        this.students = students;
    }

    // Grading happens here, on the server. The browser cannot change the score.
    public QuizResultDto submit(SubmitQuizRequest req) {
        students.findByRollNo(req.rollNo())
                .orElseThrow(() -> new NotFoundException("Student " + req.rollNo() + " not found"));

        Unit unit = units.findBySlug(req.unitSlug())
                .orElseThrow(() -> new NotFoundException("Unit " + req.unitSlug() + " not found"));

        Map<Long, Question> byId = unit.getQuestions().stream()
                .collect(Collectors.toMap(Question::getId, q -> q));

        if (req.answers().size() != byId.size()) {
            throw new IllegalArgumentException("Answer every question before submitting");
        }

        QuizAttempt attempt = new QuizAttempt(req.rollNo(), unit);
        Set<Long> seen = new HashSet<>();
        List<QuestionResultDto> results = new ArrayList<>();
        int score = 0;

        for (AnswerDto a : req.answers()) {
            Question q = byId.get(a.questionId());
            if (q == null) {
                throw new IllegalArgumentException("Question " + a.questionId() + " is not part of this unit");
            }
            if (!seen.add(q.getId())) {
                throw new IllegalArgumentException("Question " + a.questionId() + " was answered twice");
            }
            if (a.chosenIndex() < 0 || a.chosenIndex() >= q.getOptions().size()) {
                throw new IllegalArgumentException("Option index out of range");
            }

            boolean ok = a.chosenIndex() == q.getCorrectIndex();
            if (ok) score++;

            attempt.addAnswer(new QuizAnswer(q, a.chosenIndex(), ok));
            results.add(new QuestionResultDto(q.getId(), a.chosenIndex(), q.getCorrectIndex(), ok, q.getExplanation()));
        }

        attempt.setScore(score);
        attempt.setTotal(byId.size());
        QuizAttempt saved = attempts.save(attempt);

        return new QuizResultDto(saved.getId(), score, byId.size(), results);
    }

    @Transactional(readOnly = true)
    public List<QuizAttemptDto> attemptsFor(String rollNo) {
        return attempts.findByRollNoOrderByTakenAtDesc(rollNo).stream().map(QuizService::toDto).toList();
    }

    @Transactional(readOnly = true)
    public List<QuizAttemptDto> allAttempts() {
        return attempts.findAllByOrderByTakenAtDesc().stream().map(QuizService::toDto).toList();
    }

    private static QuizAttemptDto toDto(QuizAttempt a) {
        return new QuizAttemptDto(a.getId(), a.getRollNo(), a.getUnit().getSlug(), a.getUnit().getTitle(),
                a.getScore(), a.getTotal(), a.getTakenAt());
    }
}