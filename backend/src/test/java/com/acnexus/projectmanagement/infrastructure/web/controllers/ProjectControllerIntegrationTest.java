package com.acnexus.projectmanagement.infrastructure.web.controllers;

import com.acnexus.projectmanagement.application.dto.projects.CreateProjectCommand;
import com.acnexus.projectmanagement.domain.model.ProjectStatus;
import com.acnexus.projectmanagement.domain.ports.out.CurrentUserPort;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class ProjectControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private CurrentUserPort currentUserPort;

    @Test
    @WithMockUser(roles = "MEMBER")
    void createProject_ShouldReturnCreatedProject() throws Exception {
        UUID userId = UUID.randomUUID();
        when(currentUserPort.getCurrentUserId()).thenReturn(userId);

        CreateProjectCommand command = CreateProjectCommand.builder()
                .name("Integration Test Project")
                .description("Test Description")
                .build();

        mockMvc.perform(post("/api/projects")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(command)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Integration Test Project"))
                .andExpect(jsonPath("$.status").value(ProjectStatus.DRAFT.toString()));
    }

    @Test
    @WithMockUser(roles = "MEMBER")
    void listProjects_ShouldReturnProjects() throws Exception {
        mockMvc.perform(get("/api/projects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }
}
