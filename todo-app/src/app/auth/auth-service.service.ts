import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../Model/user/user.model';
import { Observable } from 'rxjs';
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
    return this.http.post<User>(this.userUrl + '/login', form);
  }

  register(form): Observable<User>{
    return this.http.post<User>(this.userUrl + '/register', form);
  }

  addNewTodo(todoData): Observable<Todo>{
    console.log(todoData);
    return this.http.post<Todo>(this.todoUrl, todoData);
  }

  fetchUserTodo(user): Observable<Todo[]>{
    return this.http.get<Todo[]>(this.todoUrl + '/' + user.id);
  }

  sendUserData(){
    console.log(this.userData);
    return this.userData;
  }

  recieveUserData(userData){
    this.userData = userData;
  }

  toggleToken(){
    this.token = (this.token === 'loggedin') ? 'loggedout' : 'loggedin';
  }
  getToken(){
    return this.token;
  }
}
