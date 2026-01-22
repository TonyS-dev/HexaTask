package com.acnexus.projectmanagement.application.dto.projects;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateProjectCommand {
    private String name;
    private String description;
}
