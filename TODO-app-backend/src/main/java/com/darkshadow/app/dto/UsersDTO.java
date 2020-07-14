package com.darkshadow.app.dto;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.validator.constraints.Length;

@Entity
@Table(name = "users")
public class UsersDTO {
	
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
	
	@Override
	public String toString() {
		return "UsersDTO [id=" + id + ", name=" + name + ", email=" + email + ", password=" + password + "]";
	}
	
}
