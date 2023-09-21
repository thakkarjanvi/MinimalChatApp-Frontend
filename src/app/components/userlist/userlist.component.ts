import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnInit{
  users: User[] = [];

  constructor(private userService: UserService, private toastr: ToastrService,) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe((data:any) => {
      this.users = data.users;
      this.toastr.success('User list fetched successfully!', 'Success');
      console.log(data);
    },
    (error) => {
      console.log('Error fetching user list:', error);
      this.toastr.error('Error fetching user list', 'Error');
  }
  );
}
}
