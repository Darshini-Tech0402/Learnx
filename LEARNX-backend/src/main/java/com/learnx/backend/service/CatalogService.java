package com.learnx.backend.service;

import com.learnx.backend.common.NotFoundException;
import com.learnx.backend.dto.ApiDtos.*;
import com.learnx.backend.model.Unit;
import com.learnx.backend.repository.CourseRepository;
import com.learnx.backend.repository.UnitRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class CatalogService {

    private final CourseRepository courses;
    private final UnitRepository units;

    public CatalogService(CourseRepository courses, UnitRepository units) {
        this.courses = courses;
        this.units = units;
    }

    public List<CourseDto> courses() {
        return courses.findAll(Sort.by("name")).stream()
                .map(c -> new CourseDto(c.getId(), c.getCode(), c.getName()))
                .toList();
    }

    public List<UnitSummaryDto> unitsFor(String courseCode) {
        courses.findByCode(courseCode)
                .orElseThrow(() -> new NotFoundException("Course " + courseCode + " not found"));
        return units.findByCourseCodeOrderByPositionAsc(courseCode).stream()
                .map(u -> new UnitSummaryDto(u.getSlug(), u.getTitle(), u.getQuestions().size()))
                .toList();
    }

    public UnitDto unit(String slug) {
        Unit u = units.findBySlug(slug)
                .orElseThrow(() -> new NotFoundException("Unit " + slug + " not found"));
        List<QuestionDto> questions = u.getQuestions().stream()
                .map(q -> new QuestionDto(q.getId(), q.getText(), List.copyOf(q.getOptions()),
                        q.getCorrectIndex(), q.getExplanation()))
                .toList();
        return new UnitDto(u.getSlug(), u.getTitle(), u.getSummary(), u.getCourse().getCode(), questions);
    }
}