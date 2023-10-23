import { Component, OnInit, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnInit, OnChanges {

  @Output() clickedUser = new EventEmitter<{ userId: any; name: string }>();
  selectedUserId: string | null = null;

  @Input() users: User[] = [];
  //clickedUser:any;
  //loggedInuser : any='' ;


  constructor(private userService: UserService, private toastr: ToastrService,private router:Router) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe((data:any) => {
      this.users = data.users;
      this.toastr.success('User list fetched successfully!', 'Success');
    },
    (error) => {
      console.log('Error fetching user list:', error);
      this.toastr.error('Error fetching user list', 'Error');
  }
  );
  // this.loggedInuser=localStorage.getItem("user");
  // console.log(this.loggedInuser.profile)
}
UserClick(userId: any, name:string): void {
    this.selectedUserId = userId;
  this.clickedUser.emit({ userId, name });
}

ngOnChanges(changes: SimpleChanges) {
  // Reset the selectedUserId when users change
  if (changes['users']) { // Access 'users' using square brackets
    this.selectedUserId = null;
  }
}
}