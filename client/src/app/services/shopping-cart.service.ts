import { Injectable } from '@angular/core';
import { IMenuItem } from '../imenu-item';

@Injectable()
export class ShoppingCartService {
	
	cart : Array<IMenuItem> = [];

  constructor() { }
	
	addItem(item: IMenuItem) {
		this.cart.push(item);
	}
}
