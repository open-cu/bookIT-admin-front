import { Component } from '@angular/core';
import {injectContext} from '@taiga-ui/polymorpheus';
import {TuiDialogContext} from '@taiga-ui/core';
import {DeletionConfig} from './deletion-config';

type DeletionContext = TuiDialogContext<boolean, DeletionConfig>;

@Component({
  selector: 'app-deletion-block',
  imports: [],
  templateUrl: './deletion-block.component.html',
  styleUrl: './deletion-block.component.css'
})
export class DeletionBlockComponent {
  public readonly context = injectContext<DeletionContext>();
}
