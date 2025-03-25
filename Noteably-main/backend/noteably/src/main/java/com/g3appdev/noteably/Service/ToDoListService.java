package com.g3appdev.noteably.Service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.g3appdev.noteably.Entity.ScheduleEntity;
import com.g3appdev.noteably.Entity.ToDoListEntity;
import com.g3appdev.noteably.Repository.ToDoListRepository;

@Service
public class ToDoListService {
	@Autowired
	ToDoListRepository tdlrepo;
	
	// Create
	// Create
public ToDoListEntity postToDoListRecord(ToDoListEntity todolist) {
    // Ensure studentId is set
    if (todolist.getStudentId() == 0) {
        throw new IllegalArgumentException("Student ID must be provided");
    }
    return tdlrepo.save(todolist);
}
	
	// Read
	public List<ToDoListEntity> getAllToDoList() {
		return tdlrepo.findAll();
	}
	
	// Read by ID
    public ToDoListEntity getToDoListById(int id) {
        return tdlrepo.findById(id).orElse(null);
    }
	
	public List<ToDoListEntity> getToDoByStudentId(int studentId) {
        return tdlrepo.findByStudentId(studentId);
    }
	
	// Update
	public ToDoListEntity putToDoListDetails(int id, ToDoListEntity newToDoListDetails) {
		return tdlrepo.findById(id)
			.map(todolist -> {
				todolist.setTitle(newToDoListDetails.getTitle());
				todolist.setDescription(newToDoListDetails.getDescription());
                todolist.setSchedule(newToDoListDetails.getSchedule());
				return tdlrepo.save(todolist);
			}).orElseThrow(() -> new NoSuchElementException("ToDoList not found for id: " + id));
	}
	
	// Delete
	public String deleteTodoList(int id) {
		tdlrepo.deleteById(id);
		return "Deleted Successfully";
	}
}