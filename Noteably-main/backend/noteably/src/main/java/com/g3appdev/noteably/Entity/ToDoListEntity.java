package com.g3appdev.noteably.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "todo_list")
public class ToDoListEntity {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int todolistID;
	
	private String title;
	private String description;
	private int studentId;


	@ManyToOne
    @JoinColumn(name = "sched")
	private ScheduleEntity sched; 
	
	public void setStudentId(int studentId) {
		this.studentId = studentId;
	}

	public int getStudentId() {
		return studentId;
	}
	
	public void setToDoListID(int todolistID) {
		this.todolistID = todolistID;
	}
	
	public void setTitle(String title) {
		this.title = title;
	}
	
	public void setDescription(String description) {
		this.description = description;
	}

    public void setSchedule(ScheduleEntity sched) {
		this.sched = sched;
	}
	
	public int getToDoListID() {
		return todolistID;
	}
	
	public String getTitle() {
		return title;
	}
	
	public String getDescription() {
		return description;
	}

    public ScheduleEntity getSchedule() {
		return sched;
	}
}