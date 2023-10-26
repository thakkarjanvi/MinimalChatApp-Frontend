import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConversationService } from 'src/app/services/conversation.service';
import { Message } from 'src/app/models/message.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  clickedUserId: any;
  clickedUserName:string = '';
  //showUserlist: boolean = true;
  
  searchQuery: string = '';
  searchResults: Message[] = [];
  showSearchResults: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router, private conversationService: ConversationService) {}

  ngOnInit() {
    // Subscribe to the route parameter to get the selected userId
    this.route.params.subscribe(params => {
      this.clickedUserId = params['id'];
  
    });
  }

  search() : void {
    if (this.searchQuery.trim() !== '') {
      //this.showUserlist = true;
      this.conversationService.searchMessages(this.searchQuery).subscribe(
        (results:any) => {
          console.log(results);
          
          this.showSearchResults = true;
          console.log(results);
          
          this.searchResults = results.messages;
        },
        error => {
          console.error(error);
          // Handle error, e.g., show an error message to the user
        }
      );
    } else {
      // Handle empty search query, e.g., show a message to the user
      this.showSearchResults = false;
    }
  }

  closeSearchResults() {
    this.showSearchResults = false;
    //this.showUserlist = true;
    // Additional logic if needed when closing the search results
  }
  
  UserClick(userId: any, name:string) {
    this.clickedUserId=userId;
    this.clickedUserName = name;
    this.router.navigate(['/chat/user', this.clickedUserId]);
  }
}
