package com.darkshadow.app.dto;

import java.util.Arrays;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.validator.constraints.Length;

@Entity
@Table(name = "users")
public class UsersDTO {
	
	public UsersDTO() {
		super();
	}
	
	public UsersDTO(byte[] pic) {
		this.picByte = pic;
	}
	@Id
	@GeneratedValue
	@Column(name = "user_id")
	private long id;
	
	@Length(max = 145)
	@Column(name = "name")
	private String name;
	
	@Length(max = 145)
	@Column(name = "email")
	private String email;
	
	@Length(max = 100)
	@Column(name = "password")
	private String password;
	
	@Column(name = "user_pic", length = 1000000)
	private byte[] picByte;
	
	@Column(name = "about", length = 10000)
	private String about;
	
	public String getAbout() {
		return about;
	}

	public void setAbout(String about) {
		this.about = about;
	}

	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}

	public byte[] getPicByte() {
		return picByte;
	}
	public void setPicByte(byte[] picByte) {
		this.picByte = picByte;
	}

	@Override
	public String toString() {
		return "UsersDTO [id=" + id + ", name=" + name + ", email=" + email + ", password=" + password + ", picByte="
				+ Arrays.toString(picByte) + ", about=" + about + "]";
	}
	
	
	
}
