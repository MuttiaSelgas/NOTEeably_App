package com.g3appdev.noteably.Controller;

import com.g3appdev.noteably.Entity.ScheduleEntity;
import com.g3appdev.noteably.Service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.NoSuchElementException;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/schedules")
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;

    // Get all schedules (READ)
    @GetMapping("/getAll")
    public ResponseEntity<List<ScheduleEntity>> getAllSchedules() {
        List<ScheduleEntity> schedules = scheduleService.getAllSchedules();
        return ResponseEntity.ok(schedules);
    }

    // Get a specific schedule by ID (READ)
    @GetMapping("/getSched/{id}")
    public ResponseEntity<ScheduleEntity> getScheduleById(@PathVariable int id) {
        try {
            ScheduleEntity schedule = scheduleService.getScheduleById(id);
            return ResponseEntity.ok(schedule);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Create a new schedule (CREATE)
    @PostMapping("/postSched")
    public ResponseEntity<ScheduleEntity> createSchedule(
            @RequestBody ScheduleEntity schedule,
            @RequestParam(required = false) List<Integer> todoListIds) {
        try {
            ScheduleEntity createdSchedule = scheduleService.saveOrUpdate(schedule, todoListIds);
            return ResponseEntity.ok(createdSchedule);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Edit an existing schedule (UPDATE)
    @PutMapping("/editSched/{id}")
    public ResponseEntity<ScheduleEntity> editSchedule(
            @PathVariable int id,
            @RequestBody ScheduleEntity updatedSchedule,
            @RequestParam(required = false) List<Integer> todoListIds) {
        try {
            updatedSchedule.setScheduleID(id);
            ScheduleEntity updatedEntity = scheduleService.saveOrUpdate(updatedSchedule, todoListIds);
            return ResponseEntity.ok(updatedEntity);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

     // Read all Schedule for a specific student
    @GetMapping("/getByStudent/{studentId}")
    public List<ScheduleEntity> getScheduleByStudentId(@PathVariable int studentId) {
        return scheduleService.getScheduleByStudentId(studentId);
    }
    // Delete a schedule by ID (DELETE)
    @DeleteMapping("/deleteSched/{id}")
    public ResponseEntity<Void> deleteSchedule(@PathVariable int id) {
        try {
            scheduleService.deleteSchedule(id);
            return ResponseEntity.ok().build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Get schedules by priority
    @GetMapping("/getByPriority/{priority}")
    public ResponseEntity<List<ScheduleEntity>> getSchedulesByPriority(@PathVariable String priority) {
        List<ScheduleEntity> schedules = scheduleService.getSchedulesByPriority(priority);
        return ResponseEntity.ok(schedules);
    }

    // Get schedules within a date range
    @GetMapping("/getByDateRange")
    public ResponseEntity<List<ScheduleEntity>> getSchedulesInDateRange(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        try {
            LocalDate start = LocalDate.parse(startDate);
            LocalDate end = LocalDate.parse(endDate);
            List<ScheduleEntity> schedules = scheduleService.getSchedulesInDateRange(start, end);
            return ResponseEntity.ok(schedules);
        } catch (DateTimeParseException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}
