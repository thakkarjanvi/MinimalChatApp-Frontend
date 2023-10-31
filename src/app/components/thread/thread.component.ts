import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Message } from 'src/app/models/message.model';
import { ConversationService } from 'src/app/services/conversation.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.css']
})
export class ThreadComponent implements OnInit{
 
  messageId: number | undefined;
  @Input() selectedMessage:string | null = null;
  
  messages: Message[] = [];
  selectedMessageId: number|null= null;
  contextMenuVisible: boolean = false;
  isEditing: boolean = false;
  isDeleting: boolean = false;
  editedMessageContent: string = '';
  clickedUserId: any;

  messageContent: string = '';

  constructor(private route: ActivatedRoute, private conversationService: ConversationService, private toastr: ToastrService ) { }

  ngOnInit() : void {
    
      this.route.params.subscribe(params => {
        const messageId = params['id'];
      if (messageId) {
        console.log("test");
        
        this.conversationService.getMessageById(messageId).subscribe((message: Message) => {
          console.log(message);
          
          // this.selectedMessage = message;
        });
      }
      console.log('Message ID in ThreadComponent:', messageId); // Check if you are getting the correct messageId
    });
  }

  sendMessage() {
    if (!this.messageContent && this.messageContent == '') {
      return; // Prevent sending empty messages
    }

    this.conversationService
      .sendMessage(this.clickedUserId, this.messageContent)
      .subscribe(
        (response) => {
          this.conversationService.sendMessageSignalR(this.messageContent);
          this.messages.push(response);
          // Send message via SignalR
          // this.conversationService.sendMessageSignalR(message);
          // Handle success, clear the input field, or update your message list
          this.toastr.success('Message sent successfully!', 'Success');
          this.messageContent = ''; // Clear the input field after sending
          // You may want to refresh the conversation history here
          this.getConversationHistory();
          setTimeout(() => {
            this.scrollToBottom();
          });
        },
        (error) => {
          // Handle error
          this.toastr.error('Error sending message', 'Error');
        }
      );
  }

  sendMessageSignalR() {
    if (!this.messageContent || this.messageContent === '') {
      return; // Prevent sending empty messages
    }
    const message = {
      receiverId: this.clickedUserId,
      content: this.messageContent,
    };

    // Send message via SignalR

    // Handle UI logic (clear input field, etc.)
    this.toastr.success('Message sent successfully!', 'Success');
    this.messageContent = ''; // Clear the input field after sending
    setTimeout(() => {
      this.scrollToBottom();
    });
  }

  getConversationHistory() {
    //this.clickedUserName = this.name;
    this.messages = [];
    this.conversationService
      .getConversationHistory(this.clickedUserId)
      .subscribe(
        (response: any) => {
          console.log(response);
          this.messages = response.messages;
          //this.messages = this.messages.reverse();
          setTimeout(() => {
            // this.scrollToBottom();
          });
          this.contextMenuVisible = false;
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

  scrollToBottom() {
    const messageContainer = document.querySelector('.history-container');
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  }

  closeThreadMessages() {
  }

}




  