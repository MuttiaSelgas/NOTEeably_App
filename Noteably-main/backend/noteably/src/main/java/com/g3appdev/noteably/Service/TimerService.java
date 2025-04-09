package com.g3appdev.noteably.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.g3appdev.noteably.Entity.TimerEntity;
import com.g3appdev.noteably.Repository.TimerRepository;

@Service
public class TimerService {

    @Autowired
    private TimerRepository timerRepo;

    public TimerEntity createTimer(TimerEntity timer) { 
        // Set the studentId for the timer
        if (timer.getStudentId() == 0) {
            throw new IllegalArgumentException("Student ID must be provided");
        }
        return timerRepo.save(timer);
    }
    
    public List<TimerEntity> getTimersByStudentId(int studentId) {
        return timerRepo.findByStudentId(studentId);
    }

    public List<TimerEntity> getAllTimers() {
        return timerRepo.findAll();
    }

    public TimerEntity getTimerById(int id) {
        return timerRepo.findById(id).orElse(null);
    }

    public TimerEntity updateTimer(int id, TimerEntity newTimerDetails) {
        TimerEntity timer = timerRepo.findById(id).orElse(null);
        if (timer != null) {
            timer.setTitle(newTimerDetails.getTitle());
            timer.setHours(newTimerDetails.getHours());
            timer.setMinutes(newTimerDetails.getMinutes());
            timer.setSeconds(newTimerDetails.getSeconds());
            return timerRepo.save(timer);
        }
        return null;
    }

    public String deleteTimer(int id) {
        timerRepo.deleteById(id);
        return "Timer with ID: " + id + " deleted.";
    }

    public void startTimer(int timerID) {
        TimerEntity timer = getTimerById(timerID);
        if (timer != null) {
            // Logic to start the timer (e.g., set a status, schedule a job, etc.)
            // This is a placeholder for actual timer logic.
            // You may want to implement a scheduling mechanism or a background job.
            System.out.println("Timer started: " + timer.getTitle());
        } else {
            throw new RuntimeException("Timer not found");
        }
    }
}
