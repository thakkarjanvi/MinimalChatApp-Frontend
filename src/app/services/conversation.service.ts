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
  getConversationHistory(userId: any, before?: Date, count: number = 20, sort: string ='desc'): Observable<any[]> {
    
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    let params = new HttpParams().set('receiverId', userId.toString())
    .set('count', count.toString())
    .set('sort', sort);

    if (before) {
      params = params.set('before', before.toISOString());
    }

    return this.http.get<any[]>(`${this.apiUrl}`, { params, headers });
  }

  sendMessage(receiverId: number, content: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    const body = {
      receiverId: receiverId,
      content: content
    };
  
    return this.http.post<any>(`${this.apiUrl}`, body, { headers });
  }
  
  editMessage(messageId:number,content:string) :Observable<any>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    const body = {
      messageId: messageId,
      content: content
    };
  
    return this.http.put<any>(`${this.apiUrl}/${messageId}`, body, { headers });
  }

  deleteMessage(messageId: number) :Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete<any>(`${this.apiUrl}/${messageId}`, { headers });
  }
}


