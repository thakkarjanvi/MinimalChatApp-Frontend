export class Message {
  id: string;
  content: string;
  timestamp: Date;
  isSender: boolean; 

  constructor(id: string, content: string, timestamp: Date, isSender: boolean) {
    this.id = id;
    this.content = content;
    this.timestamp = timestamp;
    this.isSender = isSender;
  }
}
