import { Injectable } from '@angular/core';
import { Todo } from '../Model/todo/todo.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  todoUrl: string;
  constructor(private http: HttpClient) {
    this.todoUrl = 'http://localhost:8080/todo';
  }
  deleteTodoByIndex(data){
    console.log('ye id hai=>');
    console.log(data);
    return this.http.delete<Todo>(this.todoUrl + '/' + data.id);
  }

  fetchUserTodo(user): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.todoUrl + '/' + user.id);
  }

  addNewTodo(todoData): Observable<Todo> {
    console.log(todoData);
    return this.http.post<Todo>(this.todoUrl, todoData);
  }
}
