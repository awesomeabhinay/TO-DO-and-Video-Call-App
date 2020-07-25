import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../auth/auth-service.service';
import { User } from '../Model/user/user.model';
import { HttpClient, HttpParams, HttpUserEvent } from '@angular/common/http';
import { Subject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { HomePageService } from './home-page.service';
import { SearchService } from '../search.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Notification } from '../Model/notification.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [NgbModalConfig, NgbModal]
})
export class HomeComponent implements OnInit {

  formgroup: FormGroup;
  constructor(public authService: AuthServiceService, private searchService: SearchService,
              private http: HttpClient, private homeService: HomePageService,
              public domSan: DomSanitizer, private modalService: NgbModal,
              private router: Router, private route: ActivatedRoute) {
  }
  public imageUploaded = false;
  public aboutYouUploaded = false;
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
  seachedUser: User = new User('', '', '');
  deleteSearchedUser: boolean = true;
  notifications: Notification[];
  notif$ = new Subject<Notification[]>();
  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.searchService.searchedUser.subscribe(u => {
        this.seachedUser = u;
        this.deleteSearchedUser = false;
      });

      this.homeService.getUserNotifications(this.user.id).subscribe(notiList => {
        this.notifications = notiList;
        this.notif$.next(this.notifications);
        this.notif$.subscribe(nl => this.notifications = nl);
      });

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
        this.user.about = localStorage.getItem('about');

        //console.log(localStorage.getItem('pic'));
        if (localStorage.getItem('pic') === 'data:image/(png|jpg|jpeg);base64,null' || localStorage.getItem('pic') === null) {
          console.log('kaisan ba');
          this.imageUploaded = false;
        }
        else {
          this.imageUploaded = true;
        }
        console.log(this.user.about);
        if (this.user.about === 'null') {
          this.formgroup = new FormGroup({
            about: new FormControl('', [Validators.required])
          });
          console.log(this.user.about);
          this.aboutYouUploaded = false;
        }
        else {
          this.aboutYouUploaded = true;
        }
      }, 200);

    }
    console.log(this.imageUploaded);
  }

  public onFileChanged(event) {
    //Select File
    this.user.profilePic = event.target.files[0];
  }

  onImageUpload() {
    console.log(this.user.profilePic);
    const uploadImageData = new FormData();
    uploadImageData.append('pic', this.user.profilePic, this.user.id);
    uploadImageData.append('id', this.user.id);
    console.log(typeof(uploadImageData));
    this.homeService.imageUpload(uploadImageData).subscribe((response) => {
      this.imageUploaded = true;
      this.userChanged.subscribe(u => this.user = u);
    });
    setTimeout(() => this.getImage(), 500);
  }

  onAboutYouUpload(){
    if (this.formgroup.valid){
      console.log(this.formgroup.value);
      const newUserData = new FormGroup({
        id: new FormControl(this.user.id, [Validators.required]),
        name: new FormControl(this.user.name, [Validators.required]),
        email: new FormControl(this.user.email, [Validators.required]),
        password: new FormControl(this.user.password, [Validators.required]),
        about: new FormControl(this.formgroup.value.about, [Validators.required])
      });
      console.log(newUserData.value);
      this.homeService.aboutYouUpload(newUserData.value).subscribe(() => {
        this.user.about = newUserData.value.about;
        this.userChanged.subscribe(u => this.user = u);
        this.aboutYouUploaded = true;
        localStorage.setItem('about', this.user.about);
      });
    }
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
        //console.log(this.pic);
        localStorage.setItem('pic', this.pic);
      }
    );
  }

  onVideoCall(id){
    console.log(id);
    const code = Math.floor(100000000 + Math.random() * 900000000);
    console.log(code);
    this.homeService.videoCallRequest(id, code, this.user.name).subscribe();
    this.router.navigateByUrl('/video-call/' + code);
  }

  onDeleteNotification(id, i){
    this.notifications.splice(i, 1);
    this.notif$.next(this.notifications);
    this.notif$.subscribe(nl => this.notifications = nl);
    this.homeService.deleteNotification(id).subscribe();
  }

  openWindowCustomClass(content) {
    this.modalService.open(content, { windowClass: 'dark-modal' });
  }
  open(content) {
    this.modalService.open(content);
  }

  onDeleteSearchedUser(){
    this.deleteSearchedUser = true;
  }
}
