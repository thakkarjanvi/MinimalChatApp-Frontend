import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createGroup(name: string, members: string[]): Observable<any> {
    //console.log(`HERER WE ARE :- ${name} -- ${members}`);
    const url = `${this.apiUrl}create-group`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const body = {
      groupName: name,
      members: members,
    };
//console.log(`HERE WE ARE :- ${JSON.stringify(body)}`);

    return this.http.post(url, body, { headers });
  }

  getAllGroups(): Observable<any> {
    const url = `${this.apiUrl}`; // Replace with your actual API endpoint for getting all groups
    return this.http.get(url);
  }

  addMembersToGroup(groupId: string, memberIds: string[]): Observable<any> {
    const url = `${this.apiUrl}Group/${groupId}/add-member`;
    return this.http.post(url, memberIds);
  }

  removeMemberFromGroup(groupId: string, memberId: string): Observable<any> {
    const url = `${this.apiUrl}Group/${groupId}/remove-member`;
    const params = { memberId: memberId };
    return this.http.post(url, null, { params: params });
  }

  updateGroupName(groupId: string, newName: string): Observable<any> {
    const url = `${this.apiUrl}Group/${groupId}/edit-group-name`;
    const params = { newName: newName };
    return this.http.put(url, null, { params: params });
  }

  deleteGroup(groupId: string): Observable<any> {
    const url = `${this.apiUrl}Group/${groupId}/delete-group`;
    return this.http.delete(url);
  }

  makeUserAdmin(groupId: string, userId: string): Observable<any> {
    const url = `${this.apiUrl}Group/make-member-admin`;
    const params = { groupId: groupId, memberId: userId };
    return this.http.put(url, null, { params: params });
  }
}