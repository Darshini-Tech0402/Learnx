package com.learnx;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class LearnxBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(LearnxBackendApplication.class, args);
    }
}