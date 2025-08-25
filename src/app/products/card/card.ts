import { CommonModule, SlicePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output, output } from '@angular/core';

@Component({
  selector: 'app-card',
  imports: [CommonModule, SlicePipe],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class Card {
  @Input() product: any;
  @Input() checkLoggedIn: boolean = false;

  @Output() editEvent = new EventEmitter<any>();
  @Output() deleteEvent = new EventEmitter<any>();
  @Output() showEvent = new EventEmitter<any>();

  onEditChild() {
    this.editEvent.emit(this.product);
  }

  onDeleteChild() {
    this.deleteEvent.emit(this.product);
  }

  onShowChild() {
    this.showEvent.emit(this.product);
  }
}
