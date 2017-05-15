import { Component, OnInit, Input } from '@angular/core';
import { IMenuItem } from '../imenu-item';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css']
})
export class MenuItemComponent implements OnInit {

	@Input() item: IMenuItem;

	constructor() { }
	ngOnInit() { }

}
