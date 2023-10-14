import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
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
  @Input() name: string = '';
  
  clickedUser: any;
  clickedUserName:string | null = null;
  messages: Message[] = [];
  messageContent: string = '';
  selectedMessage!: Message;
  contextMenuVisible: boolean = false;
  isEditing: boolean = false;
  isDeleting: boolean = false;
  editedMessageContent: string = '';

  isLoadingMoreMessages = false;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  

  constructor(
    private route: ActivatedRoute,
    private conversationService: ConversationService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
  

    this.getConversationHistory();
    //this.subscribeToSignalRMessages();
    this.contextMenuVisible = false;
    this.clickedUserName = this.name;
  }

  // subscribeToSignalRMessages() {
  //   this.conversationService.messageReceived.subscribe((message: Message) => {
  //     // Update the UI when a new message is received via SignalR
  //     this.messages.push(message);
  //     this.scrollToBottom();
  //   });
  // }

  getConversationHistory() {
    debugger
    this.clickedUserName = this.name;
    this.messages = [];
    this.conversationService.getConversationHistory(this.clickedUserId).subscribe(
      (response: any) => {
        console.log(response.messages);
        this.messages = response.messages;
        this.messages = this.messages.reverse();
        setTimeout(() => {
          this.scrollToBottom();
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

  getMoreConversationHistory(userId: string, before: Date) {
    debugger
    this.isLoadingMoreMessages = true;
    this.conversationService.getConversationHistory(userId, before).subscribe({
      next: (res) => {
        //const olderMessages = res.data.reverse(); // Reverse to maintain chronological order
        //this.messages = olderMessages.concat(this.messages);
        this.isLoadingMoreMessages = false;
      },
      error: (err) => {
        this.isLoadingMoreMessages = false;
      }
    });
  }

  onScroll(userChat: HTMLElement) {
    const container = this.scrollContainer.nativeElement;
    const scrollPosition = container.scrollTop;
    const isNearTop = scrollPosition < 20;
    console.log("Scroll")

    if (isNearTop && !this.isLoadingMoreMessages) {
      const oldestMessageTimestamp = this.messages[0].timestamp;
      alert("fg");
      this.getMoreConversationHistory(this.clickedUserId, new Date(oldestMessageTimestamp));
    }
  }


  // scrollToBottom() {
  //   setTimeout(() => {
  //     console.log("scrolled to bottom")
  //     const container = this.scrollContainer.nativeElement;
  //     container.scrollTop = container.scrollHeight;
  //   }, 0);
  // }
  scrollToBottom() {
    const messageContainer = document.querySelector('.history-container');
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  }
  
  onContextMenu(event: MouseEvent, message: any) {
    event.preventDefault();
    // Store the selected message and show the context menu
    this.selectedMessage = message;
    this.contextMenuVisible = true;
    // Position the context menu at the mouse coordinates
  }

  sendMessageSignalR() {
    if (!this.messageContent || this.messageContent === '') {
      return; // Prevent sending empty messages
    }
  
    const message = {
      receiverId: this.clickedUserId,
      content: this.messageContent
    };
  
    // Send message via SignalR
    this.conversationService.sendMessageSignalR(message);
  
    // Handle UI logic (clear input field, etc.)
    this.toastr.success('Message sent successfully!', 'Success');
    this.messageContent = ''; // Clear the input field after sending
  }
  
  editMessageSignalR() {
    // Check if a message is selected for editing
    if (!this.selectedMessage) {
      return;
    }
  
    // Call the edit message method via SignalR
    this.conversationService.editMessageSignalR(this.selectedMessage.id, this.editedMessageContent);
  
    // Handle UI logic or any other actions after editing the message
    this.isEditing = false;
  }
  
  deleteMessageSignalR() {
    // Check if a message is selected for deletion
    if (!this.selectedMessage) {
      return;
    }
  
    // Call the delete message method via SignalR
    this.conversationService.deleteMessageSignalR(this.selectedMessage.id);
  
    // Handle UI logic or any other actions after deleting the message
    this.isDeleting = false;
  }

  sendMessage() {
    debugger
    if (!this.messageContent && this.messageContent == '') {
      return; // Prevent sending empty messages
    }

    this.conversationService.sendMessage(this.clickedUserId, this.messageContent).subscribe(
      (response) => {

        console.log(response);
        this.messages.push(response);
         // Send message via SignalR
    // this.conversationService.sendMessageSignalR(message);
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
