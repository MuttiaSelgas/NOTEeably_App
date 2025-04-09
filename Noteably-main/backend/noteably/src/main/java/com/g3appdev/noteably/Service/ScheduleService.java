package com.g3appdev.noteably.Service;

import com.g3appdev.noteably.Entity.FolderEntity;
import com.g3appdev.noteably.Entity.ScheduleEntity;
import com.g3appdev.noteably.Entity.ToDoListEntity;
import com.g3appdev.noteably.Repository.ScheduleRepository;
import com.g3appdev.noteably.Repository.ToDoListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class ScheduleService {

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private ToDoListRepository todoListRepository;

    // Create or Update Schedule
    public ScheduleEntity saveOrUpdate(ScheduleEntity schedule, Iterable<Integer> todoListIds) {
        // Ensure studentId is set
        if (schedule.getStudentId() == 0) {
            throw new IllegalArgumentException("Student ID must be provided");
        }

        // Validate schedule start date
        if (schedule.getStartDate() != null && schedule.getStartDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Schedule start date cannot be in the past.");
        }

        // Set associated ToDoList tasks if IDs are provided
        if (todoListIds != null) {
            List<ToDoListEntity> todoLists = todoListRepository.findAllById(todoListIds);
            schedule.setTasks(todoLists);
        }

        return scheduleRepository.save(schedule);
    }

    // Get all schedules
    public List<ScheduleEntity> getAllSchedules() {
        return scheduleRepository.findAll();
    }

    // Get schedules by student ID
    public List<ScheduleEntity> getScheduleByStudentId(int studentId) {
        return scheduleRepository.findByStudentId(studentId);
    }

    // Get a specific schedule by ID
    public ScheduleEntity getScheduleById(int id) {
        return scheduleRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Schedule not found with ID: " + id));
    }

    // Delete a schedule by ID
    public void deleteSchedule(int id) {
        if (!scheduleRepository.existsById(id)) {
            throw new NoSuchElementException("Schedule not found with ID: " + id);
        }
        scheduleRepository.deleteById(id);
    }

    // Get schedules by priority
    public List<ScheduleEntity> getSchedulesByPriority(String priority) {
        return scheduleRepository.findByPriority(priority);
    }

    // Get schedules within a date range
    public List<ScheduleEntity> getSchedulesInDateRange(LocalDate startDate, LocalDate endDate) {
        if (startDate == null || endDate == null) {
            throw new IllegalArgumentException("Start date and end date must not be null.");
        }
        if (endDate.isBefore(startDate)) {
            throw new IllegalArgumentException("End date must not be earlier than start date.");
        }
        return scheduleRepository.findByStartDateBetween(startDate, endDate);
    }
}
