package com.learnx.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;

@ConfigurationProperties(prefix = "learnx")
public record LearnxProperties(Storage storage, Cors cors) {

    public record Storage(String dir) {}

    public record Cors(List<String> allowedOrigins) {}
}