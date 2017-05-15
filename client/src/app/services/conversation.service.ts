import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { Http, Response, Headers, JsonpModule } from '@angular/http';
import 'rxjs/add/observable/of'
//var Conversation = require('watson-developer-cloud/conversation/v1');

@Injectable()
export class ConversationService {

 // var conversation;

//	private conversation = new Conversation({
	  // If unspecified here, the CONVERSATION_USERNAME and CONVERSATION_PASSWORD env properties will be checked
	  // After that, the SDK will fall back to the bluemix-provided VCAP_SERVICES environment property
//	  username: 'eb0e75c5-d9f2-4c30-81c2-daaa1692ce68',
//	  password: 'PNuBy1Vc2lrj',
//	  url: 'https://gateway.watsonplatform.net/conversation/api',
//	  version_date: '2016-10-21',
//	  version: 'v1'
//	});
	private context = null;
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
	  return Observable.of( { intents: [{intent: "item_query", confidence : 0.578}, {intent: "hello", confidence : 0.25}], output : { text : ['Chcete !show:texas_m (mocked from conversation.service.ts)'] }}).share();
	  //return this.http.post(this.endpoint, JSON.stringify(data), {headers: this.headers}).map(res => res.json()).share();	 
  }
}
