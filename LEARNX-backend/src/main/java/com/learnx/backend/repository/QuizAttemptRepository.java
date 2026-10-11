package com.learnx.backend.repository;

import com.learnx.backend.model.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    List<QuizAttempt> findByRollNoOrderByTakenAtDesc(String rollNo);
    List<QuizAttempt> findAllByOrderByTakenAtDesc();
}