import { Component, OnInit } from '@angular/core';
import { LogService } from 'src/app/services/log.service';
import { AuthService } from 'src/app/services/auth.service';
import { HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-requestlogging',
  templateUrl: './requestlogging.component.html',
  styleUrls: ['./requestlogging.component.css']
})
export class RequestloggingComponent {

  logs: any[] = [];
  startTime?: string;
  endTime?: string;

  selectedTimeframe!: number; // Ensure this property is defined
  showIdColumn: boolean = false;
  showIpAddressColumn: boolean = false;
  showRequestBodyColumn: boolean = false;
  showTimestampColumn: boolean = false;
  showUsernameColumn: boolean = false;
  authService: any;

  constructor(private logService : LogService)  {}

  getLogs(){
    console.log(this.startTime,this.endTime)
    this.logService.getLogs(this.startTime, this.endTime).subscribe((res)=>{
      this.logs=res;
})
  }

  getLastLogs(minutes: number) {
    console.log(minutes);
    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - minutes * 60000);
    console.log(startTime,endTime)
    console.log(this.formatDate( startTime),this.formatDate(endTime))
    this.logService.getLogs(this.formatDate( startTime),this.formatDate(endTime)).subscribe((res)=>{
      console.log(res);
       this.logs=res;
    },(error)=>{
      console.log(error.error);
      this.logs=[];
    })
  }

  customTime(){
    console.log(this.startTime,this.endTime)
    this.logService.getLogs(this.startTime?.toString(),this.endTime?.toString()).subscribe((res)=>{
      console.log(res);
       this.logs=res;
    })
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = this.padZero(date.getMonth() + 1);
    const day = this.padZero(date.getDate());
    const hours = this.padZero(date.getHours());
    const minutes = this.padZero(date.getMinutes());

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
  padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  toggleColumn(columnName: string) {
    switch (columnName) {
      case 'id':
        this.showIdColumn = !this.showIdColumn;
        break;
      case 'timestamp':
        this.showTimestampColumn = !this.showTimestampColumn;
        break;
      case 'ipAddress':
        this.showIpAddressColumn = !this.showIpAddressColumn;
        break;
      case 'username':
        this.showUsernameColumn = !this.showUsernameColumn;
        break;
      case 'requestBody':
        this.showRequestBodyColumn = !this.showRequestBodyColumn;
        break;
      default:
        break;
    }
  }
}
