package com.learnx.backend.repository;

import com.learnx.backend.model.Material;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MaterialRepository extends JpaRepository<Material, Long> {
    List<Material> findByCourseCodeOrderByUploadedAtDesc(String code);
    List<Material> findAllByOrderByUploadedAtDesc();
}