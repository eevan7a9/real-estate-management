import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-search',
  templateUrl: './modal-search.component.html',
  styleUrls: ['./modal-search.component.scss'],
})
export class ModalSearchComponent implements OnInit, AfterViewInit {

  @Input() title = 'Search';
  @Input() placeholder = 'Search...';
  @Input() items = [];
  @Input() displayProperty = null;
  @Input() searchFunction: (text: string) => Promise<[]>;
  @ViewChild('SearchField') searchField;

  public itemsDisplayed = [];
  public progress = false;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    this.itemsDisplayed = this.items;
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.searchField.setFocus();
    }, 2000);
  }

  close() {
    this.modalCtrl.dismiss();
  }

  selected(data: any) {
    this.modalCtrl.dismiss(data);
  }

  async searching(text: string) {
    this.itemsDisplayed = [];
    this.progress = true;
    if (this.searchFunction && text.length > 3) {
      this.itemsDisplayed = await this.searchFunction(text);
      this.progress = false;
    } else {
      const results = [];
      this.items.forEach(item => {
        const found = (this.displayProperty ? item[this.displayProperty] : item)
          .toLowerCase().indexOf(text.toLowerCase()) > -1;
        if (found) {
          results.push(item);
        }
      });
      setTimeout(() => {
        this.itemsDisplayed = results;
        this.progress = false;
      }, 1000);
    }

  }
}
