package com.g3appdev.noteably.Controller;

import com.g3appdev.noteably.Entity.StudentEntity;
import com.g3appdev.noteably.Service.StudentService;
import com.g3appdev.noteably.Service.JWT;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import com.g3appdev.noteably.dto.StudentResponseDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;
import java.io.IOException;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(
    origins = {
        "http://localhost:3000",
        "https://noteably-app.vercel.app",        // production frontend domain
        "https://noteably-app-git-main-muttia-selgas-projects.vercel.app"  // preview deployment
    },

    allowedHeaders = "*",
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE},
    allowCredentials = "true",
    maxAge = 3600)
public class StudentController {

    @Autowired
    private StudentService studentService;

    @Autowired
    private JWT jwt;

    @Autowired
    private UserDetailsService userDetailsService;

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
    public StudentResponseDto registerStudent(@RequestBody StudentEntity studentEntity) {
        System.out.println("Registering new student: " + studentEntity.getName() + 
                           ", Email: " + studentEntity.getEmail());
        System.out.println("Password (Plain-text for debugging): " + studentEntity.getPassword());

        StudentEntity savedStudent = studentService.registerStudent(studentEntity);

        StudentResponseDto response = new StudentResponseDto();
        response.setStudentId(savedStudent.getStudentId());
        response.setName(savedStudent.getName());
        response.setCourse(savedStudent.getCourse());
        response.setContactNumber(savedStudent.getContactNumber());
        response.setEmail(savedStudent.getEmail());
        response.setProfilePicture(savedStudent.getProfilePicture());

        return response;
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
    public Map<String, Object> loginStudent(@RequestBody Map<String, String> credentials) {
        System.out.println("Login attempt for email: " + credentials.get("email"));
        try {
            StudentEntity student = studentService.loginStudent(credentials.get("email"), credentials.get("password"));
            UserDetails userDetails = userDetailsService.loadUserByUsername(credentials.get("email"));
            String token = jwt.generateToken(userDetails);
            System.out.println("Generated JWT token: " + token);

            StudentResponseDto response = new StudentResponseDto();
            response.setStudentId(student.getStudentId());
            response.setName(student.getName());
            response.setCourse(student.getCourse());
            response.setContactNumber(student.getContactNumber());
            response.setEmail(student.getEmail());
            response.setProfilePicture(student.getProfilePicture());

            Map<String, Object> result = new java.util.HashMap<>();
            result.put("token", token);
            result.put("student", response);
            return result;
        } catch (RuntimeException e) {
            System.err.println("Login error: " + e.getMessage());
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.UNAUTHORIZED, e.getMessage());
        }
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
