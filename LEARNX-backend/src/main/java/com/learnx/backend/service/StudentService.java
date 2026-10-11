package com.learnx.backend.service;

import com.learnx.backend.common.NotFoundException;
import com.learnx.backend.dto.ApiDtos.StudentSummaryDto;
import com.learnx.backend.model.CardMastery;
import com.learnx.backend.model.QuizAttempt;
import com.learnx.backend.model.Student;
import com.learnx.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class StudentService {

    private final StudentRepository students;
    private final QuizAttemptRepository attempts;
    private final SubmissionRepository submissions;
    private final AssignmentRepository assignments;
    private final CardMasteryRepository mastery;
    private final QuestionRepository questions;

    public StudentService(StudentRepository students, QuizAttemptRepository attempts,
                          SubmissionRepository submissions, AssignmentRepository assignments,
                          CardMasteryRepository mastery, QuestionRepository questions) {
        this.students = students;
        this.attempts = attempts;
        this.submissions = submissions;
        this.assignments = assignments;
        this.mastery = mastery;
        this.questions = questions;
    }

    public StudentSummaryDto summary(String rollNo) {
        Student s = student(rollNo);

        List<QuizAttempt> att = attempts.findByRollNoOrderByTakenAtDesc(rollNo);
        Double avg = att.isEmpty() ? null
                : Math.round(att.stream().mapToDouble(a -> 100.0 * a.getScore() / a.getTotal())
                        .average().orElse(0) * 10) / 10.0;

        long submitted = submissions.findByRollNoOrderBySubmittedAtDesc(rollNo).stream()
                .map(x -> x.getAssignment().getId())
                .distinct()
                .count();

        return new StudentSummaryDto(s.getRollNo(), s.getName(), s.getCgpa(), att.size(), avg,
                submitted, assignments.count());
    }

    public List<Long> masteredQuestionIds(String rollNo) {
        student(rollNo);
        return mastery.findByRollNo(rollNo).stream().map(CardMastery::getQuestionId).toList();
    }

    @Transactional
    public void setMastered(String rollNo, Long questionId, boolean mastered) {
        student(rollNo);
        if (!questions.existsById(questionId)) {
            throw new NotFoundException("Question " + questionId + " not found");
        }
        if (mastered) {
            if (this.mastery.findByRollNoAndQuestionId(rollNo, questionId).isEmpty()) {
                this.mastery.save(new CardMastery(rollNo, questionId));
            }
        } else {
            this.mastery.deleteByRollNoAndQuestionId(rollNo, questionId);
        }
    }

    private Student student(String rollNo) {
        return students.findByRollNo(rollNo)
                .orElseThrow(() -> new NotFoundException("Student " + rollNo + " not found"));
    }
}