import { Component, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-mortgage-core-calc',
  templateUrl: './mortgage-core-calc.component.html',
  styleUrls: ['./mortgage-core-calc.component.scss']
})
export class MortgageCoreCalcComponent implements AfterViewInit {
  @Input() payPerYear = 12;
  @Input() simpleMode = false;
  @Input() boxShadow = true;
  @Output() formValue = new EventEmitter<{
    totalMonth: number;
    interest: number;
    tax: number;
    insurance: number;
  }>();
  @Output() amortizationSchedule = new EventEmitter<{
    payment: number;
    principal: number;
    interest: number;
    balance: number;
    date: string;
  }[]>();

  public mortgageForm: FormGroup;
  public lifetimePayment = '0';
  public monthlyPayment = '0';

  constructor(
    private formBuilder: FormBuilder
  ) {
    this.mortgageForm = this.formBuilder.group({
      price: [300000, [Validators.required]],
      downPayment: ['100,000', [Validators.required]],
      interest: [5, [Validators.required, Validators.pattern('^[0-9]*$')]],
      term: [30, [Validators.required, Validators.pattern('^[0-9]*$')]],
      propertyTax: [(this.simpleMode ? '0' : '180')],
      insurance: [(this.simpleMode ? '0' : '250')],
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.getMonthlyCalculate();
      this.getLifeTime();
    }, 1000);
  }

  public formatValue(value = 0, property: string) {
    if (!value) {
      return;
    }
    let myString = value.toString().replace(/\D/g, '');
    myString = myString.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    this.mortgageForm.patchValue({ [property]: myString });
    this.getMonthlyCalculate();
  }

  public getMonthlyCalculate() {
    const { price, downPayment, interest, term, propertyTax, insurance } = this.mortgageForm.value;
    const numPrice = Number(price.toString().replace(/\,/g, ''));
    const numDownPayment = Number(downPayment.toString().replace(/\,/g, ''));
    const r = this.monthlyPayCalculate(
      (numPrice - numDownPayment), interest, term, propertyTax,
      insurance, this.payPerYear, this.simpleMode
    );
    this.monthlyPayment = r.monthAllPayment;
    this.lifetimePayment = r.lifetimeTotal;
    this.formValue.emit({
      totalMonth: Number(r.monthPayment),
      interest: Number(r.monthInterest),
      tax: Number(r.monthTax),
      insurance: Number(r.monthInsurance)
    });
  }

  private monthlyPayCalculate(
    price: number,
    interest: number,
    term: number,
    propertyTax: string,
    insurance: string,
    payPerYear = 12,
    simpleMode = true
  ) {
    const payPerTotal = term * payPerYear;
    if (!price) {
      return;
    }
    interest = interest / 100;
    const monthInterest = price * (interest / payPerYear);
    const topB = Math.pow(1 + (interest / payPerYear), payPerTotal);
    const bottom = Math.pow(1 + (interest / payPerYear), payPerTotal) - 1;
    const top = monthInterest * topB;
    const monthPayment = Number(Math.floor((top / bottom)).toFixed(4));
    let total = Math.round(top / bottom);
    if (!simpleMode) {
      total = propertyTax ? total + Number(propertyTax) : total;
      total = insurance ? total + Number(insurance) : total;
    }
    return {
      monthPayment,
      monthAllPayment: total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      monthInterest,
      monthTax: propertyTax,
      monthInsurance: insurance,
      monthPrincipal: (monthPayment - monthInterest),
      monthBalance: price - (monthPayment - monthInterest),
      lifetimeTotal: (total * payPerTotal).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    };
  }

  private getLifeTime() {
    const { price, downPayment, interest, term, propertyTax, insurance } = this.mortgageForm.value;
    const numPrice = Number(price.toString().replace(/\,/g, ''));
    const numDownPayment = Number(downPayment.toString().replace(/\,/g, ''));
    const r = this.monthlyPayCalculate(
      (numPrice - numDownPayment), interest, term, propertyTax,
      insurance, this.payPerYear, this.simpleMode
    );

    const numberOfPayments = this.payPerYear * term;
    const monthPayment = r.monthPayment;
    const monthPrincipal = r.monthPrincipal;
    const monthBalance = r.monthBalance;
    const monthInterest = r.monthInterest;

    const date = new Date();
    let report = {
      payment: monthPayment,
      principal: monthPrincipal,
      interest: monthInterest,
      balance: monthBalance,
      date: date.toLocaleDateString()
    };
    const amortization = [report];
    for (let i = 0; i < numberOfPayments; i++) {
      const isLast = i === numberOfPayments - 1;
      const payment = isLast ?
        report.payment + (report.balance - report.principal) : report.payment;
      const balance = isLast ?
        0 : Number((Number(report.balance.toFixed(2)) - Number(report.principal.toFixed(2))).toFixed(2));
      const int = Number((Number(report.balance.toFixed(2)) * ((interest / 100) / this.payPerYear)).toFixed(2));
      const principal = Number((Number(report.payment.toFixed(2)) - int).toFixed(2));

      date.setMonth(date.getMonth() + 1);

      report = {
        ...report,
        ...{
          payment,
          principal,
          balance,
          interest: int,
          date: date.toLocaleDateString()
        }
      };
      amortization.push(report);
    }
    this.amortizationSchedule.emit(amortization);
    console.log(amortization);
  }
}
