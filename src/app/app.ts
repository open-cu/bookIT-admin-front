import {TuiIcons, TuiRoot} from "@taiga-ui/core";
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {DatePipe} from '@angular/common';
import {provideAppInjector} from './core/providers/injector.provider';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TuiRoot],
  providers: [
    TuiIcons,
    DatePipe
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor() {
    provideAppInjector();
  }
}
