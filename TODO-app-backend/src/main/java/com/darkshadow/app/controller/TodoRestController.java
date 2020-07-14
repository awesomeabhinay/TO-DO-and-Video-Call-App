package com.darkshadow.app.controller;

import java.util.List;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.darkshadow.app.dto.TodoDTO;
import com.darkshadow.app.repo.TodoJpaRepository;

@Component
@RestController
public class TodoRestController {
	
	public static final Logger logger = LoggerFactory.getLogger(TodoRestController.class);
	
	@Autowired
	private TodoJpaRepository todoJpaRepository;
	
	@RequestMapping("/todo/hello")
	public String hello() {
		return "hello todo";
	}
	
	@CrossOrigin(origins = "http://localhost:4200")
	@PostMapping(value = "/todo", consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<TodoDTO> saveTodoData(@Valid @RequestBody TodoDTO todo){
		System.out.println(todo.getUser());
		todoJpaRepository.save(todo);
		return new ResponseEntity<TodoDTO>(todo,HttpStatus.CREATED);
	}

	@CrossOrigin(origins = "http://localhost:4200")
	@GetMapping(value = "/todo")
	public ResponseEntity<List<TodoDTO>> fetchAllTodoData(){
		List<TodoDTO> todo = todoJpaRepository.findAll();
		return new ResponseEntity<List<TodoDTO>>(todo,HttpStatus.ACCEPTED);
	}
	
	@CrossOrigin(origins = "http://localhost:4200")
	@GetMapping(value = "/todo/{id}")
	public ResponseEntity<List<TodoDTO>> fetchTodoData(@PathVariable("id") Long id){
		List<TodoDTO> todo = todoJpaRepository.findByUserId(id);
		return new ResponseEntity<List<TodoDTO>>(todo,HttpStatus.ACCEPTED);
	}
	
	@CrossOrigin(origins = "http://localhost:4200")
	@DeleteMapping(value = "/todo/{id}")
	public ResponseEntity<TodoDTO> deleteTodoById(@PathVariable("id") Long id){
		todoJpaRepository.deleteById(id);
		return new ResponseEntity<TodoDTO>(HttpStatus.NO_CONTENT);
	}
}
