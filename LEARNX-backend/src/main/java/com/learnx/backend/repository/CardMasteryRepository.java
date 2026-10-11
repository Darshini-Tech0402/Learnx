package com.learnx.backend.repository;

import com.learnx.backend.model.CardMastery;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CardMasteryRepository extends JpaRepository<CardMastery, Long> {
    List<CardMastery> findByRollNo(String rollNo);
    Optional<CardMastery> findByRollNoAndQuestionId(String rollNo, Long questionId);
    void deleteByRollNoAndQuestionId(String rollNo, Long questionId);
}