package com.g3appdev.noteably.Entity;

import jakarta.persistence.Column; // Importing Column annotation
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class StudentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id; // Primary auto-increment ID

    private String studentId; // Custom-patterned ID
    private String name;
    private String course;
    private String contactNumber;
private String email; // Unique email for student accounts

// Add unique constraint
 @Column(unique = true)
    private String password;
    private String profilePicture;
    

    // Auto-generate the custom StudentID
    public void generateStudentId() {
        this.studentId = "STU" + String.format("%05d", this.id); // Example: STU00001
    }

    public int getId() {
        return id;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }
}
