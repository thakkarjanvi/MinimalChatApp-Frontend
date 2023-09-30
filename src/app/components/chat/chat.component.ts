import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  clickedUserId: any;
  clickedUserName:string | null = null;
  

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    // Subscribe to the route parameter to get the selected userId
    this.route.params.subscribe(params => {
      this.clickedUserId = params['id'];
    });
  }
  
  UserClick(userId: any, name:string) {
    this.clickedUserId=userId;
    this.clickedUserName = name;
    console.log("UserId",this.clickedUserName)
    this.router.navigate(['/chat/user', this.clickedUserId]);
  }
}
