import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HomePageService {

  url: string;
  constructor(private http: HttpClient) {
    this.url = 'http://localhost:8080';
  }

  imageUpload(imageData){
    return this.http.post(this.url + '/upload', imageData);
  }

  aboutYouUpload(userUpdatedData){
    return this.http.post(this.url  + '/about', userUpdatedData);
  }
}
