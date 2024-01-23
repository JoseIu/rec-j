import { Component, Input } from '@angular/core';

@Component({
  selector: 'recorder-button',
  standalone: true,
  imports: [],
  templateUrl: './recorder-button.component.html',
  styleUrl: './recorder-button.component.scss',
})
export class RecorderButtonComponent {
  @Input() public text?: string;
}
