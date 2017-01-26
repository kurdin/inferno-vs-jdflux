import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { Names } from './names.component';

@NgModule({
  imports: [
    BrowserModule
  ],
  declarations: [
    Names
  ],
  bootstrap: [ Names ]
})

export class NamesModule { }