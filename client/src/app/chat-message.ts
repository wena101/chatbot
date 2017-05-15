import { IMenuItem } from './imenu-item';

export interface ChatMessage {
	fromMe: Boolean;
	text: string;
	item?: IMenuItem;
}
