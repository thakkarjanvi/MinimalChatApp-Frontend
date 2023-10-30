import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Message } from 'src/app/models/message.model';
import { ConversationService } from 'src/app/services/conversation.service';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.css']
})
export class ThreadComponent implements OnInit{
  threadMessages: Message[] = [];
  newMessageContent: string = '';
  messageId: number | undefined;
  messageContent: string | undefined;
  @Input() selectedMessage:string | null = null;
  
  messages: Message[] = [];
  messageContent: string = '';
  selectedMessage!: Message;
  selectedMessageId: number|null= null;
  contextMenuVisible: boolean = false;
  isEditing: boolean = false;
  isDeleting: boolean = false;
  editedMessageContent: string = '';
  clickedUserId: any;
  toastr: any;

  constructor(private route: ActivatedRoute, private conversationService: ConversationService ) { }

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

    onContextMenu(event: MouseEvent, message: any) {
      event.preventDefault();
      // Store the selected message and show the context menu
      this.selectedMessage = message;
      this.selectedMessageId = message.messageId;
      console.log(message.messageId)
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
    
      // Handle UI logic (clear input field, etc.)
      this.toastr.success('Message sent successfully!', 'Success');
      this.messageContent = ''; // Clear the input field after sending
      setTimeout(() => {
        this.scrollToBottom();
      });
    }
  scrollToBottom() {
    throw new Error('Method not implemented.');
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
      if (!this.messageContent && this.messageContent == '') {
        return; // Prevent sending empty messages
      }
  
      this.conversationService.sendMessage(this.messageId, selectedMessage).subscribe(
        (response) => {
          this.conversationService.sendMessageSignalR(selectedMessage);
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

    editMessage() {
      this.contextMenuVisible = false;
      
      this.editedMessageContent = this.selectedMessage.content; 
      this.isEditing = true;
    }
  
    acceptEditMessage() {
      this.isEditing = false;
      console.log("hi"+this.selectedMessage.id);
  
      this.conversationService.editMessage(this.selectedMessageId!, this.editedMessageContent).subscribe(() => {
        this.editMessageSignalR();
        this.toastr.success('Message edited successfully!', 'Success');
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
          this.conversationService.deleteMessage(this.selectedMessageId!).subscribe(
              () => {
                this.deleteMessageSignalR();
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
  getConversationHistory() {
    throw new Error('Method not implemented.');
  }
  
  declineDeleteMessage() {
    this.isDeleting = false;
  }

  


  closeThreadMessages() {
  }

}




  