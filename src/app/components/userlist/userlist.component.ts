import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ConversationService } from 'src/app/services/conversation.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';



@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnInit{
  users: User[] = [];
  selectedUser: any = null;
  conversationHistory : any = [];
  receiverName : string = '';
  receiverId : string = '';
  constructor(private userService: UserService,
    private conversationService : ConversationService,
    private http: HttpClient,
    private toastr: ToastrService, private router:Router) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe((data:any) => {
      this.users = data.users;
      this.toastr.success('User list fetched successfully!', 'Success');
      console.log(data);
    },
    (error) => {
      console.log('Error fetching user list:', error);
      this.toastr.error('Error fetching user list', 'Error');
  }
  );
}

  startChat(user:any){
    this.selectedUser = user;
    console.log(this.selectedUser);
    this.fetchConversationHistory()
    
  }

  fetchConversationHistory(){

    var senderId;
    const sort = 'asc'; 
    const time = new Date(); 
    var count = 20;
    
    if (this.selectedUser) { 
      // Check if a user is selected
      this.receiverName = this.selectedUser.name;
      const user = localStorage.getItem('user');
      if (user) {
        const jsonObject = JSON.parse(user);
        senderId = jsonObject.profile.id; 
      }

       // Get the JWT token from AuthService
       const token = this.conversationService.getToken();

       if (token) {
         // Create headers with the Authorization header containing the JWT token
         const headers = new HttpHeaders({
           Authorization: `Bearer ${token}`,
         });
         
       this.receiverId = this.selectedUser.id;

  this.conversationService.getConversationHistory(senderId, this.receiverId, sort, time, count,headers).subscribe(
    (response) => {
      this.conversationHistory = response.messages;
      console.log("fetched" , this.conversationHistory);
      this.toastr.success('Conversation history retrieved!', 'Success');
      console.log('Conversation history:', response);
    },
    (error) => {
      console.error('Error fetching conversation history:', error);
      // Handle the error as needed
    }
  );
  }
  }
  }
}
