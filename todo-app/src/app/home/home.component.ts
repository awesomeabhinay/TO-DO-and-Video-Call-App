import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../auth/auth-service.service';
import { User } from '../Model/user/user.model';
import { HttpClient, HttpParams, HttpUserEvent } from '@angular/common/http';
import { Subject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(public authService: AuthServiceService,
              private http: HttpClient,
              public domSan: DomSanitizer, private modalService: NgbModal) { }
  public imageUploaded = false;
  selectedFile: File;
  message: string;
  public pic: any;
  picChanged = new Subject<string>();
  retrieveResonse: any;
  base64Data: any;
  retrieveImage: any;
  userChanged = new Subject<User>();

  user = new User(localStorage.getItem('id'),
    localStorage.getItem('name'),
    localStorage.getItem('email'));

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      // this.getImage();
      this.getImage();
      console.log('kab');
      setTimeout(() => {
        console.log(this.user);
        console.log(localStorage.getItem('name'));
        console.log(localStorage.getItem('email'));
        console.log(localStorage.getItem('id'));
        //console.log(this.user.profilePic);
        this.user.name = localStorage.getItem('name');
        this.user.email = localStorage.getItem('email');
        this.user.id = localStorage.getItem('id');
        console.log(localStorage.getItem('pic'));
        if (localStorage.getItem('pic') === 'data:image/(png|jpg|jpeg);base64,null' || localStorage.getItem('pic') === null) {
          console.log('kaisan ba');
          this.imageUploaded = false;
        }
        else {
          this.imageUploaded = true;
        }
      }, 50);
    }
    console.log(this.imageUploaded);
  }

  public onFileChanged(event) {
    //Select File
    this.user.profilePic = event.target.files[0];
  }

  onUpload() {
    console.log(this.user.profilePic);

    //FormData API provides methods and properties to allow us easily prepare form data to be sent with POST HTTP requests.
    const uploadImageData = new FormData();
    uploadImageData.append('pic', this.user.profilePic, this.user.id);
    uploadImageData.append('id', this.user.id);
    const uploadId = new FormData();
    uploadId.append('id', this.user.id);
    console.log(typeof(uploadImageData));
    //Make a call to the Spring Boot Application to save the image
    this.http.post('http://localhost:8080/upload', uploadImageData, { observe: 'response' })
      .subscribe((response) => {
        if (response.status === 200) {
          this.message = 'Image uploaded successfully';
          this.imageUploaded = true;
          this.userChanged.subscribe(u => this.user = u);
        } else {
          this.message = 'Image not uploaded successfully';
        }
      });
    setTimeout(() => this.getImage(), 500);
    //this.getImage();
  }
   getImage(){
     this.http.get('http://localhost:8080/get/' + this.user.id)
      .subscribe(
        res => {
          this.retrieveResonse = res;
          this.base64Data = this.retrieveResonse.picByte;
          this.retrieveImage = `data:image/(png|jpg|jpeg);base64,${this.base64Data}`;
          this.pic = this.retrieveImage;
          //console.log(this.pic);
          //console.log(this.retrieveImage);
          this.picChanged.next(this.pic);
          this.picChanged.subscribe(p => this.pic = p);
          console.log(this.pic);
          localStorage.setItem('pic', this.pic);
        }
      );
  }

  openWindowCustomClass(content) {
    this.modalService.open(content, { windowClass: 'dark-modal' });
  }
}
