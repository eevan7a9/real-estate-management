import { Component, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-mortgage-core-calc',
  templateUrl: './mortgage-core-calc.component.html',
  styleUrls: ['./mortgage-core-calc.component.scss']
})
export class MortgageCoreCalcComponent implements AfterViewInit {
  @Input() payPerYear = 12;
  @Input() boxShadow = true;
  @Input() simpleMode = false;
  @Output() formValue = new EventEmitter<{
    totalMonth: number;
    interest: number;
    tax: number;
    insurance: number;
  }>();

  public mortgageForm: FormGroup;
  public lifetimePayment = '0';
  public monthlyPayment = '0';

  constructor(
    private formBuilder: FormBuilder
  ) {
    this.mortgageForm = this.formBuilder.group({
      price: ['300,000', [Validators.required]],
      downPayment: ['100,000', [Validators.required]],
      interest: [5, [Validators.required, Validators.pattern('^[0-9]*$')]],
      term: [30, [Validators.required, Validators.pattern('^[0-9]*$')]],
      propertyTax: [(this.simpleMode ? '0' : '180')],
      insurance: [(this.simpleMode ? '0' : '250')],
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.monthlyPayCalculate();
    }, 1000);
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
    const { term, propertyTax, insurance } = this.mortgageForm.value;
    const payPerTotal = term * this.payPerYear;
    let { price, downPayment, interest } = this.mortgageForm.value;

    if (!price || !downPayment) {
      return;
    }

    price = Number(price.toString().replace(/\,/g, ''));
    downPayment = Number(downPayment.toString().replace(/\,/g, ''));
    interest = interest / 100;

    const topA = (price - downPayment) * (interest / this.payPerYear);
    const topB = Math.pow(1 + (interest / this.payPerYear), payPerTotal);
    const bottom = Math.pow(1 + (interest / this.payPerYear), payPerTotal) - 1;
    const top = topA * topB;
    let total = Math.round(top / bottom);
    if (!this.simpleMode) {
      console.log('calculate', total);
      total = propertyTax ? total + Number(propertyTax) : total;
      console.log(total);
      total = insurance ? total + Number(insurance) : total;
      console.log(total);
    }
    this.monthlyPayment = total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    this.lifetimePayment = (total * payPerTotal).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    this.formValue.emit({
      totalMonth: total,
      interest: topA,
      tax: propertyTax,
      insurance
    });
  }
}
