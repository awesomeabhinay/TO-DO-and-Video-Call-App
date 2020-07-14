import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../auth-service.service';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/Model/user/user.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user: User;
  regBtnClicked: boolean;
  otp: FormGroup;
  formgroup: FormGroup;
  constructor(private authService: AuthServiceService,
              private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    console.log('inside init');
    this.initForm();
    this.regBtnClicked = false;
  }
  initForm() {
    this.formgroup = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
    this.otp = new FormGroup({
      otp: new FormControl('', [Validators.required])
    });
  }

  submitUserForm() {
    console.log('inside submit');
    if (this.formgroup.valid && this.regBtnClicked === false) {
      this.regBtnClicked = true;
      this.authService.register(this.formgroup.value).subscribe();
      //this.resetForm();
      //alert('Thank You for registering');
    }
    else {
      alert('Fill required detail!');
    }
  }

  onVerifyOtp(){
    this.authService.verifyOtp(this.otp.value, this.formgroup.value).subscribe(result => {
      console.log(result);
      let user_id;
      localStorage.setItem(user_id, result.id);
      this.user = result;
      this.resetForm();
      alert('Thank you ' + this.user.name + ' for registering. Now you can Login');
      this.router.navigateByUrl('/login');
    });
  }

  resetForm() {
    this.formgroup.reset();
  }
}
