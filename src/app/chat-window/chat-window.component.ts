import { Component, OnInit } from '@angular/core';
import { ChatMessage } from '../chat-message';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})


export class ChatWindowComponent implements OnInit {
	
  messages: ChatMessage[] = [ 
  {fromMe : false, text : "Dobrý den, co si dáte?"}, 
  {fromMe : true, text : "Já bych si dal Texas burger a colu."},
  {fromMe : false, text : "Hned to bude"},
  {fromMe : true, text : "děkuji, nashledanou"}  ];

  constructor() { }

  ngOnInit() {
	  
  }

}
