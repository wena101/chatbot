import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { Http, Response, Headers, JsonpModule } from '@angular/http';
import 'rxjs/add/observable/of'
//var Conversation = require('watson-developer-cloud/conversation/v1');

@Injectable()
export class ConversationService {


	private context = null;
	private mock = false;
	private readonly  endpoint : string = 'http://localhost:3000/watson/message';
	headers = new Headers({'Content-Type': 'application/json'});
  
  constructor(protected http: Http) { }

  getWatsonResponse(text: string) : Observable<any> {
	  
	  var data = {
		context: this.context || {},
		input: text == null ? {} : {
			text : text
		}
	  };
	  if(this.mock)
	  {
		  return Observable.of( { 
		  intents: [{intent: "order_item", confidence : 0.578}, {intent: "hello", confidence : 0.25}], 
		  entities: [ { entity : "polozka_mnozstvi", value : "2" }, { entity : "polozka", value : "texas_m" }, 
		  { entity : "polozka_mnozstvi", value : "3" },{ entity : "polozka_mnozstvi", value : "5" },
		  { entity : "polozka", value : "houby" }, { entity : "polozka", value : "houby" } ],
		  output : { text : ['OBjenavam !order (mocked from conversation.service.ts)'] }}).share();
	  }
	  else return this.http.post(this.endpoint, JSON.stringify(data), {headers: this.headers}).map(res => res.json()).share();	 
  }
}
