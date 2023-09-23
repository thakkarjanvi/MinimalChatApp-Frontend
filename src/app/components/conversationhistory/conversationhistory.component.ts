import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConversationService } from 'src/app/services/conversation.service';
import { ToastrService } from 'ngx-toastr';
import { Message } from 'src/app/models/message.model';

@Component({
  selector: 'app-conversationhistory',
  templateUrl: './conversationhistory.component.html',
  styleUrls: ['./conversationhistory.component.css']
})


export class ConversationhistoryComponent implements OnInit {
  clickedUser: any;
  messages: Message[] = [];
  messageContent: string = '';

  constructor(
    private route: ActivatedRoute,
    private conversationService: ConversationService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.clickedUser = params; // Get the user ID from the route parameter
      this.getConversationHistory(this.clickedUser.id); // Fetch conversation history for the user
    });
  }

  getConversationHistory(userId: number) {
    this.messages = [];
    this.conversationService.getConversationHistory(userId).subscribe(
      (response: Message[]) => {
        console.log(response);
        this.messages = response;
        this.toastr.success('Conversation history received', 'Success');
      },
      (error) => {
        if (error.error == 'Conversation not found') {
          this.messages = [];
          this.toastr.error('Conversation history not found');
        }
      }
    );
  }

  sendMessage() {
    // Implement your sendMessage logic here
  }
}
