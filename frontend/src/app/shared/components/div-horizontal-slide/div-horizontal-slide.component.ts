import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-div-horizontal-slide',
  templateUrl: './div-horizontal-slide.component.html',
  styleUrls: ['./div-horizontal-slide.component.scss'],
})
export class DivHorizontalSlideComponent {

  private mouseDown = false;
  private startX: any;
  private scrollLeft: any;

  startDragging(e, flag, el) {
    this.mouseDown = true;
    this.startX = e.pageX - el.offsetLeft;
    this.scrollLeft = el.scrollLeft;
  }
  stopDragging(e, flag) {
    this.mouseDown = false;
  }
  moveEvent(e, el) {
    e.preventDefault();
    if (!this.mouseDown) {
      return;
    }
    // console.log(e);
    const x = e.pageX - el.offsetLeft;
    const scroll = x - this.startX;
    el.scrollLeft = this.scrollLeft - scroll;
  }
}
