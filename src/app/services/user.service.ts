import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'https://localhost:7026/api/User/users';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    let isOnlyUserList: Boolean = false;
    const url = `${this.apiUrl}users?isOnlyUserList=${isOnlyUserList}`;

    return this.http.get<User[]>(this.apiUrl, { headers });

    
  }
  


}
