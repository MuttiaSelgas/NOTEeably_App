package com.g3appdev.noteably.Repository;


import com.g3appdev.noteably.Entity.ScheduleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<ScheduleEntity, Integer> {
    List<ScheduleEntity> findByPriority(String priority);
    List<ScheduleEntity> findByStartDateBetween(LocalDate startDate, LocalDate endDate);
    List<ScheduleEntity> findByStudentId(int studentId);
    // Method to save a schedule with associated to-do lists
    //ScheduleEntity save(ScheduleEntity schedule);
}
