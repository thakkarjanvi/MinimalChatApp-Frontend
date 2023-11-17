import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-user-admin-box',
  templateUrl: './user-admin-box.component.html',
  styleUrls: ['./user-admin-box.component.css']
})
export class UserAdminBoxComponent {
  constructor(
    public dialogRef: MatDialogRef<UserAdminBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  users = this.data.groupUsers;

  makeUserAdmin(user: any) {
    this.dialogRef.close(user);
  }

  onClose() {
    this.dialogRef.close();
  }
}
