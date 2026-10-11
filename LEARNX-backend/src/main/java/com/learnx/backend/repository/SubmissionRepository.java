package com.learnx.backend.repository;

import com.learnx.backend.model.Submission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    Optional<Submission> findFirstByAssignmentIdAndRollNoOrderByVersionDesc(Long assignmentId, String rollNo);
    List<Submission> findByAssignmentIdOrderByRollNoAscVersionDesc(Long assignmentId);
    List<Submission> findByRollNoOrderBySubmittedAtDesc(String rollNo);
    List<Submission> findAllByOrderBySubmittedAtDesc();
}