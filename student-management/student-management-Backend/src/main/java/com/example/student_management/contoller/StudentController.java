package com.example.student_management.contoller;


import com.example.student_management.dto.CreateStudentRequest;
import com.example.student_management.dto.PageResponse;
import com.example.student_management.dto.UpdateStudentRequest;
import com.example.student_management.entity.Student;
import com.example.student_management.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService service;

    @GetMapping
    public PageResponse<Student> list(
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction
    ) {
        Page<Student> p = service.list(q, page, size, sortBy, direction);
        return new PageResponse<>(p.getContent(), p.getNumber(), p.getSize(), p.getTotalElements(), p.getTotalPages());
    }

    @GetMapping("/{id}")
    public Student get(@PathVariable Long id) {
        return service.get(id);
    }

    @PostMapping
    public Student create(@RequestBody @jakarta.validation.Valid CreateStudentRequest req) {
        return service.create(req);
    }

    @PutMapping("/{id}")
    public Student update(@PathVariable Long id, @RequestBody @jakarta.validation.Valid UpdateStudentRequest req) {
        return service.update(id, req);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
    @DeleteMapping("/reset")
public void reset() {
    service.reset();
}


}





