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
import org.springframework.web.bind.annotation.RestController;

import com.darkshadow.app.dto.AccountDTO;
import com.darkshadow.app.repo.AccountJpaRepository;

@Component
@RestController
public class AccountRestController {

	public static final Logger logger = LoggerFactory.getLogger(TodoRestController.class);
	
	@Autowired
	private AccountJpaRepository accountJpaRepository;
	
	@CrossOrigin(origins = "http://localhost:4200")
	@PostMapping(value = "/account", consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<AccountDTO> saveTodoData(@Valid @RequestBody AccountDTO account){
		System.out.println(account.getUser());
		accountJpaRepository.save(account);
		return new ResponseEntity<AccountDTO>(account,HttpStatus.CREATED);
	}

	@CrossOrigin(origins = "http://localhost:4200")
	@GetMapping(value = "/account")
	public ResponseEntity<List<AccountDTO>> fetchAllAccountData(){
		List<AccountDTO> account = accountJpaRepository.findAll();
		return new ResponseEntity<List<AccountDTO>>(account,HttpStatus.ACCEPTED);
	}
	
	@CrossOrigin(origins = "http://localhost:4200")
	@GetMapping(value = "/account/{id}")
	public ResponseEntity<List<AccountDTO>> fetchAccountData(@PathVariable("id") Long id){
		List<AccountDTO> account = accountJpaRepository.findByUserId(id);
		return new ResponseEntity<List<AccountDTO>>(account,HttpStatus.ACCEPTED);
	}
	
	@CrossOrigin(origins = "http://localhost:4200")
	@DeleteMapping(value = "/account/{id}")
	public ResponseEntity<AccountDTO> deleteTodoById(@PathVariable("id") Long id){
		accountJpaRepository.deleteById(id);
		return new ResponseEntity<AccountDTO>(HttpStatus.NO_CONTENT);
	}
}
