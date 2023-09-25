import { Component, OnInit, Input } from '@angular/core';
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

  @Input() clickedUserId: any;
  clickedUser: any;
  messages: Message[] = [];
  messageContent: string = '';

  constructor(
    private route: ActivatedRoute,
    private conversationService: ConversationService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getConversationHistory();
  }

  getConversationHistory() {
    this.messages = [];
    this.conversationService.getConversationHistory(this.clickedUserId).subscribe(
      (response: any) => {
        console.log(response.messages);
        this.messages = response.messages;
        this.messages = this.messages.reverse();
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
    if (!this.messageContent && this.messageContent == '') {
      return; // Prevent sending empty messages
    }

    this.conversationService.sendMessage(this.clickedUserId, this.messageContent).subscribe(
      (response) => {
        // Handle success, clear the input field, or update your message list
        this.toastr.success('Message sent successfully!', 'Success');
        this.messageContent = ''; // Clear the input field after sending
        // You may want to refresh the conversation history here
        this.getConversationHistory();
      },
      (error) => {
        // Handle error
        this.toastr.error('Error sending message', 'Error');
      }
    );
  }
    
}
