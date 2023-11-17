import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-group-name',
  templateUrl: './edit-group-name.component.html',
  styleUrls: ['./edit-group-name.component.css']
})
export class EditGroupNameComponent {
  constructor(
    public dialogRef: MatDialogRef<EditGroupNameComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  groupname = this.data.groupname;

  onSaveClick() {
    this.dialogRef.close(this.groupname);
  }

  onClose() {
    this.dialogRef.close();
  }
}
