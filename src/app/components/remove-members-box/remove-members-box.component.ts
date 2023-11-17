import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GroupService } from 'src/app/services/group.service';

@Component({
  selector: 'app-remove-members-box',
  templateUrl: './remove-members-box.component.html',
  styleUrls: ['./remove-members-box.component.css']
})
export class RemoveMembersBoxComponent {
  constructor(
    public dialogRef: MatDialogRef<RemoveMembersBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  users = this.data.groupUsers;

  removeUser(user: any) {
    if (confirm(`Are you sure you want to remove ${user.userName}?`)) {
      console.log(user.userId);
      alert(`${user.userName} has been removed from this group.`);
    } else {
      alert(`${user.userName} is safe in this group :)`);
    }

    this.dialogRef.close(user.userId);
  }
  
  onClose() {
    this.dialogRef.close();
  }
}
