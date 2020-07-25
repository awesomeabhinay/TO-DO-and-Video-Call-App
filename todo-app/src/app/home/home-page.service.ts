import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notification } from '../Model/notification.model';

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

  videoCallRequest(userId, code, senderName){
    const data = [];
    data.push(userId);
    data.push(code);
    data.push(senderName);
    return this.http.post(this.url + '/videocall', data);
  }

  getUserNotifications(id): Observable<Notification[]>{
    return this.http.get<Notification[]>(this.url + '/notifications/' + id);
  }

  deleteNotification(id){
    return this.http.delete<Notification>(this.url + '/notification/' + id);
  }
}
