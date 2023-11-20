import { Component, OnInit, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
// import { FormGroup } from '@angular/forms';
import { GroupService } from 'src/app/services/group.service';
import { AuthService } from 'src/app/services/auth.service';
import { HttpHeaders } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { CreateGroupDialogComponent } from '../create-group-dialog/create-group-dialog.component';
import { Group } from 'src/app/models/Group';


@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css'] 
})
export class UserlistComponent implements OnInit, OnChanges {

  @Output() clickedUser = new EventEmitter<{ userId: any; name: string; isGroup: boolean }>();

  selectedUserId: string | null = null;
  @Input() users: User[] = [];
  @Input() groups: Group[] = [];

  constructor(private userService: UserService,private authService: AuthService,private dialog: MatDialog, private toastr: ToastrService,private router:Router, private groupService: GroupService) {}

   ngOnInit(): void {
    this.userService.getUsers(false).subscribe((data:any) => {
      this.users = data.users;
      this.toastr.success('User list fetched successfully!', 'Success');
    },
    (error) => {
      console.log('Error fetching user list:', error);
      this.toastr.error('Error fetching user list', 'Error');
  }
  );
  this.groupService.getAllGroups().subscribe((data:any) => 
     {
      this.groups = data; // Assuming your API response contains an array of groups
      this.toastr.success('Group fetched successfully!', 'Success');
    },
    (error) => {
      console.error('Error fetching groups:', error);
    }
  );
 
}
UserClick(userId: any, name:string): void {
    this.selectedUserId = userId;
    this.clickedUser.emit({ userId, name, isGroup: false });
}

GroupClick(groupId: any, groupName:string): void {
  this.selectedUserId = groupId;
  this.clickedUser.emit({ userId: groupId, name: groupName, isGroup: true });
}


ngOnChanges(changes: SimpleChanges) {
  // Reset the selectedUserId when users change
  if (changes['users']) { // Access 'users' using square brackets
    this.selectedUserId = null;
  }
}

loadGroups() {
  this.groupService.getAllGroups().subscribe((data:any) => 
  {
 console.log(data)
   this.groups = data; // Assuming your API response contains an array of groups
   
   this.toastr.success('Group fetched successfully!', 'Success');
 },
 (error) => {
   console.error('Error fetching groups:', error);
 }
);
}

createGroup() {
  const usersWithoutGroup = this.users.filter((user) => user.email !== null);
  const dialogRef = this.dialog.open(CreateGroupDialogComponent, {
    width: '400px',
    data: {
      users: usersWithoutGroup,
    },
  });

  dialogRef.afterClosed().subscribe((result: any) => {
    if (result) {
      // Handle the result from the dialog (group creation)
      console.log(result);
      // Call your service or perform other actions based on the result
      const { groupName, selectedUsers } = result;
      this.groupService.createGroup(groupName, selectedUsers).subscribe(
        (response) => {
          console.log(response);
          this.userService.getUsers(true);
          // this.groupService.getAllGroups();
          this.loadGroups();
          this.toastr.success('Group created successfully');
        },

        (error) => {
          console.error('Error creating group:', error);
          this.toastr.error('Failed to create a group');
        }
      );
    }
  });
}


}