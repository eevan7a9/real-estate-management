import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Property } from 'src/app/shared/interface/property';
import { PropertiesService } from '../properties.service';
import { properties } from '../../shared/dummy-data';
@Component({
  selector: 'app-properties-list',
  templateUrl: './properties-list.component.html',
  styleUrls: ['./properties-list.component.scss'],
})
export class PropertiesListComponent implements OnInit {
  @Input() singleCol = false;
  public properties: Property[];

  constructor(
    private propertiesService: PropertiesService,
    private router: Router
  ) { }

  ngOnInit() {
    this.propertiesService.properties$.subscribe(v => {
      this.properties = v;
    });
  }

  public selectProperty(property: Property) {
    this.propertiesService.property = property;
    this.router.navigate(['/properties', property.id]);
  }
}
