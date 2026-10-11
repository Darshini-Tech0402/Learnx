package com.learnx.backend.repository;

import com.learnx.backend.model.Unit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UnitRepository extends JpaRepository<Unit, Long> {
    Optional<Unit> findBySlug(String slug);
    List<Unit> findByCourseCodeOrderByPositionAsc(String code);
}