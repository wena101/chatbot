import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { Http, Response, Headers, JsonpModule } from '@angular/http';
import { Item } from '../item';

@Injectable()
export class MenuDataService {

	private readonly  endpoint : string = 'http://localhost:3000/';
	headers = new Headers({'Content-Type': 'application/json'});

	constructor(protected http: Http) { }

	listItems(path: string) : Observable<{ [name: string]: Item; } >
	{
		return this.http.get(this.endpoint + path, {headers: this.headers}).map(res => res.json()).share();
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
}