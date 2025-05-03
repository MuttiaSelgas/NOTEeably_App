package com.g3appdev.noteably.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.g3appdev.noteably.Entity.ToDoListEntity;
import com.g3appdev.noteably.Service.ToDoListService;

@CrossOrigin(
    origins = {
        "http://localhost:3000",
        "https://noteably-app.vercel.app",        // production frontend domain
        "https://noteably-app-git-main-muttia-selgas-projects.vercel.app"  // preview deployment
    },

    allowedHeaders = "*",
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE},
    allowCredentials = "true",
    maxAge = 3600
)
@RestController
@RequestMapping("/api/TodoList")
public class ToDoListController {
	@Autowired
	ToDoListService tdlserv;
	
	// Create
	@PostMapping("/postListRecord")
	public ToDoListEntity postToDoListRecord(@RequestBody ToDoListEntity todolist) {
		return tdlserv.postToDoListRecord(todolist);
	}
	
	// Read
	@GetMapping("/getList")
	public List<ToDoListEntity> getAllToDoList() {
		return tdlserv.getAllToDoList();
	}

	 // Read all Schedule for a specific student
    @GetMapping("/getByStudent/{studentId}")
    public List<ToDoListEntity> getScheduleByStudentId(@PathVariable int studentId) {
        return tdlserv.getToDoByStudentId(studentId);
    }

    // Read by ID
    @GetMapping("/getTask/{id}")
    public ResponseEntity<ToDoListEntity> getToDoListById(@PathVariable int id) {
        ToDoListEntity schedule = tdlserv.getToDoListById(id);
        return schedule != null ? ResponseEntity.ok(schedule) : ResponseEntity.notFound().build();
    }
	
	// Update
	@PutMapping("/putList/{id}")
	public ToDoListEntity putToDoListDetails(@PathVariable int id, @RequestBody ToDoListEntity newToDoListDetails) {
		return tdlserv.putToDoListDetails(id, newToDoListDetails);
	}
	
	// Delete
	@DeleteMapping("/deleteList/{id}")
	public String deleteToDoList(@PathVariable int id) {
		return tdlserv.deleteTodoList(id);
	}
}
