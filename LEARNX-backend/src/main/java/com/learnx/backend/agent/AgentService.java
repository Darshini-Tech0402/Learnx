package com.learnx.backend.agent;

import org.springframework.stereotype.Service;

@Service
public class AgentService {

    private static final String SYSTEM = """
            You are the LearnX study assistant for university students.
            Keep answers short, clear and accurate. Use plain sentences, no markdown headings.
            Base your answer on the material provided. If the material does not cover the question,
            say so and give the general concept briefly.
            """;

    private final AnthropicClient client;

    public AgentService(AnthropicClient client) {
        this.client = client;
    }

    public String reply(AgentRequest req) {
        String mode = req.mode() == null ? "ask" : req.mode();
        String context = req.context() == null ? "" : req.context();

        return switch (mode) {
            case "summarize" -> client.complete(SYSTEM,
                    "Summarize the following study material in 3 to 5 sentences:\n\n" + context);

            case "explain" -> {
                AgentRequest.Mistake m = req.mistake();
                if (m == null) yield "No mistake was provided to explain.";
                yield client.complete(SYSTEM, """
                        A student answered a question incorrectly.
                        Question: %s
                        Their answer: %s
                        Correct answer: %s
                        Reference reason: %s

                        Explain the underlying topic in 3 to 4 sentences so the student understands
                        why the correct answer is right and what concept they missed.
                        """.formatted(m.question(), m.chosen(), m.correct(), m.why()));
            }
            case "points" -> client.complete(SYSTEM, """
                    Summarize the following unit for a student.
                    First give 5 to 7 short bullet points, each starting with "- ".
                    Then write the line "Important topics:" followed by 3 to 5 bullet points
                    naming the most exam-important topics. Use simple English.

                    Unit material:
                    """ + context);

            default -> client.complete(SYSTEM, """
                    Study material for this page:
                    %s

                    Student question: %s

                    Answer using the material where possible.
                    """.formatted(context, req.question() == null ? "" : req.question()));
        };
    }
}