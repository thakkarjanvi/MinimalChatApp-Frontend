// import { Component, Inject } from '@angular/core';
// import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
// import { User } from 'src/app/models/user.model';
// import { UserService } from 'src/app/services/user.service';


// @Component({
//   selector: 'app-add-members-box',
//   templateUrl: './add-members-box.component.html',
//   styleUrls: ['./add-members-box.component.css']
// })
// export class AddMembersBoxComponent {
//   allusers: any[] = [];
//   constructor(
//     private userService: UserService,
//     public dialogRef: MatDialogRef<AddMembersBoxComponent>,
//     @Inject(MAT_DIALOG_DATA) public data: any
//   ) {
//     this.userService.getUsers(true).subscribe((users: any) => {
//       this.allusers = users.data.map((user: User) => ({
//         ...user,
//         isSelected: false,
//       }));
//     });
//   }
//   groupUsers = this.data.groupUsers;

//   availableUsers = this.data.groupUsers;
//   isUserInGroup(user: User): boolean {
//     const isUserInGroup = this.groupUsers.some(
//       (groupUser: any) => groupUser.userId === user.id
//     );
//     return !isUserInGroup;
//   }

//   onSubmit() {
//     // Collect the selected users
//     const selectedUsers = this.allusers.filter((user) => user.isSelected);
//     // Close the dialog
//     this.dialogRef.close(selectedUsers);
//   }

//   onClose() {
//     this.dialogRef.close();
//   }
// }
