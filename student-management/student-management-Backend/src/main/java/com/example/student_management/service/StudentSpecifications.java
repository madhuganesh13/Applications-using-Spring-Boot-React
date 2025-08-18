package com.example.student_management.service;



import com.example.student_management.entity.Student;
import org.springframework.data.jpa.domain.Specification;

public class StudentSpecifications {
    public static Specification<Student> search(String q) {
        if (q == null || q.isBlank()) return (root, query, cb) -> cb.conjunction();
        String like = "%" + q.toLowerCase() + "%";
        return (root, query, cb) -> cb.or(
                cb.like(cb.lower(root.get("firstName")), like),
                cb.like(cb.lower(root.get("lastName")), like),
                cb.like(cb.lower(root.get("email")), like),
                cb.like(cb.lower(root.get("department")), like)
        );
    }
}
