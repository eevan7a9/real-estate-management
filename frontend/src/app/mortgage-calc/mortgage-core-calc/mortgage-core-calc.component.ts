import { Component, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-mortgage-core-calc',
  templateUrl: './mortgage-core-calc.component.html',
  styleUrls: ['./mortgage-core-calc.component.scss']
})
export class MortgageCoreCalcComponent implements AfterViewInit {

  public mortgageForm: FormGroup;
  public monthlyPayment = 0;
  public isReady = false;
  constructor(
    private formBuilder: FormBuilder
  ) {
    this.mortgageForm = this.formBuilder.group({
      price: ['300,000', [Validators.required]],
      downPayment: ['100,000', [Validators.required]],
      interest: [5, [Validators.required, Validators.pattern('^[0-9]*$')]],
      term: [30, [Validators.required, Validators.pattern('^[0-9]*$')]],
    });
  }

  ngAfterViewInit() {
    this.isReady = true;
  }

  public formatValue(value = 0, property: string) {
    if (!value) {
      return;
    }
    let myString = value.toString().replace(/\D/g, '');
    myString = myString.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    console.log(myString);
    this.mortgageForm.patchValue({ [property]: myString });
  }

}
