import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnInit{

  @Output() clickedUser = new EventEmitter<any>();
  @Input() users: User[] = [];
  //clickedUser:any;


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
}
UserClick(userId: any) {
  this.clickedUser.emit(userId);
}

// UserClick(user: User): void {
//   this.clickedUser = user;
//   console.log('User ID:', this.clickedUser.id);

//   // Navigate to a specific route with the user's ID, assuming you have a route defined for it
//   this.router.navigate(['/chat/user', this.clickedUser.id]);
// }
}