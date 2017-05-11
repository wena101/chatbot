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
	
  messages: ChatMessage[] = [ 
  {fromMe : false, text : "Dobrý den, co si dáte?"}, 
  {fromMe : true, text : "Já bych si dal Texas burger a colu."},
  {fromMe : false, text : "ble"},
  {fromMe : true, text : "děkuji, nashledanou"}  ];

  constructor(private conversationService: ConversationService) { }

  ngOnInit() {
	  this.conversationService.getWatsonResponse("bla").subscribe(res => { 
		//console.log('resp test: \n' + res);
		console.log(res);
		this.messages[2].text = res.output.text
	  });
  }

}
