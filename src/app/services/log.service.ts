import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor(private http: HttpClient) { }
  private apiUrl = 'https://localhost:44353/api/log';
  
  getLogs(startTime?: string, endTime?: string): Observable<any[]> {
// debugger
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    let params = new HttpParams();

    if (startTime) {
      params = params.set('startTime', startTime.toString());
    }

    if (endTime) {
      params = params.set('endTime', endTime.toString());
    }
  
    return this.http.get<any[]>(this.apiUrl,{headers:headers,params:params});
  }
}
