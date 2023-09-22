import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {
  private apiUrl = 'https://localhost:44353/api';

  constructor(private http: HttpClient) { }
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  // Add JWT token to headers
  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // getConversationHistory(userId: string, before?: string): Observable<Message[]> {
  //   let params = new HttpParams().set('sort', 'desc').set('limit', '20');

  //   if (before) {
  //     params = params.set('before', before);
  //   }
  //   const headers = this.getHeaders();
  //   params = params.set('userId', userId);

  //   return this.http.get<Message[]>(`${this.apiUrl}`, {headers, params });
  // }

  getConversationHistory(senderId: string,
    receiverId: string,
    sort: string,
    time: Date,
    count: number,
    headers:HttpHeaders
  ): Observable<any> {
    const params = new HttpParams()
      .set('receiverId', receiverId)
      .set('sort', sort)
      .set('time', time.toISOString())
      .set('count', count.toString());

    const options = { headers, params };

    return this.http.get(`${this.apiUrl}/messages`,{ headers, params });
  }
}
