import { Component, OnInit } from '@angular/core';
import { ChatMessage } from '../chat-message';
import { ConversationService } from '../services/conversation.service';
import { MenuDataService } from '../services/menu-data.service';
import { ShoppingCartService } from '../services/shopping-cart.service';
import 'rxjs/Rx';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css'],
  providers: [ConversationService, MenuDataService, ShoppingCartService]
})


export class ChatWindowComponent implements OnInit {
	
  messages: Array<ChatMessage> = [  {fromMe : false, text : "Dobrý den, co si dáte?" } ];
  draft : ChatMessage = { fromMe : true, text : "" };

  constructor(private conversationService: ConversationService, private menuDataService: MenuDataService) { }

  ngOnInit() {}
  
  onEnter(event: any): void {
    this.sendMessage();
    event.preventDefault();
  }
  
  sendMessage(): void {
	 this.messages.push(this.draft);
	 this.conversationService.getWatsonResponse(this.draft.text).subscribe(res => {
		 this.menuDataService.evaluateMessage(res).subscribe(msg => this.messages.push(msg));
		//this.menuDataService.evaluateList(res.output.text[0]).subscribe(parsedReply =>
		//{ this.messages.push( { fromMe : false, text : parsedReply }) });
	  });
	 this.draft = { fromMe : true, text : "" };
  }
  
}
