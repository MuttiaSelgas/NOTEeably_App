package com.g3appdev.noteably.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.g3appdev.noteably.Entity.TimerEntity;
import com.g3appdev.noteably.Service.TimerService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/timer")
public class TimerController {

    @Autowired
    TimerService timerService;

    // Create Timer
    @PostMapping("/create")
    public TimerEntity createTimer(@RequestBody TimerEntity timer) {
        return timerService.createTimer(timer);
    }

    // Read all Timers for a specific student
    @GetMapping("/getByStudent/{studentId}")
    public List<TimerEntity> getTimersByStudentId(@PathVariable int studentId) {
        return timerService.getTimersByStudentId(studentId);
    }

    // Read all Timers
    @GetMapping("/getAll")
    public List<TimerEntity> getAllTimers() {
        return timerService.getAllTimers();
    }
    
    // Read Timer by ID
    @GetMapping("/get/{timerID}")
    public TimerEntity getTimerById(@PathVariable int timerID) {
        return timerService.getTimerById(timerID);
    }

    // Update Timer
    @PutMapping("/update/{timerID}")
    public TimerEntity updateTimer(@PathVariable int timerID, @RequestBody TimerEntity newTimerDetails) {
        return timerService.updateTimer(timerID, newTimerDetails);
    }

    // Delete Timer
    @DeleteMapping("/delete/{timerID}")
    public String deleteTimer(@PathVariable int timerID) {
        return timerService.deleteTimer(timerID);
    }

    // Restart Timer (sets time to 00:00:00)
    @PutMapping("/restart/{timerID}")
    public TimerEntity restartTimer(@PathVariable int timerID) {
        TimerEntity timer = timerService.getTimerById(timerID);
        timer.setHours(0);
        timer.setMinutes(0);
        timer.setSeconds(0);
        return timerService.updateTimer(timerID, timer);
    }

    // Start Timer (implementation would vary based on frontend or background job)
    @PostMapping("/start/{timerID}")
    public String startTimer(@PathVariable int timerID) {
        // This will depend on your actual timer logic.
        return "Timer started";
    }
}

