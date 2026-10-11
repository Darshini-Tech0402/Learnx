package com.learnx.backend.controller;

import com.learnx.backend.dto.ApiDtos.*;
import com.learnx.backend.service.CatalogService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CatalogController {

    private final CatalogService catalog;

    public CatalogController(CatalogService catalog) {
        this.catalog = catalog;
    }

    @GetMapping("/courses")
    public List<CourseDto> courses() {
        return catalog.courses();
    }

    @GetMapping("/courses/{code}/units")
    public List<UnitSummaryDto> units(@PathVariable String code) {
        return catalog.unitsFor(code);
    }

    @GetMapping("/units/{slug}")
    public UnitDto unit(@PathVariable String slug) {
        return catalog.unit(slug);
    }
}