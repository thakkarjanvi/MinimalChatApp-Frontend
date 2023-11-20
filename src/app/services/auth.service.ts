import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://localhost:7026/api/User';

  constructor(private http: HttpClient) { }

  registerUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`,user);
  }

  loginUser(user: any): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, user);
  }
  
  isAuthenticated(): boolean {
    // Check if the user is authenticated by verifying the token
    const token = localStorage.getItem('token');
    // Implement your token verification logic here
    return !!token; // Return true if token is present, false otherwise
  }

  attachTokenToHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (token) {
      return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }
    return new HttpHeaders();
  }

  LoginWithGoogle(credentials: string): Observable<any> {
    const header = new HttpHeaders().set('Content-type', 'application/json');
    const url = `${this.apiUrl}/google-Login`;
    return this.http.post(url, JSON.stringify(credentials), { headers: header, withCredentials: true });
  }
}
