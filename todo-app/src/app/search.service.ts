import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { User } from './Model/user/user.model';
import { map } from 'rxjs/operators';

function createHttpOptions(packageName: string, refresh = false) {
  // npm package name search api
  // e.g., http://npmsearch.com/query?q=dom'
  const params = new HttpParams({ fromObject: { q: packageName } });
  const headerMap = refresh ? { 'x-refresh': 'true' } : {};
  const headers = new HttpHeaders(headerMap);
  return { headers, params };
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  searchedUser = new Subject<User>();
  url: string;
  constructor(private http: HttpClient) { 
    this.url = 'http://localhost:8080/users/';
  }

  search(name: string): Observable<User[]>{
    if (!name.trim()){return of([]); }
    const options = createHttpOptions(name, true);
    return this.http.get<User[]>(this.url + name, options).pipe(
      // map((data: any) => {
      //   return data.results.map((entry: any) => ({
      //     name: entry.name[0],
      //     id: entry.id[0],
      //     email: entry.email[0]
      //   } as User)
      //   );
      // })
    );
  }
}
