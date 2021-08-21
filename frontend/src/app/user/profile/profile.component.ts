import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

  public imgUrl: any = './assets/images/avatar.png';
  constructor() { }

  ngOnInit() { }

  public toggleUpload() {
    const input = document.getElementById('image-upload');
    input.click();
  }

  public onSelectFile(event) { // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (ev) => { // called once readAsDataURL is completed
        this.imgUrl = ev.target.result;
        console.log(this.imgUrl);
      };
    }
  }
}
