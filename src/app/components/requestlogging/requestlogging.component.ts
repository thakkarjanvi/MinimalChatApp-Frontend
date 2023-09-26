import { Component, OnInit } from '@angular/core';
import { LogService } from 'src/app/services/log.service';
@Component({
  selector: 'app-requestlogging',
  templateUrl: './requestlogging.component.html',
  styleUrls: ['./requestlogging.component.css']
})
export class RequestloggingComponent implements OnInit {

  logs: any[] = [];
  startTime?: Date;
  endTime?: Date;

  constructor(private logService : LogService)  {}

  ngOnInit(): void {
}


}
