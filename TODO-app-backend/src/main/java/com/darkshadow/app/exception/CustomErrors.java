package com.darkshadow.app.exception;

import com.darkshadow.app.dto.UsersDTO;

public class CustomErrors extends UsersDTO {

	private String error;
	
	public CustomErrors(String err) {
		error = err;
	}

	public String getError() {
		return error;
	}
}
