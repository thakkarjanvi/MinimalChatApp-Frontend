export interface Message {
  messageId: number;
  id: number;
  senderId: any;
  receiverId: number;
  content: string;
  timestamp: Date;
  showReplyButton: boolean;
  isReplyMessage: boolean;
}
