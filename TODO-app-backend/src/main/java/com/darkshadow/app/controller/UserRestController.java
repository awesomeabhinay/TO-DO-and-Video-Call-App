package com.darkshadow.app.controller;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.zip.DataFormatException;
import java.util.zip.Deflater;
import java.util.zip.Inflater;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.darkshadow.app.dto.NotificationDTO;
import com.darkshadow.app.dto.UsersDTO;
import com.darkshadow.app.exception.CustomErrors;
import com.darkshadow.app.repo.NotificationRepository;
import com.darkshadow.app.repo.UserJpaRepository;
import com.darkshadow.app.service.UserEmailService;

@CrossOrigin(origins = "http://localhost:4200")
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
	
	@Autowired
	private NotificationRepository notifJpaRepo;
	
	@GetMapping("/")
	public ResponseEntity<List<UsersDTO>> getAllUser(){
		List<UsersDTO> users = userJpaRepository.findAll();
		return new ResponseEntity<List<UsersDTO>>(users,HttpStatus.ACCEPTED);
	}

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
	
	@PostMapping(value = "/login", consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<UsersDTO> login(@Valid @RequestBody UsersDTO user){
		if(userJpaRepository.findByEmail(user.getEmail())== null || userJpaRepository.findByEmailPassword(user.getEmail(), user.getPassword()) == null) {
			logger.error("user not found");
			return new ResponseEntity<UsersDTO>(new CustomErrors("User Not Found"),HttpStatus.NOT_FOUND);
		}
		UsersDTO u = userJpaRepository.findByEmail(user.getEmail());
		this.user = u;
		return new ResponseEntity<UsersDTO>(u,HttpStatus.ACCEPTED);
	}
	
	@PostMapping(value = "/{otp}", consumes = MediaType.ALL_VALUE)
	public ResponseEntity<UsersDTO> verifyOtp(@PathVariable("otp") String otp, @RequestBody UsersDTO user){
		
		if(otp.equals(emailService.getOtp())) {
			System.out.println(otp);
			userJpaRepository.save(this.user);
			return new ResponseEntity<UsersDTO>(user,HttpStatus.OK);
		}
		return new ResponseEntity<UsersDTO>(HttpStatus.BAD_REQUEST);
	}
	
	@PostMapping("/upload")
	public ResponseEntity<UsersDTO> uplaodImage(@RequestParam("pic") MultipartFile file) throws IOException {
		System.out.println("Original Image Byte Size - " + file.getBytes().length);
		System.out.println("name: " + file.getOriginalFilename());
		UsersDTO user = ((Optional<UsersDTO>) userJpaRepository.findById(Long.parseLong(file.getOriginalFilename()))).get();
		user.setPicByte(compressBytes(file.getBytes()));
		userJpaRepository.saveAndFlush(user);
		return new ResponseEntity<UsersDTO>(user,HttpStatus.OK);
	}
	
	@PostMapping("/about")
	public ResponseEntity<UsersDTO> uploadAboutYou(@Valid @RequestBody UsersDTO user) throws IOException {
		System.out.println(user.getAbout());
		UsersDTO u = ((Optional<UsersDTO>)userJpaRepository.findById(user.getId())).get();
		u.setAbout(user.getAbout());
		userJpaRepository.saveAndFlush(u);
		return new ResponseEntity<UsersDTO>(u,HttpStatus.OK);
	}
	
	@GetMapping("/get/{id}")
	public UsersDTO getImage(@PathVariable("id") String id) throws IOException {
		final Optional<UsersDTO> retrievedUser = userJpaRepository.findById(Long.parseLong(id));
		UsersDTO user = retrievedUser.get();
		user.setPicByte(decompressBytes(user.getPicByte()));
		return user;
	}
	
	@GetMapping("/users/{name}")
	public ResponseEntity<List<UsersDTO>> searchUsers(@PathVariable("name") String name){
		List<UsersDTO> users = userJpaRepository.findAllByName(name);
		return new ResponseEntity<List<UsersDTO>>(users, HttpStatus.ACCEPTED);
	}
	
	@GetMapping("/getUser/{id}")
	public ResponseEntity<UsersDTO> getUser(@PathVariable("id") Long id){
		UsersDTO user = ((Optional<UsersDTO>)userJpaRepository.findById(id)).get();
		return new ResponseEntity<UsersDTO>(user, HttpStatus.OK);
		
	}
	
	@PostMapping("/videocall")
	public void videoCallRequest(@Valid @RequestBody String data[]) {
		System.out.println(data[0] + " " + data[1] + " " + data[2]);
		NotificationDTO newNotif = new NotificationDTO();
		newNotif.setCode(data[1]);
		UsersDTO u = new UsersDTO();
		u.setId(Long.parseLong(data[0]));
		newNotif.setUser(u);
		newNotif.setSenderName(data[2]);
		notifJpaRepo.save(newNotif);
	}
	
	@GetMapping("/notifications/{id}")
	public ResponseEntity<List<NotificationDTO>> getNotifications(@PathVariable("id") String id){
		List<NotificationDTO> notifList = notifJpaRepo.findByUserId(Long.parseLong(id));
		return new ResponseEntity<List<NotificationDTO>>(notifList, HttpStatus.OK);
	}
	
	@DeleteMapping("/notification/{id}")
	public ResponseEntity<NotificationDTO> deleteNotification(@PathVariable("id") Long id){
		notifJpaRepo.deleteById(id);
		return new ResponseEntity<NotificationDTO>(HttpStatus.NO_CONTENT);
	}
	// compress the image bytes before storing it in the database
	public static byte[] compressBytes(byte[] data) {
		Deflater deflater = new Deflater();
		deflater.setInput(data);
		deflater.finish();
		ByteArrayOutputStream outputStream = new ByteArrayOutputStream(data.length);
		byte[] buffer = new byte[1024];
		while (!deflater.finished()) {
			int count = deflater.deflate(buffer);
			outputStream.write(buffer, 0, count);
		}
		try {
			outputStream.close();
		} catch (IOException e) {
		}
		System.out.println("Compressed Image Byte Size - " + outputStream.toByteArray().length);
		return outputStream.toByteArray();
	}
	// uncompress the image bytes before returning it to the angular application
	public static byte[] decompressBytes(byte[] data) {
		if(data == null) {
			return null;
		}
		Inflater inflater = new Inflater();
		inflater.setInput(data);
		ByteArrayOutputStream outputStream = new ByteArrayOutputStream(data.length);
		byte[] buffer = new byte[1024];
		try {
			while (!inflater.finished()) {
				int count = inflater.inflate(buffer);
				outputStream.write(buffer, 0, count);
			}
			outputStream.close();
		} catch (IOException ioe) {
		} catch (DataFormatException e) {
		}
		return outputStream.toByteArray();
	}
	
}
