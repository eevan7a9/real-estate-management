import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Property } from 'src/app/shared/interface/property';
import { PropertiesService } from '../properties.service';

@Component({
  selector: 'app-properties-detail',
  templateUrl: './properties-detail.component.html',
  styleUrls: ['./properties-detail.component.scss'],
})
export class PropertiesDetailComponent implements OnInit {
  public property: Property | undefined;
  constructor(
    public location: Location,
    private router: Router,
    private propertiesService: PropertiesService
  ) { }

  async ngOnInit() {
    this.propertiesService.property$.subscribe(property => {
      this.property = property;
      if (!this.property) {
        this.router.navigate(['/properties']);
      }
    });
  }
}
