package com.example.student_management.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record CreateStudentRequest(
        @NotBlank @Size(max=100) String firstName,
        @NotBlank @Size(max=100) String lastName,
        @NotBlank @Email @Size(max=200) String email,
        @Past LocalDate dateOfBirth,
        @NotBlank @Pattern(regexp="Male|Female|Other") String gender,
        @NotBlank @Size(max=100) String department,
        @DecimalMin("0.0") @DecimalMax("10.0") Double gpa
) {}
