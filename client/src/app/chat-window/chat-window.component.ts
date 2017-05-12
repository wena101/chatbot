import { Component, OnInit } from '@angular/core';
import { ChatMessage } from '../chat-message';
import { ConversationService } from '../services/conversation.service';
import 'rxjs/Rx';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css'],
  providers: [ConversationService]
})


export class ChatWindowComponent implements OnInit {
	
  messages: Array<ChatMessage> = [ 
  {fromMe : false, text : "Dobrý den, co si dáte?"} ];
  
  draft : ChatMessage = { fromMe : true, text : "" };

  constructor(private conversationService: ConversationService) { }

  ngOnInit() {
  }
  
  onEnter(event: any): void {
    this.sendMessage();
    event.preventDefault();
  }
  
  sendMessage(): void {
	 this.messages.push(this.draft);
	 this.conversationService.getWatsonResponse(this.draft.text).subscribe(res => {
		console.log(res);
		this.messages.push({ fromMe : false, text : res.output.text });
	  });
	 this.draft = { fromMe : true, text : "" };
  }
  
}
