import { Component, AfterViewInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-mortgage-core-calc',
  templateUrl: './mortgage-core-calc.component.html',
  styleUrls: ['./mortgage-core-calc.component.scss']
})
export class MortgageCoreCalcComponent implements AfterViewInit {
  @Input() payPerYear = 12;

  public mortgageForm: FormGroup;
  public monthlyPayment = '0';
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
    this.monthlyPayCalculate();
  }

  public formatValue(value = 0, property: string) {
    if (!value) {
      return;
    }
    let myString = value.toString().replace(/\D/g, '');
    myString = myString.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    this.mortgageForm.patchValue({ [property]: myString });
    this.monthlyPayCalculate();
  }

  private monthlyPayCalculate() {
    const { term } = this.mortgageForm.value;
    const payPerTotal = term * this.payPerYear;
    let { price, downPayment, interest } = this.mortgageForm.value;

    price = Number(price.toString().replace(/\,/g, ''));
    downPayment = Number(downPayment.toString().replace(/\,/g, ''));
    interest = interest / 100;

    const topA = (price - downPayment) * (interest / this.payPerYear);
    const topB = Math.pow(1 + (interest / this.payPerYear), payPerTotal);
    const bottom = Math.pow(1 + (interest / this.payPerYear), payPerTotal) - 1;
    const top = topA * topB;
    const total = Math.round(top / bottom);

    this.monthlyPayment = total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}
