package com.darkshadow.app.service;

import java.util.Properties;
import java.util.Random;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@Service
@Component
public class UserEmailService {
	
	private String otp;
	
	public void sendMail(String email, String name) {
		String to = email;
		String from = "youremail@gmail.com";
		String password = "***********";
		Properties props = new Properties();    
        props.put("mail.smtp.host", "smtp.gmail.com");    
        props.put("mail.smtp.socketFactory.port", "465");    
        props.put("mail.smtp.socketFactory.class",    
                  "javax.net.ssl.SSLSocketFactory");    
        props.put("mail.smtp.auth", "true");    
        props.put("mail.smtp.port", "465");    
        //get Session   
        Session session = Session.getDefaultInstance(props,    
         new javax.mail.Authenticator() {    
         protected PasswordAuthentication getPasswordAuthentication() {    
         return new PasswordAuthentication(from,password);  
         }    
        });    
        //compose message    
        try {    
         MimeMessage message = new MimeMessage(session);    
         message.addRecipient(Message.RecipientType.TO,new InternetAddress(to));    
         message.setSubject("Hello "+ name); 
         Random random = new Random();
         otp = String.format("%04d", random.nextInt(10000));
         message.setText("Thank You registering in darkshadows.com. \n Enter " + otp + "to verify." );    
         //send message 
         System.out.println(otp);
         Transport.send(message);    
         System.out.println("message sent successfully");    
        } catch (MessagingException e) {throw new RuntimeException(e);}
	}
	
	public String getOtp() {
		return otp;
	}
	public void setOtp(String otp) {
		this.otp = otp;
	}
	
	@Override
	public String toString() {
		return "UserEmailService [otp=" + otp + "]";
	}
}
