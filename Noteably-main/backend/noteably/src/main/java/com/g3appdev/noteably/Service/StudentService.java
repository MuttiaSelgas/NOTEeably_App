package com.g3appdev.noteably.Service;

import com.g3appdev.noteably.Entity.StudentEntity;
import com.g3appdev.noteably.Repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

@Service
public class StudentService implements UserDetailsService {

    @Autowired
    private StudentRepository studentRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private FileService fileService;

    @Autowired
    private FileStorageService fileStorageService;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return studentRepo.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Student not found with email: " + username));
    }

    public List<StudentEntity> getAllStudents() {
        return studentRepo.findAll();
    }

    public StudentEntity getStudentById(int id) {
        return studentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with ID: " + id));
    }

    public StudentEntity getStudentByStudentId(String studentId) {
        return studentRepo.findByStudentId(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with StudentID: " + studentId));
    }

    public StudentEntity registerStudent(StudentEntity studentEntity) {
        if (studentRepo.findByEmail(studentEntity.getEmail()).isPresent()) {
            throw new RuntimeException("A student with this email already exists.");
        }

        // Set default role if not set
        if (studentEntity.getRole() == null || studentEntity.getRole().isEmpty()) {
            studentEntity.setRole("USER");
        }

        studentEntity.setPassword(passwordEncoder.encode(studentEntity.getPassword()));
        StudentEntity savedStudent = studentRepo.save(studentEntity);
        savedStudent.generateStudentId();
        return studentRepo.save(savedStudent);
    }

    public StudentEntity updateStudent(StudentEntity studentEntity, int id) {
        StudentEntity existingStudent = getStudentById(id);

        existingStudent.setName(studentEntity.getName());
        existingStudent.setCourse(studentEntity.getCourse());
        existingStudent.setContactNumber(studentEntity.getContactNumber());
        existingStudent.setEmail(studentEntity.getEmail());

        if (studentEntity.getPassword() != null && !studentEntity.getPassword().isEmpty()) {
            existingStudent.setPassword(passwordEncoder.encode(studentEntity.getPassword()));
        }

        return studentRepo.save(existingStudent);
    }

    public String deleteStudent(int id) {
        studentRepo.deleteById(id);
        return "Student deleted successfully";
    }

    public StudentEntity loginStudent(String email, String password) {
        StudentEntity student = studentRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found with email: " + email));

        System.out.println("LoginStudent: raw password: " + password);
        System.out.println("LoginStudent: stored password hash: " + student.getPassword());

        if (!passwordEncoder.matches(password, student.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return student;
    }

    public StudentEntity updateProfilePicture(int id, MultipartFile file) throws IOException {
        StudentEntity student = getStudentById(id);
        String fileUrl = fileStorageService.storeFile(id, file);
        student.setProfilePicture(fileUrl);
        return studentRepo.save(student);
    }
    
    private String getAbsoluteUploadPath() {
        return new File(uploadDir).getAbsolutePath();
    }
}

