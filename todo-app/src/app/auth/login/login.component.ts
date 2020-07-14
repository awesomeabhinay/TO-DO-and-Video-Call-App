import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthServiceService } from '../auth-service.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from 'src/app/Model/user/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: User;
  formgroup: FormGroup;
  constructor(public authService: AuthServiceService,
              private modalService: NgbModal,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    console.log('inside init');
    this.initForm();
  }
  initForm() {
    this.formgroup = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  loginForm() {
    console.log('inside submit');
    if (this.formgroup.valid) {
      this.authService.login(this.formgroup.value).subscribe(result => {
        this.user = result;
        localStorage.setItem('name', this.user.name);
        localStorage.setItem('email', this.user.email);
        localStorage.setItem('id', this.user.id);
        //this.authService.recieveUserData(this.user);
      });
      this.authService.toggleToken();
      localStorage.setItem('token', this.authService.getToken());
      console.log(localStorage.getItem('token'));
      this.resetForm();
      this.router.navigate(['/home'], {relativeTo: this.route});
    }
    else {
      alert('Fill required detail!');
    }
  }

  resetForm() {
    this.formgroup.reset();
  }
  openVerticallyCentered(content) {
    this.modalService.open(content, { centered: true, size: 'lg', });
  }


}
