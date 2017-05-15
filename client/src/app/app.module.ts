import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { MenuItemComponent } from './menu-item/menu-item.component';
import { WelcomeComponent } from './welcome/welcome.component';
//import {Angular2AutoScroll} from "angular2-auto-scroll/lib/angular2-auto-scroll.directive";

@NgModule({
  declarations: [
    AppComponent,
    ChatWindowComponent,
    MenuItemComponent,
    WelcomeComponent,
	//Angular2AutoScroll
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]//,ChatWindowComponent
})
export class AppModule { }
