import { Component, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidatorsDirective } from 'src/app/shared/directives/custom-validators.directive';

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
    accInterest: number;
    accPrincipal: number;
    date: string;
  }[]>();
  @Output() scheduleChanged = new EventEmitter<boolean>();

  public mortgageForm: FormGroup;
  public lifetimePayment = '0';
  public monthlyPayment = '0';

  constructor(private formBuilder: FormBuilder, private customValidator: CustomValidatorsDirective) {
    this.mortgageForm = this.formBuilder.group({
      price: ['300,000', [Validators.required, Validators.min(1)]],
      downPayment: ['100,000', [Validators.required, Validators.min(1)]],
      interest: [5, [Validators.max(20), Validators.required]],
      term: [30, [Validators.max(30), Validators.required]],
      propertyTax: [(this.simpleMode ? '0' : '150')],
      insurance: [(this.simpleMode ? '0' : '300')],
    }, { validators: this.customValidator.isGreaterValidator('price', 'downPayment', 'paymentIsGreater') });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.getMonthlyCalculate();
      this.getAmortizationSchedule();
    }, 1000);
  }

  public formatValue(event: Event, property: string) {
    const value = (event.target as HTMLTextAreaElement).value;
    if (!value) {
      return;
    }
    let myString = value.toString().replace(/\D/g, '');
    myString = myString.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    this.mortgageForm.patchValue({ [property]: myString });
    this.getMonthlyCalculate();
  }

  public getMonthlyCalculate() {
    if (!this.mortgageForm.valid) {
      return;
    }
    const { price, downPayment, interest, term, propertyTax, insurance } = this.mortgageForm.value;
    const numPrice = Number(price.toString().replace(/\,/g, ''));
    const numDownPayment = Number(downPayment.toString().replace(/\,/g, ''));
    const r = this.monthlyPayCalculate(
      (numPrice - numDownPayment), interest, term, propertyTax,
      insurance, this.payPerYear, this.simpleMode
    );
    if (!r) {
      return;
    }
    this.monthlyPayment = r.monthAllPayment;
    this.lifetimePayment = r.lifetimeTotal;
    this.formValue.emit({
      totalMonth: Number(r.monthPayment),
      interest: Number(r.monthInterest),
      tax: Number(r.monthTax),
      insurance: Number(r.monthInsurance)
    });
    this.scheduleChanged.emit(true);
  }

  public getAmortizationSchedule() {
    const { price, downPayment, interest, term, propertyTax, insurance } = this.mortgageForm.value;
    const numPrice = Number(price.toString().replace(/\,/g, ''));
    const numDownPayment = Number(downPayment.toString().replace(/\,/g, ''));
    const r = this.monthlyPayCalculate(
      (numPrice - numDownPayment), interest, term, propertyTax,
      insurance, this.payPerYear, this.simpleMode
    );

    const numberOfPayments = this.payPerYear * term;

    const date = new Date();
    let report = {
      payment: r.monthPayment,
      principal: r.monthPrincipal,
      interest: r.monthInterest,
      balance: r.monthBalance,
      accInterest: r.monthInterest,
      accPrincipal: r.monthPrincipal,
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
      const accPrincipal = report.accPrincipal + principal;
      const accInterest = report.accInterest + int;
      date.setMonth(date.getMonth() + 1);

      report = {
        ...report,
        ...{
          payment,
          principal,
          interest: int,
          balance,
          accInterest,
          accPrincipal,
          date: date.toLocaleDateString()
        }
      };
      amortization.push(report);
    }
    this.amortizationSchedule.emit(amortization);
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
}
