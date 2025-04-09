package com.g3appdev.noteably.Entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "schedule")
public class ScheduleEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int scheduleID;
    private int studentId;

   

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String priority;

    @Column(nullable = false)
    private String colorCode;

    @Column(nullable = false)
    private LocalDate startDate; // Use LocalDate for date validation

    @Column
    private LocalDate endDate;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "sched", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ToDoListEntity> tasks;

    // Getters and Setters

    public int getStudentId() {
        return studentId;
    }

    public void setStudentId(int studentId) {
        this.studentId = studentId;
    }

    public int getScheduleID() {
        return scheduleID;
    }

    public void setScheduleID(int scheduleID) {
        this.scheduleID = scheduleID;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getColorCode() {
        return colorCode;
    }

    public void setColorCode(String colorCode) {
        this.colorCode = colorCode;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public List<ToDoListEntity> getTasks() {
        return tasks;
    }

    public void setTasks(List<ToDoListEntity> tasks) {
        this.tasks = tasks;
    }
}
