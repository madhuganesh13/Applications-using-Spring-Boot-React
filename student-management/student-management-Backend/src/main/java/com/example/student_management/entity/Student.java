package com.example.student_management.entity;



import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "students", uniqueConstraints = @UniqueConstraint(columnNames = "email"))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 100)
    private String firstName;

    @NotBlank
    @Size(max = 100)
    private String lastName;

    @NotBlank
    @Email
    @Size(max = 200)
    private String email;

    @Past
    private LocalDate dateOfBirth;

    @NotBlank
    @Pattern(regexp = "Male|Female|Other")
    private String gender;

    @NotBlank
    @Size(max = 100)
    private String department;

    @DecimalMin("0.0")
    @DecimalMax("10.0")
    private Double gpa;
}
