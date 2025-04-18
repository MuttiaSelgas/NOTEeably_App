package com.g3appdev.noteably.dto;

public class StudentResponseDto {
    private String studentId;
    private String name;
    private String course;
    private String contactNumber;
    private String email;
    private String profilePicture;

    public StudentResponseDto() {}

    public StudentResponseDto(String studentId, String name, String course, String contactNumber, String email, String profilePicture) {
        this.studentId = studentId;
        this.name = name;
        this.course = course;
        this.contactNumber = contactNumber;
        this.email = email;
        this.profilePicture = profilePicture;
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

    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }
}
