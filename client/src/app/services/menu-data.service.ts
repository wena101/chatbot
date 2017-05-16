import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { Http, Response, Headers, JsonpModule } from '@angular/http';
import { Item } from '../item';
import { IMenuItem } from '../imenu-item';
import { ChatMessage } from '../chat-message';
import { ShoppingCartService } from './shopping-cart.service';

@Injectable()
export class MenuDataService {

	private readonly  endpoint : string = 'http://localhost:3000/';
	private readonly  itemsEndpoint : string = 'http://localhost:3000/items/';
	headers = new Headers({'Content-Type': 'application/json'});

	constructor(protected http: Http, protected cart: ShoppingCartService) { }

	listItems(path: string) : Observable<{ [name: string]: Item; } >
	{
		return this.http.get(this.endpoint + path, {headers: this.headers}).map(res => res.json()).share();
	}
	
	evaluateMessage(res: any) : Observable<ChatMessage>
	{
		const intent = res.intents.reduce(function(prev, current) { return (prev.confidence > current.confidence) ? prev : current});
		console.log('max intent: ' + JSON.stringify(intent));
		console.log(res.output.text[0]);
		let text = res.output.text[0];
		switch(intent.intent)
		{
			case 'item_query': {
				let regexp = new RegExp(String.raw`!show:([\w/]+)`);
				if(regexp.test(text))
				{
					let match = regexp.exec(text);
					return this.evaluateItem(match[1]).map(item => { 
						return {fromMe : false, text : 'Podarilo se mi najit:', item : item}; 
					});
				}
				else return Observable.of({fromMe : false, text : 'Polozku se nepodarilo najit', item : null} );				
			 }
			 case 'menu_query': {
				 return this.evaluateList(res.output.text[0]).map(parsedReply => { return {fromMe : false, text : parsedReply}; } );
			 }
			 case 'finish_order': {
				 return Observable.of({fromMe : false, 
				 text : text.replace(/(!total)/, this.cart.getTotal())});
			 }
			 case 'order_item': {
				 let quantity : number = 1;
				 let ordered : string[] = [];
				 let queries : Observable<void>[] = [];
				 for (let entity of res.entities)
				 {
					 if(entity.entity == 'polozka')
					 {
						 const iq = quantity;
						queries.push(
							this.evaluateItem(entity.value).map(item => {
								if(item != null)
								{
									for(let i : number = iq; i > 0; i--) 
										this.cart.addItem(item);
								}
								ordered.push(iq + 'x ' + item.fullName);
							})
						);
						quantity = 1;
					 }
					 else if(entity.entity == 'polozka_mnozstvi') quantity = entity.value;
				 }
				 return Observable.forkJoin(queries, (data: any[]) => { 
					var regexp = new RegExp(String.raw`!order:([\w/]+)`);
					var match = regexp.exec(text);
					let order_list : string = ordered.join(', ').replace(/,(?=[^,]*$)/, ' a');
					console.log(order_list);
					return {fromMe : false,  text : text.replace(/(!order)/, order_list) }; 
				 });
				 //return this.evaluateList(res.output.text[0]).map(parsedReply => { return {fromMe : false, text : parsedReply}; } );
			 }
		}
		 
		return Observable.of({fromMe : false, text : "Omlouvám se, nerozumím. Formulujte Váš dotaz jinak." });
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
	
	evaluateItem(itemName: string)  : Observable<IMenuItem>
	{
		return this.http.get(this.itemsEndpoint + itemName, {headers: this.headers}).map(res => res.json()).share();
	}
	
}
