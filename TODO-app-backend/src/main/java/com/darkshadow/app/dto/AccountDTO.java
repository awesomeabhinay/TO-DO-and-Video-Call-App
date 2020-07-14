package com.darkshadow.app.dto;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.validator.constraints.Length;

@Entity
@Table(name = "accounts")
public class AccountDTO {
	
	@Id
	@GeneratedValue
	@Column(name = "acc_id")
	private long id;
	
	@Length(max = 200)
	@Column(name = "acc_name")
	private String name;
	
	@Length(max = 200)
	@Column(name = "acc_username")
	private String username;
	
	@Length(max = 100)
	@Column(name = "acc_password")
	private String password;
	
	@ManyToOne
	@JoinColumn(name = "acc_user_id")
	private UsersDTO user;
	
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
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public UsersDTO getUser() {
		return user;
	}
	public void setUser(UsersDTO user) {
		this.user = user;
	}
	
	@Override
	public String toString() {
		return "AccountDTO [id=" + id + ", name=" + name + ", username=" + username + ", password=" + password
				+ ", user=" + user + "]";
	}
}
