import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../auth/auth-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(public auth: AuthServiceService) { }

  ngOnInit(): void {
  }

  onLogout(){
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    localStorage.removeItem('id');
    this.auth.logout();
  }

}
