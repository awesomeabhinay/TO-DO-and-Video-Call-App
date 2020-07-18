import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../auth/auth-service.service';
import { Observable, Subject } from 'rxjs';
import { User } from '../Model/user/user.model';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { SearchService } from '../search.service';
import { ActivatedRoute } from '@angular/router';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  len: number;
  constructor(public auth: AuthServiceService, private searchService: SearchService, private route: ActivatedRoute) { }
  users$: Observable<User[]>;
  private searchText$ = new Subject<string>();
  ngOnInit(): void {
    this.users$ = this.searchText$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(name =>
        this.searchService.search(name))
    );
  }

  onLogout(){
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    localStorage.removeItem('id');
    this.auth.logout();
  }

  search(name: string){
    if (name === '') {
      this.len = 0;
    }
    else {this.len = 1; }
    this.searchText$.next(name);
  }

  clicked(u){
    this.searchService.searchedUser.next(u);
  }

}
