import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { Http, Response, Headers, JsonpModule } from '@angular/http';
import { Item } from '../item';
import { IMenuItem } from '../imenu-item';
import { ChatMessage } from '../chat-message';

@Injectable()
export class MenuDataService {

	private readonly  endpoint : string = 'http://localhost:3000/';
	private readonly  itemsEndpoint : string = 'http://localhost:3000/items/';
	headers = new Headers({'Content-Type': 'application/json'});

	constructor(protected http: Http) { }

	listItems(path: string) : Observable<{ [name: string]: Item; } >
	{
		return this.http.get(this.endpoint + path, {headers: this.headers}).map(res => res.json()).share();
	}
	
	evaluateMessage(res: any) : Observable<ChatMessage>
	{
		const intent = res.intents.reduce(function(prev, current) { return (prev.confidence > current.confidence) ? prev : current});
		console.log('max intent: ' + JSON.stringify(intent));
		console.log(res.output.text[0]);
		switch(intent.intent)
		{
			case 'item_query': {
				return this.evaluateItem(res.output.text[0]).map(item => { 
					return {fromMe : false, text : 'Podarilo se mi najit:', item : item}; 
				});
			 }
			 case 'menu_query': {
				 return this.evaluateList(res.output.text[0]).map(parsedReply => { return {fromMe : false, text : parsedReply}; } );
			 }
		}
		 
		return Observable.of({fromMe : false, text : "code flow error" });
	}
	
	evaluateList(watsonResp: string) : Observable<string>
	{
		var regexp = new RegExp(String.raw`!list:([\w/]+)`);
		if(regexp.test(watsonResp))
		{
			var match = regexp.exec(watsonResp);
			return this.listItems(match[1]).map(res_list => { 
				var list = '';
				for (var key in res_list) {
					 list += res_list[key].fullName + ', ';
				}
				list = list.slice(0, -2).replace(/,(?=[^,]*$)/, ' a');
				return watsonResp.replace(regexp, list);
			});
		}
		else return Observable.of(watsonResp);
	}
	
	evaluateItem(watsonResp: string)  : Observable<IMenuItem>
	{
		var regexp = new RegExp(String.raw`!show:([\w/]+)`);
		if(regexp.test(watsonResp))
		{
			var match = regexp.exec(watsonResp);
			return this.http.get(this.itemsEndpoint + match[1], {headers: this.headers}).map(res => res.json()).share();
		}
		else return Observable.of(null);
	}
	
}