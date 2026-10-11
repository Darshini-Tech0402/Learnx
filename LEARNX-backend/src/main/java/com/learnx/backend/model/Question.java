package com.learnx.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "questions")
@Getter
@Setter
@NoArgsConstructor
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "unit_id")
    private Unit unit;

    @Column(nullable = false, length = 600)
    private String text;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "question_options", joinColumns = @JoinColumn(name = "question_id"))
    @OrderColumn(name = "option_index")
    @Column(nullable = false, length = 300)
    private List<String> options = new ArrayList<>();

    @Column(nullable = false)
    private int correctIndex;

    @Column(nullable = false, length = 800)
    private String explanation;

    @Column(nullable = false)
    private int position;

    public Question(String text, List<String> options, int correctIndex, String explanation, int position) {
        this.text = text;
        this.options = new ArrayList<>(options);
        this.correctIndex = correctIndex;
        this.explanation = explanation;
        this.position = position;
    }
}