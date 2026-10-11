package com.learnx.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "assignments")
@Getter
@Setter
@NoArgsConstructor
public class Assignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "course_id")
    private Course course;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 300)
    private String topic;

    // Local time (Asia/Kolkata). The deadline is 23:59 on this date.
    @Column(nullable = false)
    private LocalDateTime dueAt;

    public Assignment(Course course, String title, String topic, LocalDateTime dueAt) {
        this.course = course;
        this.title = title;
        this.topic = topic;
        this.dueAt = dueAt;
    }
}