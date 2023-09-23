export class Message {
  id: string;
  senderId: any;
  receiverId: number;
  content: string;
  timestamp: Date;

  constructor(id: string, senderid: any, receiverid: number, content: string, timestamp: Date) {
    this.id = id;
    this.senderId = senderid;
    this.receiverId = receiverid;
    this.content = content;
    this.timestamp = timestamp;
    
  }
} 
