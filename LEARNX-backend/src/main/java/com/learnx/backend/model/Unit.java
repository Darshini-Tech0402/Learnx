package com.learnx.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "units")
@Getter
@Setter
@NoArgsConstructor
public class Unit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 60)
    private String slug;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 2000)
    private String summary;

    @Column(nullable = false)
    private int position;

    @ManyToOne(optional = false)
    @JoinColumn(name = "course_id")
    private Course course;

    @OneToMany(mappedBy = "unit", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("position ASC")
    private List<Question> questions = new ArrayList<>();

    public Unit(String slug, String title, String summary, int position, Course course) {
        this.slug = slug;
        this.title = title;
        this.summary = summary;
        this.position = position;
        this.course = course;
    }

    public void addQuestion(Question q) {
        q.setUnit(this);
        questions.add(q);
    }

	public Object atZone(ZoneId zone) {
		// TODO Auto-generated method stub
		return null;
	}
}