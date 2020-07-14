import { Injectable } from '@angular/core';
import { Account } from '../Model/account.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  accUrl: string;
  constructor(private http: HttpClient) {
    this.accUrl = 'http://localhost:8080/account';
  }

  deleteAccountByIndex(data) {
    console.log('ye id hai=>');
    console.log(data);
    return this.http.delete<Account>(this.accUrl + '/' + data.id);
  }

  fetchUserAccounts(user): Observable<Account[]> {
    return this.http.get<Account[]>(this.accUrl + '/' + user.id);
  }

  addNewAccount(accountData): Observable<Account> {
    console.log(accountData);
    return this.http.post<Account>(this.accUrl, accountData);
  }
}
