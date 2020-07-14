import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal, NgbAccordionConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthServiceService } from '../auth/auth-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Todo } from '../Model/todo/todo.model';
import { User } from '../Model/user/user.model';
import { Subscription, Subject } from 'rxjs';
import { TodoService } from './todo.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit, OnDestroy {
  formgroup: FormGroup;
  todoData: Todo = new Todo();
  user_id: string = localStorage.getItem('id');
  user_name: string = localStorage.getItem('name');
  user_email: string = localStorage.getItem('email');

  todoList: Todo[];
  todoChanged = new Subject<Todo[]>();
  subscription: Subscription;
  user: User = new User(this.user_id, this.user_name, this.user_email);
  constructor(private modalService: NgbModal, config: NgbAccordionConfig,
              public authService: AuthServiceService, private todoService: TodoService, private router: Router,
              private route: ActivatedRoute) {

    config.closeOthers = true;
  }

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()){
      console.log('chala ja');
      this.router.navigate(['/'], {relativeTo: this.route});
    }
    else{
        console.log(this.user);
        this.todoService.fetchUserTodo(this.user).subscribe(result => {
          this.todoList = result;
          this.subscription = this.todoChanged.subscribe(
            (list: Todo[]) => {
              this.todoList = list;
            }
          );
        });
        this.initForm();
    }
    console.log('inside todo');
  }

  initForm() {
    this.formgroup = new FormGroup({
      user: new FormControl(this.user),
      title: new FormControl('', [Validators.required]),
      detail: new FormControl('', [Validators.required])
    });
  }

  open(content) {
    this.modalService.open(content);
  }

  onAddNewTask(){
    if (this.formgroup.valid) {
      // const data = {'title': this.formgroup.value.title,
      //               'detail': this.formgroup.value.detail,
      //               'user': user};
      console.log('yaha');
      console.log(this.user);
      console.log(this.formgroup.value);
      this.todoService.addNewTodo(this.formgroup.value).subscribe(result => {
        this.todoList.push(result);
        this.subscription = this.todoChanged.subscribe(
          (list: Todo[]) => {
            this.todoList = list;
          }
        );
      });
      this.resetForm();
    }
  }

  onDeleteTodo(index){
    this.todoData = this.todoList[index];
    this.todoList.splice(index, 1);
    this.subscription = this.todoChanged.subscribe(list => {
      this.todoList = list;
    });
    console.log(this.todoData);
    this.todoService.deleteTodoByIndex(this.todoData).subscribe();
  }

  resetForm() {
    this.formgroup.reset();
  }

  ngOnDestroy(): void {
    //this.subscription.unsubscribe();
  }
}
