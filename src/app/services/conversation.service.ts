import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {
  private apiUrl = 'https://localhost:44353/api/messages';

  constructor(private http: HttpClient) { }

  clickedUser: any = null;
  receiverId!: number ;
  getConversationHistory(userId: number, before?: Date, count: number = 20, sort: string ='asc'): Observable<any[]> {
    
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    let params = new HttpParams().set('userId', userId.toString())
    .set('count', count.toString())
    .set('sort', sort);

    if (before) {
      params = params.set('before', before.toISOString());
    }

    return this.http.get<any[]>(`${this.apiUrl}/${userId}`, { params });
  }
}
