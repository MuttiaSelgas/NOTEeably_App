package com.g3appdev.noteably.Repository;

import com.g3appdev.noteably.Entity.StudentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentRepository extends JpaRepository<StudentEntity, Integer> {
    // Find student by their custom StudentID
    Optional<StudentEntity> findByStudentId(String studentId);

    // Find student by email (useful for login purposes)
    Optional<StudentEntity> findByEmail(String email);
}
