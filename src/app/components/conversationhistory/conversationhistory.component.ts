import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConversationService } from 'src/app/services/conversation.service';
import { ToastrService } from 'ngx-toastr';
import { Message } from 'src/app/models/message.model';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
//import { AddMembersBoxComponent } from '../add-members-box/add-members-box.component';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/models/user.model';
import { GroupService } from 'src/app/services/group.service';
import { RemoveMembersBoxComponent } from '../remove-members-box/remove-members-box.component';
import { EditGroupNameComponent } from '../edit-group-name/edit-group-name.component';
import { UserAdminBoxComponent } from '../user-admin-box/user-admin-box.component';
import { GroupMembers } from 'src/app/models/GroupMember';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-conversationhistory',
  templateUrl: './conversationhistory.component.html',
  styleUrls: ['./conversationhistory.component.css']
})

export class ConversationhistoryComponent implements OnInit {

  @Input() clickedUserId: any;
  @Input() name: string = '';
  @Output() replyClicked: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() messagePass: EventEmitter<Message> = new EventEmitter<Message>();
  
  clickedUser: any;
  clickedUserName:string | null = null;
  messages: Message[] = [];
  messageContent: string = '';
  selectedMessage!: Message;
  selectedMessageId: number|null= null;
  contextMenuVisible: boolean = false;
  isEditing: boolean = false;
  isDeleting: boolean = false;
  editedMessageContent: string = '';
  showThreadComponent: boolean = false;
  
  isLoadingMoreMessages = false;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  groupmembers: any;
  selectedUserName: any;
  @Input() userId: string = '';
  isGroup: boolean = false;
  userChat: { timestamp: Date }[] = [];
  groupUsers: any;
  currentUserId: string = '';
  isReceiverIdNull: boolean = false;
  isCurrentUserAdminInGroup: boolean = false;
  topTimestamp: Date = new Date();
  constructor(
    private route: ActivatedRoute,
    private conversationService: ConversationService,
    private toastr: ToastrService,
    private router: Router,
    private dialog: MatDialog,
    private groupService : GroupService
  ) {}

  ngOnInit(): void {
    this.getConversationHistory();
    this.subscribeToSignalRMessages();
    this.contextMenuVisible = false;
    this.clickedUserName = this.name;
    this.conversationService.receiveNewMessage$().subscribe((message: any) => {
      console.log("Receive", message);
      
    });
    console.log("Id" , this.clickedUserId);
    console.log("Name" , this.name);
  }

  subscribeToSignalRMessages() {
    this.conversationService.receiveNewMessage$().subscribe((message: string) => {
      console.log('Received new message from SignalR:', message); 
        this.getConversationHistory();
    });
  }

  getConversationHistory() {
    this.clickedUserName = this.name;
    this.messages = [];
    this.conversationService.getConversationHistory(this.clickedUserId).subscribe(
      (response: any) => {
        console.log(response);
        this.messages = response.messages;
        //this.messages = this.messages.reverse();
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

  getMoreConversationHistory() {
    
    this.isLoadingMoreMessages = true;
    const before = this.messages[0].timestamp
    // alert("wdjer")
    this.conversationService.getConversationHistory(this.clickedUserId, before).subscribe({
      next: (res) => {
        //const olderMessages = res.reverse(); // Reverse to maintain chronological order
        //this.messages = olderMessages.concat(this.messages);
        console.log("tgyhuy8hnuij",res);
        
        this.isLoadingMoreMessages = false;
      },
      error: (err) => {
        this.isLoadingMoreMessages = false;
      }
    });
  }

  // onScroll(userChat: HTMLElement) {
  //   const container = this.scrollContainer.nativeElement;
  //   const scrollPosition = container.scrollTop;
  //   const isNearTop = scrollPosition < 20;
  //   console.log("Scroll")

  //   if (isNearTop && !this.isLoadingMoreMessages) {
  //     const oldestMessageTimestamp = this.messages[0].timestamp;
  //     alert("fg");
  //     this.getMoreConversationHistory(this.clickedUserId, new Date(oldestMessageTimestamp));
  //   }
  // }

  @HostListener('scroll', ['$event.target'])
  onScroll(userChat: HTMLElement) {
    console.log(typeof userChat.scrollTop, 'Scroll event triggered');

    if (userChat.scrollTop === 0) {
      console.log('Scroll to the top');
      this.getMoreConversationHistory()
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

    this.conversationService.sendMessage(this.clickedUserId, this.messageContent).subscribe(
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

  declineDeleteMessage() {
    this.isDeleting = false;
  }

showReplyButton(message: Message) {
  message.showReplyButton = true;
}

hideReplyButton(message: Message) {
  message.showReplyButton = false;
}

openThreadComponent(message: Message) {
  if (message.showReplyButton) {
    this.selectedMessage = message;   
    let id = message.messageId;
    this.showThreadComponent = true;
    console.log(`conv ${JSON.stringify(message)}`);

    this.messagePass.emit(message);
    
    this.replyClicked.emit(true);
    this.router.navigate(['chat/thread', id]);
  // Navigate to the thread component and pass the selected message data
  //this.route.navigate(['/thread'], { state: { message: this.selectedMessage } });
  
  // Alternatively, you can emit an event and handle navigation in the parent component.
  // For example:
  // this.replyMessage.emit(this.selectedMessage);
}
else {
  this.showThreadComponent = false;
}
}

// addMembers() {
//   // Open the dialog and pass data to it (e.g., groupUsers)
//   const dialogRef = this.dialog.open(AddMembersBoxComponent, {
//     data: {
//       groupUsers: this.groupmembers,
//     },
//   });

//   // Handle dialog actions as needed
//   dialogRef.afterClosed().subscribe(
//     (result: User[]) => {
//       const userIds: string[] = result.map((user) => user.id);
//       this.groupService
//         .addMembersToGroup(this.userId, userIds)
//         .subscribe((response) => {
//           this.fetchChatwithGroupMembers();
//           this.toastr.success('Success');
//         });
//     },
//     (error) => {
//       this.toastr.error('Error');
//     }
//   );
// }

addMembers() {
  
}

/**
 * Fetches chat data for the current user with group members and updates related properties.
 * - Retrieves user chat messages.
 * - Populates the group members and group user names.
 * - Determines if the current user is an admin in the group.
 * - Sets the top timestamp for chat messages.
 */
private fetchChatwithGroupMembers() {
  this.conversationService.getUserChat(this.userId, null, null, null).subscribe(
    (messages: any) => {
      console.log(messages);

      if (messages) {
        if (
          messages.message == 'No more conversation found.' &&
          messages.data != null
        ) {
          this.isGroup = true;
          this.userChat = [];
          this.groupmembers = messages.data;
          this.groupUsers = this.groupmembers.map(
            (member: GroupMembers) => member.userName
          );
        } else {
          console.log('test1' + messages.data);

          this.userChat = messages.data || [];
          this.isGroup = false;
        }
        if (messages.data[0].users != null) {
          this.groupmembers = messages.data[0].users;
          this.groupUsers = this.groupmembers.map(
            (member: GroupMembers) => member.userName
          );
        }
        const filteredMembers = this.groupmembers.filter(
          (member: GroupMembers) => member.userId === this.currentUserId
        );
        this.isCurrentUserAdminInGroup = filteredMembers.some(
          (member: GroupMembers) => member.isAdmin
        );
        this.topTimestamp =
          this.userChat.length > 0 ? this.userChat[0].timestamp : new Date();
      } else {
        console.log('value not getting');
      }
    },
    (error) => {
      console.log(error);
      this.isGroup = false;
    }
  );
  this.scrollToBottom();
}

/**
 * Opens a confirmation dialog to remove a member from the group.
 * Upon confirmation, sends a request to the groupChatService to remove the specified member from the group.
 * If successful, triggers a chat data update by calling `fetchChatwithGroupMembers`.
 * Handles errors by displaying an error notification using `toasterService`.
 */
removeMember() {
  const dialogRef = this.dialog.open(RemoveMembersBoxComponent, {
    data: {
      groupUsers: this.groupmembers,
    },
  });

  dialogRef.afterClosed().subscribe(
    (memberId) => {
      this.groupService
        .removeMemberFromGroup(this.userId, memberId)
        .subscribe((result: any) => {
          this.fetchChatwithGroupMembers();
        });
    },
    (error) => {
      this.toastr.error('Error while removing members from the group:');
    }
  );
}

/**
 * Opens a dialog to edit the group name and updates it if a new name is provided.
 * @returns void
 */
editGroupName() {
  console.log(this.selectedUserName);

  const dialogRef = this.dialog.open(EditGroupNameComponent, {
    data: {
      groupname: this.selectedUserName,
    },
  });
  dialogRef.afterClosed().subscribe(
    (name) => {
      if (name != undefined && name != '')
        this.groupService
          .updateGroupName(this.userId, name)
          .subscribe((result: any) => {
            this.selectedUserName = name;
            this.fetchChatwithGroupMembers();
          });
      this.toastr.success('Group name updated successfully');
    },
    (error) => {
      this.toastr.error('Error while removing member from the group');
    }
  );
}

/**
 * Initiates a confirmation dialog to delete the group. Performs group deletion if confirmed.
 * @returns void
 */
deleteGroup() {
  const confirmDelete = confirm("Are you sure you want to delete the group?");

  if (confirmDelete) {
    this.groupService.deleteGroup(this.userId).subscribe(
      (data) => {
        console.log(data);
        // Handle success, if needed
      },
      (error) => {
        console.error('Error deleting group:', error);
        // Handle error, if needed
      }
    );
    location.reload();
  } else {
    console.log('Delete operation canceled.');
  }
}


/**
 * Opens a dialog to make a group member an admin within the group.
 * @returns void
 */
makeMemberAdmin() {
  const dialogRef = this.dialog.open(UserAdminBoxComponent, {
    data: {
      groupUsers: this.groupmembers.filter((member: { isAdmin: any; }) => !member.isAdmin),
    },
  });

  dialogRef.afterClosed().subscribe(
    (user) => {
      this.groupService
        .makeUserAdmin(this.userId, user.userId)
        .subscribe((result: any) => {
          this.fetchChatwithGroupMembers();
        });
      this.toastr.success('${user.userName} is now Admin');
    },
    (error) => {
      this.toastr.error('Error while making member admin:');
    }
  );
}

}
