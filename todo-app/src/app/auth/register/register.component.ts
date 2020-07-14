import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../auth-service.service';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/Model/user/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user: User;
  formgroup: FormGroup;
  constructor(private authService: AuthServiceService) { }

  ngOnInit(): void {
    console.log('inside init');
    this.initForm();
  }
  initForm() {
    this.formgroup = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  submitUserForm() {
    console.log('inside submit');
    if (this.formgroup.valid) {
      this.authService.register(this.formgroup.value).subscribe(result => {
        let user_id;
        localStorage.setItem(user_id, result.id);
        this.user = result;
      });
      this.resetForm();
      alert('Thank You for registering');
    }
    else {
      alert('Fill required detail!');
    }
  }

  resetForm() {
    this.formgroup.reset();
  }
}
