package com.example.student_management.service;

import com.example.student_management.dto.CreateStudentRequest;
import com.example.student_management.dto.UpdateStudentRequest;
import com.example.student_management.entity.Student;
import com.example.student_management.exception.NotFoundException;
import com.example.student_management.repository.StudentRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository repo;

    @PersistenceContext
    private EntityManager entityManager;

    public Page<Student> list(String q, int page, int size, String sortBy, String direction) {
        Sort sort = Sort.by("id");
        if (sortBy != null && !sortBy.isBlank()) {
            sort = Sort.by(sortBy);
        }
        sort = "desc".equalsIgnoreCase(direction) ? sort.descending() : sort.ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Specification<Student> spec = StudentSpecifications.search(q);
        return repo.findAll(spec, pageable);
    }

    public Student get(Long id) {
        return repo.findById(id).orElseThrow(() -> new NotFoundException("Student not found: " + id));
    }

    public Student create(CreateStudentRequest req) {
        if (repo.existsByEmail(req.email())) {
            throw new IllegalArgumentException("Email already exists");
        }
        Student s = Student.builder()
                .firstName(req.firstName())
                .lastName(req.lastName())
                .email(req.email())
                .dateOfBirth(req.dateOfBirth())
                .gender(req.gender())
                .department(req.department())
                .gpa(req.gpa())
                .build();
        try {
            return repo.save(s);
        } catch (DataIntegrityViolationException e) {
            throw new IllegalArgumentException("Invalid data");
        }
    }

    public Student update(Long id, UpdateStudentRequest req) {
        Student s = get(id);
        s.setFirstName(req.firstName());
        s.setLastName(req.lastName());
        s.setEmail(req.email());
        s.setDateOfBirth(req.dateOfBirth());
        s.setGender(req.gender());
        s.setDepartment(req.department());
        s.setGpa(req.gpa());
        try {
            return repo.save(s);
        } catch (DataIntegrityViolationException e) {
            throw new IllegalArgumentException("Invalid data or duplicate email");
        }
    }

    public void delete(Long id) {
        Student s = get(id);
        repo.delete(s); // ❌ Removed ID reset here
    }

    @Transactional
    public void reset() {
        repo.deleteAll();
        entityManager.createNativeQuery("ALTER TABLE student ALTER COLUMN id RESTART WITH 1").executeUpdate();
    }
}
