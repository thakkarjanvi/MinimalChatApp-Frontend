import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Message } from 'src/app/models/message.model';
import { ConversationService } from 'src/app/services/conversation.service';
import { ToastrService } from 'ngx-toastr';
import { SendMessage } from 'src/app/models/send-message';
import { ThreadMessage } from 'src/app/models/thread-message';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.css']
})
export class ThreadComponent implements OnInit{
 
  messageId!: any;
  @Input() selectedMessage:Message | null = null;
  @Input() receiverId:string | undefined = undefined;
  
  messages: any[] = [];
  selectedMessageId!: number;
  contextMenuVisible: boolean = false;
  isEditing: boolean = false;
  isDeleting: boolean = false;
  editedMessageContent: string = '';
  clickedUserId: any;
  selectedThreadMessage!:ThreadMessage;
  messageContent: string = '';
  constructor(private route: ActivatedRoute, private conversationService: ConversationService, private toastr: ToastrService ) { }

  ngOnInit() : void {
    
      this.route.params.subscribe(params => {
        const messageId = params['id'];
      if (messageId) {
        this.messageId = messageId;            
        this.conversationService.getThreadMessages(messageId).subscribe((message: any) => {         
          this.messages = message;
          console.log(this.messages);        
        });
      }
    });
  }

  sendMessage() {
    if (!this.messageContent && this.messageContent == '') {
      return; // Prevent sending empty messages
    }
    const message: SendMessage = {
      receiverId: this.receiverId!,
      content: this.messageContent,
      threadId: this.selectedMessage!.messageId
    };
    
    this.conversationService
      .sendMessageInThread(message)
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
          this.getThreadMessages();
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

  onContextMenu(event: MouseEvent, message: ThreadMessage) {
    event.preventDefault();
    // Store the selected message and show the context menu
    this.selectedThreadMessage! = message;
    this.selectedMessageId = message!.messageId;
    console.log(message.messageId)
    this.contextMenuVisible = true;
    // Position the context menu at the mouse coordinates
  }

  getThreadMessages() {
    //this.clickedUserName = this.name;
    this.messages = [];
    this.conversationService
      .getThreadMessages(this.selectedMessage?.messageId!)
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
  // editMessage() {
  //   this.contextMenuVisible = false;
    
  //   this.editedMessageContent = this.selectedThreadMessage.content; 
  //   this.isEditing = true;
  // }

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

  acceptEditMessage() {
    this.isEditing = false;
    this.conversationService.editMessage(this.selectedMessageId!, this.editedMessageContent).subscribe(() => {
      this.editMessageSignalR();
      this.toastr.success('Message edited successfully!', 'Success');
      this.getThreadMessages();
    });
  }

  declineEditMessage() {
    this.isEditing = false;
  }

  // deleteMessage() {
  //   this.contextMenuVisible = false;
  //   this.isDeleting = true;
  // }
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
  acceptDeleteMessage() {
    const isConfirmed = window.confirm("Are you sure you want to delete the message?");
    if (isConfirmed) {
        this.conversationService.deleteMessage(this.selectedMessageId!).subscribe(
            () => {
              this.deleteMessageSignalR();
                this.toastr.success('Message deleted successfully!', 'Success');
                this.getThreadMessages(); // Refresh the conversation history after deletion
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

  editMessage(message: any) {
    this.isEditing = true;
    this.editedMessageContent = message.content;
    // Handle edit logic here
  }
  deleteMessage(messageId: number) {
    this.isDeleting = true;
    // Handle delete logic here, using messageId to identify the message
  }

}




  