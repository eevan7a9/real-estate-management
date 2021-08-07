import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-search',
  templateUrl: './modal-search.component.html',
  styleUrls: ['./modal-search.component.scss'],
})
export class ModalSearchComponent implements OnInit {

  @Input() title = 'Search';
  @Input() placeholder = 'Search...';
  @Input() items = [];
  @Input() displayProperty = null;

  public searchField = '';
  public itemsDisplayed = [];

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    this.itemsDisplayed = this.items;
  }

  close() {
    this.modalCtrl.dismiss();
  }

  selected(data: any) {
    this.modalCtrl.dismiss(data);
  }

  searching(event) {
    console.log(event);
    const results = [];
    this.items.forEach(item => {
      const found = (this.displayProperty ? item[this.displayProperty] : item).toLowerCase().indexOf(event) > -1;
      if (found) {
        results.push(item);
      }
    });
    this.itemsDisplayed = results;
  }
}
