import {TuiIcons, TuiRoot} from "@taiga-ui/core";
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TuiRoot],
  providers: [
    TuiIcons
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
