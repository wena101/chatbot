import { Injectable } from '@angular/core';
import { IMenuItem } from '../imenu-item';

@Injectable()
export class ShoppingCartService {
	
	cart : Array<IMenuItem> = [];

  constructor() { }
	
	addItem(item: IMenuItem) {
		this.cart.push(item);
	}
	
	getTotal() : number {
		return this.cart.map(i => i.cena).reduce((c1, c2) => {return c1 + c2;}, 0); 
	}
}
