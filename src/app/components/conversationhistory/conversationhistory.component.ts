import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Message } from 'src/app/models/message.model';
import { ConversationService } from 'src/app/services/conversation.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-conversationhistory',
  templateUrl: './conversationhistory.component.html',
  styleUrls: ['./conversationhistory.component.css']
})
export class ConversationhistoryComponent implements OnInit{
  userId: string= '';
  messages: Message[] = [];
  loading = false;
  hasMore = true;
  @Input() conversationHistory : any[] = [];
  
  constructor(
    private route: ActivatedRoute,
    private conversationService: ConversationService,
    private toastr: ToastrService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
   
    this.route.params.subscribe((params) => {
      this.userId = params['userId'];
      this.fetchConversationHistory();
    });
  }

  fetchConversationHistory() {
    // Check if the userId is defined
    if (!this.userId) {
      console.error('User ID is undefined. Cannot fetch conversation history.');
      return;
    }

    // Use your message service to fetch conversation history

  }
  // fetchConversationHistory(): void {
  //   if (!this.loading && this.hasMore) {
  //     this.loading = true;

  //     this.conversationService.getConversationHistory(this.userId, this.getLastMessageId()).subscribe(
  //       (data) => {
  //         if (data.length === 0) {
  //           this.hasMore = false;
  //         } else {
  //           this.messages = [...data.reverse(), ...this.messages];
  //         }
  //         this.loading = false;

  //         this.toastr.success('Conversation history received', 'Success');
  //       },
  //       (error) => {
  //         console.error('Error fetching conversation history:', error);
  //         this.loading = false;
  //         this.toastr.error('Error fetching conversation history', 'Error');
  //       }
  //     );
  //   }
  // }

  getLastMessageId(): string | undefined {
    const lastMessage = this.messages[this.messages.length - 1];
    return lastMessage ? lastMessage.id : undefined;
  }

}
