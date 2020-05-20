package com.marklogic.hub.central.controllers.steps;

import com.fasterxml.jackson.databind.node.ArrayNode;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class IngestionStepControllerTest extends AbstractStepControllerTest {

    private final static String PATH = "/api/steps/ingestion";

    public static class IngestionStep {
        public String name;
        public String description;
        public String sourceFormat;
        public String targetFormat;
        public String outputURIReplacement;
    }

    public static IngestionStep newDefaultIngestionStep(String name) {
        IngestionStep step = new IngestionStep();
        step.name = name;
        step.description = "the description";
        step.sourceFormat = "json";
        step.targetFormat = "json";
        return step;
    }

    @Test
    void test() throws Exception {
        verifyCommonStepEndpoints(PATH, objectMapper.valueToTree(newDefaultIngestionStep("myIngestionStep")), "default-ingestion", "ingestion");
    }

    @Test
    void getIngestionSteps() throws Exception {
        postJson(PATH + "/firstStep", newDefaultIngestionStep("firstStep"));
        postJson(PATH + "/secondStep", newDefaultIngestionStep("secondStep"));

        getJson(PATH)
            .andExpect(status().isOk())
            .andDo(result -> {
                ArrayNode array = (ArrayNode) parseJsonResponse(result);
                assertEquals(2, array.size());
                assertEquals("firstStep", array.get(0).get("name").asText());
                assertEquals("secondStep", array.get(1).get("name").asText());
            });
    }
}