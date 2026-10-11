package com.learnx.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "card_mastery",
       uniqueConstraints = @UniqueConstraint(columnNames = {"roll_no", "question_id"}))
@Getter
@Setter
@NoArgsConstructor
public class CardMastery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 20)
    private String rollNo;

    // The flashcard id is the question id, so one question is one card
    @Column(nullable = false)
    private Long questionId;

    @Column(nullable = false)
    private Instant markedAt = Instant.now();

    public CardMastery(String rollNo, Long questionId) {
        this.rollNo = rollNo;
        this.questionId = questionId;
    }
}