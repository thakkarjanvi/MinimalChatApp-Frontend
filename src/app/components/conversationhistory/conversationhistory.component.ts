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

  editMessageVisible = false;
  editedMessageContent = '';

  deleteConfirmationVisible = false;
  deleteMessageId: string = '';

  editDeletePopupVisible = false;
  

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

  showContextMenu(event: MouseEvent, message: Message) {
    event.preventDefault();
    this.editMessageVisible = false; // Hide edit message editor
    this.deleteConfirmationVisible = false; // Hide delete confirmation
    // Set deleteMessageId for deletion
    this.deleteMessageId = message.id;
  }

  togglePopup(message: Message) {
    this.editMessageVisible = !this.editMessageVisible; // Toggle edit pop-up
    this.deleteConfirmationVisible = false; // Close delete confirmation if open
    this.editedMessageContent = message.content; // Set content for editing
    this.deleteMessageId = message.id; // Set message ID for deletion
  }

  editMessage() {
    // this.editedMessageContent = message.content;
    console.log("edit")
    this.editMessageVisible = true;
    this.editDeletePopupVisible = true;
    this.deleteConfirmationVisible = false; // Hide delete confirmation
  }

  // Method to accept the edited message
  acceptEdit() {
    // Check if edited message content is not empty
    if (this.editedMessageContent && this.editedMessageContent.trim() !== '') {
      const messageId = Number(this.deleteMessageId);
      this.conversationService.editMessage(messageId, this.editedMessageContent).subscribe(
        (response) => {
          this.toastr.success('Message edited successfully!', 'Success');
          this.editMessageVisible = false; // Hide edit message editor
          // this.editedMessageContent = ''; // Clear edited message content
          this.getConversationHistory(); // Refresh conversation history
        },
        (error) => {
          this.toastr.error('Error editing message', 'Error');
        }
      );
    } else {
      this.toastr.warning('Edited message cannot be empty', 'Warning');
    }
  }

  // Method to cancel the edit
  cancelEdit() {
    this.editMessageVisible = false;
  }

  // Method to show the delete confirmation dialog
  deleteMessage() {
    // this.deleteMessageId = message.id;
    this.deleteConfirmationVisible = true;
  }

  // Method to delete a message
  acceptDelete() {
    const messageId = Number(this.deleteMessageId);
    this.conversationService.deleteMessage(messageId).subscribe(
      (response) => {
        this.toastr.success('Message deleted successfully!', 'Success');
        this.deleteConfirmationVisible = false; // Hide delete confirmation
        this.getConversationHistory(); // Refresh conversation history
      },
      (error) => {
        this.toastr.error('Error deleting message', 'Error');
      }
    );
  }

  // Method to cancel the delete
  cancelDelete() {
    this.deleteConfirmationVisible = false;
  }

  cancelPopup() {
    this.editDeletePopupVisible = false;
  }

}
