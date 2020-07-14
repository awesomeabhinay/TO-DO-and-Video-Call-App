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
@Table(name = "todo")
public class TodoDTO {
	
	@Id
	@GeneratedValue
	@Column(name = "todo_id")
	private long id;
	
	@Length(max = 150)
	@Column(name = "title")
	private String title;
	
	@Column(name = "detail")
	private String detail;
	
	@ManyToOne
	@JoinColumn(name = "user_id")
	private UsersDTO user;
	
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getDetail() {
		return detail;
	}
	public void setDetail(String detail) {
		this.detail = detail;
	}
	public UsersDTO getUser() {
		return user;
	}
	public void setUser(UsersDTO user) {
		this.user = user;
	}
	

	@Override
	public String toString() {
		return "TodoDTO [id=" + id + ", title=" + title + ", detail=" + detail + ", user=" + user + "]";
	}
}
