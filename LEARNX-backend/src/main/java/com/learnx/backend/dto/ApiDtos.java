package com.learnx.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

public final class ApiDtos {

    private ApiDtos() {}

    // Catalog
    public record CourseDto(Long id, String code, String name) {}
    public record UnitSummaryDto(String slug, String title, int questionCount) {}
    public record QuestionDto(Long id, String text, List<String> options, int correctIndex, String explanation) {}
    public record UnitDto(String slug, String title, String summary, String courseCode, List<QuestionDto> questions) {}

    // Quiz
    public record AnswerDto(@NotNull Long questionId, @NotNull Integer chosenIndex) {}
    public record SubmitQuizRequest(
            @NotBlank String rollNo,
            @NotBlank String unitSlug,
            @NotEmpty @Valid List<AnswerDto> answers) {}
    public record QuestionResultDto(Long questionId, int chosenIndex, int correctIndex, boolean correct, String explanation) {}
    public record QuizResultDto(Long attemptId, int score, int total, List<QuestionResultDto> results) {}
    public record QuizAttemptDto(Long id, String rollNo, String unitSlug, String unitTitle, int score, int total, Instant takenAt) {}

    // Assignments and submissions
    public record AssignmentDto(Long id, String courseCode, String title, String topic, LocalDateTime dueAt) {}
    public record SubmissionDto(Long id, Long assignmentId, String rollNo, String fileName,
                                long sizeBytes, int version, Instant submittedAt, boolean late) {}

    // Materials
    public record MaterialDto(Long id, String courseCode, String title, String category,
                              String fileName, long sizeBytes, Instant uploadedAt) {}

    // Student
    public record MasteryRequest(@NotNull Boolean mastered) {}
    public record StudentSummaryDto(String rollNo, String name, Double cgpa, int quizzesTaken,
                                    Double averageQuizPercent, long assignmentsSubmitted, long assignmentsTotal) {}
}