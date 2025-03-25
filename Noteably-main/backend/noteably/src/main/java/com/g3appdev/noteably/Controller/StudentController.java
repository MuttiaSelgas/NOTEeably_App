package com.g3appdev.noteably.Controller;

import com.g3appdev.noteably.Entity.StudentEntity;
import com.g3appdev.noteably.Service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;
import java.io.IOException;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:3000", 
    allowedHeaders = "*",
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE},
    allowCredentials = "true",
    maxAge = 3600)
public class StudentController {

    @Autowired
    private StudentService studentService;

    // Get all students
    @GetMapping
    public List<StudentEntity> getAllStudents() {
        System.out.println("Fetching all students...");
        return studentService.getAllStudents();
    }

    // Get a student by their ID
    @GetMapping("/{id}")
    public StudentEntity getStudentById(@PathVariable int id) {
        System.out.println("Fetching student with ID: " + id);
        return studentService.getStudentById(id);
    }

    // Get a student by their custom StudentID
    @GetMapping("/find/{studentId}")
    public StudentEntity getStudentByStudentId(@PathVariable String studentId) {
        System.out.println("Fetching student with StudentID: " + studentId);
        return studentService.getStudentByStudentId(studentId);
    }

    // Register a new student
    @PostMapping("/register")
    public StudentEntity registerStudent(@RequestBody StudentEntity studentEntity) {
        // Log sensitive information carefully: Passwords should ideally be encrypted or hidden in logs
        System.out.println("Registering new student: " + studentEntity.getName() + 
                           ", Email: " + studentEntity.getEmail());
        // You might still want to print the password here, but keep it safe and secure
        // If you really need to log the password for debugging purposes (development only):
        System.out.println("Password (Plain-text for debugging): " + studentEntity.getPassword());

        return studentService.registerStudent(studentEntity);
    }

    // Update an existing student
    @PutMapping("/{id}")
    public StudentEntity updateStudent(@RequestBody StudentEntity studentEntity, @PathVariable int id) {
        // Log the ID and other fields
        System.out.println("Updating student with ID: " + id + 
                           ", New Password: " + studentEntity.getPassword());
        // Again, avoid logging passwords in production but it’s okay for development
        return studentService.updateStudent(studentEntity, id);
    }

    // Delete a student by ID
    @DeleteMapping("/{id}")
    public String deleteStudent(@PathVariable int id) {
        System.out.println("Deleting student with ID: " + id);
        return studentService.deleteStudent(id);
    }

    // Login endpoint
    @PostMapping("/login")
    public StudentEntity loginStudent(@RequestBody Map<String, String> credentials) {
        System.out.println("Login attempt for email: " + credentials.get("email"));
        return studentService.loginStudent(credentials.get("email"), credentials.get("password"));
    }

    // Upload profile picture
    @PostMapping("/{id}/profile-picture")
    public StudentEntity uploadProfilePicture(@PathVariable int id, @RequestParam("file") MultipartFile file) {
        try {
            return studentService.updateProfilePicture(id, file);
        } catch (IOException e) {
            throw new RuntimeException("Could not upload profile picture", e);
        }
    }
}
