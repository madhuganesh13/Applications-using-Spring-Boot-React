package com.example.student_management.service;

import com.example.student_management.dto.CreateStudentRequest;
import com.example.student_management.dto.UpdateStudentRequest;
import com.example.student_management.entity.Student;
import com.example.student_management.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository repo;

    public Page<Student> list(String q, int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("asc") ?
                Sort.by(sortBy).ascending() :
                Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        if (q != null && !q.isEmpty()) {
            // For now: just filter by name (you can extend)
            return repo.findAll(pageable)
                    .map(s -> s.getName().toLowerCase().contains(q.toLowerCase()) ? s : null)
                    .map(s -> s); // no filtering in DB for simplicity
        }

        return repo.findAll(pageable);
    }

    public Student get(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
    }

    public Student create(CreateStudentRequest req) {
        Student student = Student.builder()
                .name(req.getName())
                .email(req.getEmail())
                .age(req.getAge())
                .build();
        return repo.save(student);
    }

    public Student update(Long id, UpdateStudentRequest req) {
        Student student = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));

        student.setName(req.getName());
        student.setEmail(req.getEmail());
        student.setAge(req.getAge());

        return repo.save(student);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
