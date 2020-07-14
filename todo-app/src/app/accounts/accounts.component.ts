import { Component, OnInit, OnDestroy } from '@angular/core';
import { Account } from '../Model/account.model';
import { Subject, Subscription } from 'rxjs';
import { NgbModal, NgbAccordionConfig } from '@ng-bootstrap/ng-bootstrap';
import { AuthServiceService } from '../auth/auth-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountsService } from './accounts.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { User } from '../Model/user/user.model';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit, OnDestroy {

  formgroup: FormGroup;
  accountData: Account = new Account();
  user_id: string = localStorage.getItem('id');
  user_name: string = localStorage.getItem('name');
  user_email: string = localStorage.getItem('email');
  hide = true;
  hide1 = true;
  accountList: Account[];
  accChanged = new Subject<Account[]>();
  subscription: Subscription;
  user: User = new User(this.user_id, this.user_name, this.user_email);
  constructor(private modalService: NgbModal, config: NgbAccordionConfig,
              public authService: AuthServiceService, private router: Router,
              private route: ActivatedRoute, private accService: AccountsService) {

    config.closeOthers = true;
  }

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      console.log('chala ja');
      this.router.navigate(['/'], { relativeTo: this.route });
    }
    else{
      this.accService.fetchUserAccounts(this.user).subscribe(result => {
        this.accountList = result;
        this.subscription = this.accChanged.subscribe((list: Account[]) => {
          this.accountList = list;
        });
      });
      this.initForm();
    }
    console.log('inside accounts');
  }

  initForm(){
    this.formgroup = new FormGroup({
      user: new FormControl(this.user),
      name: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }
  open(content) {
    this.modalService.open(content);
  }

  onAddNewTask() {
    if (this.formgroup.valid) {
      // const data = {'title': this.formgroup.value.title,
      //               'detail': this.formgroup.value.detail,
      //               'user': user};
      console.log('yaha');
      console.log(this.user);
      console.log(this.formgroup.value);
      this.accService.addNewAccount(this.formgroup.value).subscribe(result => {
        this.accountList.push(result);
        this.subscription = this.accChanged.subscribe(
          (list: Account[]) => {
            this.accountList = list;
          }
        );
      });
      this.resetForm();
    }
  }

  onDeleteAccount(index) {
    this.accountData = this.accountList[index];
    this.accountList.splice(index, 1);
    this.subscription = this.accChanged.subscribe(list => {
      this.accountList = list;
    });
    console.log(this.accountData);
    this.accService.deleteAccountByIndex(this.accountData).subscribe();
  }

  resetForm() {
    this.formgroup.reset();
  }

  ngOnDestroy(): void {
    //this.subscription.unsubscribe();
  }

}
