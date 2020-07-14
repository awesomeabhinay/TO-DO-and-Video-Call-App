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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.darkshadow.app.dto.UsersDTO;
import com.darkshadow.app.exception.CustomErrors;
import com.darkshadow.app.repo.UserJpaRepository;
import com.darkshadow.app.service.UserEmailService;

@RestController
@Component
public class UserRestController {

	public static final Logger logger = LoggerFactory.getLogger(UserRestController.class);

	private UsersDTO user;
	@RequestMapping("/hello")
	public String hello() {
		return "hello";
	}
	
	@Autowired
	private UserJpaRepository userJpaRepository;
	
	@Autowired
	private UserEmailService emailService;
	
	@GetMapping("/")
	public ResponseEntity<List<UsersDTO>> getAllUser(){
		List<UsersDTO> users = userJpaRepository.findAll();
		return new ResponseEntity<List<UsersDTO>>(users,HttpStatus.ACCEPTED);
	}

	@CrossOrigin(origins = "http://localhost:4200")
	@PostMapping(value = "/register", consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<UsersDTO> createUser(@Valid @RequestBody UsersDTO user){
		logger.info("Creating User: {}", user);
		if(userJpaRepository.findByEmail(user.getEmail())!=null) {
			logger.error("Email {} already exist",user.getEmail());
			return new ResponseEntity<UsersDTO>(new CustomErrors("User already exist"),HttpStatus.CONFLICT);
		}
		emailService.sendMail(user.getEmail(),user.getName());
		//userJpaRepository.save(user);
		this.user = user;
		return new ResponseEntity<UsersDTO>(user, HttpStatus.CREATED);
	}
	
	@CrossOrigin(origins = "http://localhost:4200")
	@PostMapping(value = "/login", consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<UsersDTO> login(@Valid @RequestBody UsersDTO user){
		if(userJpaRepository.findByEmail(user.getEmail())== null) {
			logger.error("user not found");
			return new ResponseEntity<UsersDTO>(HttpStatus.NOT_FOUND);
		}
		UsersDTO u = userJpaRepository.findByEmail(user.getEmail());
		return new ResponseEntity<UsersDTO>(u,HttpStatus.ACCEPTED);
	}
	
	@CrossOrigin(origins = "http://localhost:4200")
	@PostMapping(value = "/{otp}", consumes = MediaType.ALL_VALUE)
	public ResponseEntity<UsersDTO> verifyOtp(@PathVariable("otp") String otp, @RequestBody UsersDTO user){
		
		if(otp.equals(emailService.getOtp())) {
			System.out.println(otp);
			userJpaRepository.save(this.user);
			return new ResponseEntity<UsersDTO>(user,HttpStatus.OK);
		}
		return new ResponseEntity<UsersDTO>(HttpStatus.BAD_REQUEST);
	}
	
}
