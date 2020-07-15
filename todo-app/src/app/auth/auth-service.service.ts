import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { User } from '../Model/user/user.model';
import { Observable, throwError } from 'rxjs';
import {map, catchError} from 'rxjs/operators';
import { Todo } from '../Model/todo/todo.model';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  userData;
  userUrl: string;
  todoUrl: string;
  constructor(private http: HttpClient) {
    this.userUrl = 'http://localhost:8080';
    this.todoUrl = 'http://localhost:8080/todo';
  }
  private token: string = localStorage.getItem('token');
  error :string = 'false';
  isAuthenticated(){
    return localStorage.getItem('token') === 'loggedin';
  }

  logout(){
    this.toggleToken();
    localStorage.clear();
    localStorage.setItem('token', this.getToken());
  }

  login(form): Observable<User>{
    return this.http.post<User>(this.userUrl + '/login', form).pipe(
      catchError(this.handleLoginError)
    );
  }

  register(form): Observable<User>{
    return this.http.post<User>(this.userUrl + '/register', form).pipe(
      catchError(this.handleRegisterError)
    );
  }

  sendUserData(){
    console.log(this.userData);
    return this.userData;
  }

  recieveUserData(userData){
    this.userData = userData;
  }

  verifyOtp(otp, user): Observable<User>{
    console.log(otp);
    return this.http.post<User>(this.userUrl + '/' + otp.otp, user).pipe(
      catchError(this.handleOtpError)
    );
  }

  toggleToken(){
    this.token = (this.token === 'loggedin') ? 'loggedout' : 'loggedin';
  }
  getToken(){
    return this.token;
  }

  handleOtpError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      this.error = 'otp invalid';
      errorMessage = `Otp is not valid. Please enter valid OTP`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

  handleRegisterError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      this.error = 'email error';
      errorMessage = `Email already exist`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

  handleLoginError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      this.error = 'no user';
      errorMessage = `You have not registered yet`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
  public getError(){
    return this.error;
  }
}
