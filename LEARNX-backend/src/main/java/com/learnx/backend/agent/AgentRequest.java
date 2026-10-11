package com.learnx.backend.agent;

import jakarta.validation.constraints.Size;

public record AgentRequest(
        String mode,
        @Size(max = 20000) String context,
        @Size(max = 1000) String question,
        Mistake mistake) {

    public record Mistake(String question, String chosen, String correct, String why) {}
}