import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../auth/auth-service.service';
import { User } from '../Model/user/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public authService: AuthServiceService) { }
  user = new User(localStorage.getItem('id'),
    localStorage.getItem('name'),
    localStorage.getItem('email'));
  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      console.log(localStorage.getItem('name'));
      console.log(localStorage.getItem('email'));
      console.log(localStorage.getItem('id'));
      this.user.name = localStorage.getItem('name');
      this.user.email = localStorage.getItem('email');
      this.user.id = localStorage.getItem('id');
    }
  }

}
