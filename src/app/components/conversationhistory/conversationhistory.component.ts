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
  selectedMessage!: Message;
  contextMenuVisible: boolean = false;
  isEditing: boolean = false;
  isDeleting: boolean = false;
  editedMessageContent: string = '';
  

  constructor(
    private route: ActivatedRoute,
    private conversationService: ConversationService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getConversationHistory();
    this.contextMenuVisible = false;
  }

  getConversationHistory() {
    this.messages = [];
    this.conversationService.getConversationHistory(this.clickedUserId).subscribe(
      (response: any) => {
        console.log(response.messages);
        this.messages = response.messages;
        this.messages = this.messages.reverse();
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

  onContextMenu(event: MouseEvent, message: any) {
    event.preventDefault();
    // Store the selected message and show the context menu
    this.selectedMessage = message;
    this.contextMenuVisible = true;
    // Position the context menu at the mouse coordinates
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
  
  
  editMessage() {
    this.contextMenuVisible = false;
    this.editedMessageContent = this.selectedMessage.content; 
    this.isEditing = true;
  }

  acceptEditMessage() {
    this.isEditing = false;
    this.conversationService.editMessage(this.selectedMessage.id!, this.editedMessageContent).subscribe(() => {
      this.getConversationHistory();
    });
  }

  declineEditMessage() {
    this.isEditing = false;
  }

  deleteMessage() {
    this.contextMenuVisible = false;
    this.isDeleting = true;
  }

  acceptDeleteMessage() {
    const isConfirmed = window.confirm("Are you sure you want to delete the message?");
    if (isConfirmed) {
        this.conversationService.deleteMessage(this.selectedMessage.id).subscribe(
            () => {
                this.toastr.success('Message deleted successfully!', 'Success');
                this.getConversationHistory(); // Refresh the conversation history after deletion
                this.contextMenuVisible = false;
            },
            (error) => {
                // Handle error if deletion fails
                this.toastr.error('Error deleting message', 'Error');
            }
        );
    } else {
        // Handle cancel action if needed
        this.contextMenuVisible = false;
    }
    this.isDeleting = false;
}
  declineDeleteMessage() {
    this.isDeleting = false;
  }


}
