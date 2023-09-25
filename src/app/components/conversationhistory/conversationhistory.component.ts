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
