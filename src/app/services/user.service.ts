import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'https://localhost:44353/api/users';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<User[]>(this.apiUrl, { headers });
  }
}
