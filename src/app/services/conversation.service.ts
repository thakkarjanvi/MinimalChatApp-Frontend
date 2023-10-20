import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpTransportType, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import * as signalR from '@microsoft/signalr';


@Injectable({
  providedIn: 'root'
})
export class ConversationService {
  private apiUrl = 'https://localhost:7026/api/messages';

  private hubConnection: signalR.HubConnection;
  messageReceived: any;
  private messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private http: HttpClient) { 
    this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl('https://localhost:7026/chathub')
    .withAutomaticReconnect()
    .build();

  this.startConnection();

  this.hubConnection.on('ReceiveMessage', (message: string) => {
    this.messageSubject.next(message);
  });
  this.hubConnection.on('EditMessage', (id: string, content:string) => {
    this.messageSubject.next(content);
  });
  this.hubConnection.on('DeleteMessage', (id: string) => {
    this.messageSubject.next(id);
  });
  }

  private startConnection() {
    this.hubConnection
      .start()
      .then(() => console.log('SignalR Connection Started'))
      .catch(err => console.error('Error while starting connection: ' + err));
  }

  receiveNewMessage$(): Observable<string> {
    return this.messageSubject.asObservable();
  }

  sendMessageSignalR(message:string) {
    this.hubConnection.invoke('SendMessage', message);
  }

  // Method to edit a message via SignalR
  editMessageSignalR(messageId: number, content: string) {
    this.hubConnection.invoke('EditMessage', messageId, content);
  } 

  // Method to delete a message via SignalR
  deleteMessageSignalR(messageId: number) {
    this.hubConnection.invoke('DeleteMessage', messageId);
  }

  clickedUser: any = null;
  receiverId!: number ;
  getConversationHistory(userId: any, before?: Date, count: number = 20, sort: string ='desc'): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    let params = new HttpParams()
    .set('UserId', userId.toString())
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


