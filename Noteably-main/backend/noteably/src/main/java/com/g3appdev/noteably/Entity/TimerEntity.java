package com.g3appdev.noteably.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class TimerEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id") // Specify the actual column name in the database
    private int timerID;

    
    private int hours;
    private int minutes;
    private int seconds;
    private String title;
    

    private int studentId; // New field to associate timer with a student

    // Default constructor
    public TimerEntity() {
        super();
    }

    // Constructor with parameters
    public TimerEntity(int timerID, int hours, int minutes, int seconds, String title) {
        super();
        this.timerID = timerID;
        this.hours = hours;
        this.minutes = minutes;
        this.seconds = seconds;
        this.title = title;
    }

    // Getters and setters
    
    public int getTimerID() {
        return timerID;
    }

    public int getHours() {
        return hours;
    }

    public void setHours(int hours) {
        this.hours = hours;
    }

    public int getMinutes() {
        return minutes;
    }

    public void setMinutes(int minutes) {
        this.minutes = minutes;
    }

    public int getSeconds() {
        return seconds;
    }

    public void setSeconds(int seconds) {
        this.seconds = seconds;
    }

    public void setStudentId(int studentId) {
        this.studentId = studentId;
    }
    
    public int getStudentId() { // New getter for studentId
        return studentId;
    }

    public String getTitle() {
    	return title;
    }
    
    public void setTitle(String title) {
    	this.title = title;
    }
}