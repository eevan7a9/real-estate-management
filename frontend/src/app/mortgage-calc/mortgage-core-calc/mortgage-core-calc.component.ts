import { Component, AfterViewInit, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { debounceTime, takeUntil } from 'rxjs';
import { CustomValidators } from 'src/app/shared/validators/custom.validator';

@Component({
  selector: 'app-mortgage-core-calc',
  templateUrl: './mortgage-core-calc.component.html',
  styleUrls: ['./mortgage-core-calc.component.css'],
  standalone: false
})
export class MortgageCoreCalcComponent implements AfterViewInit {
  public payPerYear = input<number>(12);
  public simpleMode = input<boolean>(false);
  public boxShadow = input<boolean>(true);

  public onCalculateMonthly = output<{
    totalMonth: number;
    interest: number;
    tax: number;
    insurance: number;
  }>();

  public onCalculateAmortization = output<{
    payment: number;
    principal: number;
    interest: number;
    balance: number;
    accInterest: number;
    accPrincipal: number;
    date: string;
  }[]>();

  public scheduleChanged = output<boolean>();

  public mortgageForm: UntypedFormGroup;
  public lifetimePayment = signal('0');
  public monthlyPayment = signal('0');

  constructor(private formBuilder: UntypedFormBuilder, private toastCtrl: ToastController) {
    this.mortgageForm = this.formBuilder.group({
      price: ['300,000', [Validators.required, Validators.min(1)]],
      downPayment: ['100,000', [Validators.required, Validators.min(1)]],
      interest: [5, [Validators.max(99), Validators.required]],
      term: [30, [Validators.max(50), Validators.required]],
      propertyTax: [(this.simpleMode() ? '0' : '150')],
      insurance: [(this.simpleMode() ? '0' : '300')],
    }, { validators: CustomValidators.isGreaterValidator('price', 'downPayment', 'paymentIsGreater') });

    this.mortgageForm.valueChanges
      .pipe(
        debounceTime(500),
        takeUntilDestroyed()
      )
      .subscribe(() => {
        if (this.mortgageForm.valid) {
          this.calculateMonthly();
          this.calculateAmortizationSchedule();
        } else {
          this.toastCtrl.create({
            message: 'Please make sure all fields are filled correctly.',
            duration: 5000,
            color: 'danger'
          }).then(toast => toast.present());
        }
      });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.calculateMonthly();
      this.calculateAmortizationSchedule();
    }, 1000);


  }

  public formatValue(event: CustomEvent, property: string): void {
    const value = event.detail.value ?? '';

    const formatted = value
      .replace(/\D/g, '')
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    this.mortgageForm.patchValue(
      { [property]: formatted },
      { emitEvent: false }
    );

    console.log('mortageForm value after formatting:', this.mortgageForm.value);
  }

  public calculateAmortizationSchedule(): void {
    const {
      price,
      downPayment,
      interest,
      term,
      propertyTax,
      insurance
    } = this.mortgageForm.value;

    const homePrice = Number(price.toString().replace(/,/g, ''));
    const down = Number(downPayment.toString().replace(/,/g, ''));

    const loanAmount = homePrice - down;
    const paymentsPerYear = this.payPerYear();
    const totalPayments = paymentsPerYear * term;
    const ratePerPayment = (interest / 100) / paymentsPerYear;

    const result = this.monthlyPayCalculate(
      loanAmount,
      interest,
      term,
      propertyTax,
      insurance,
      paymentsPerYear,
      this.simpleMode()
    );

    // Principal + Interest payment only
    const regularPayment = result.monthPrincipal + result.monthInterest;

    let balance = loanAmount;
    let accPrincipal = 0;
    let accInterest = 0;

    const date = new Date();

    const amortization = [];

    for (let i = 0; i < totalPayments && balance > 0; i++) {

      const interestPaid = balance * ratePerPayment;

      let principalPaid = regularPayment - interestPaid;
      let payment = regularPayment;

      // Last payment adjustment
      if (principalPaid > balance) {
        principalPaid = balance;
        payment = principalPaid + interestPaid;
      }

      balance -= principalPaid;

      // Avoid tiny floating point leftovers
      if (Math.abs(balance) < 0.005) {
        balance = 0;
      }

      accPrincipal += principalPaid;
      accInterest += interestPaid;

      amortization.push({
        payment: Number(payment.toFixed(2)),
        principal: Number(principalPaid.toFixed(2)),
        interest: Number(interestPaid.toFixed(2)),
        balance: Number(balance.toFixed(2)),
        accPrincipal: Number(accPrincipal.toFixed(2)),
        accInterest: Number(accInterest.toFixed(2)),
        date: date.toLocaleDateString()
      });

      // Only correct for monthly payments.
      // If we later support biweekly/weekly, adjust this.
      date.setMonth(date.getMonth() + 1);
    }

    this.onCalculateAmortization.emit(amortization);
  }



  public calculateMonthly(): void {
    if (!this.mortgageForm.valid) {
      console.log('Form is invalid', this.mortgageForm.errors);
      return;
    }

    console.log('Form is valid', this.mortgageForm.value);

    const {
      price,
      downPayment,
      interest,
      term,
      propertyTax,
      insurance
    } = this.mortgageForm.value;

    const homePrice = Number(price.toString().replace(/,/g, ''));
    const downPaymentAmount = Number(downPayment.toString().replace(/,/g, ''));
    const loanAmount = homePrice - downPaymentAmount;

    const result = this.monthlyPayCalculate(
      loanAmount,
      interest,
      term,
      propertyTax,
      insurance,
      this.payPerYear(),
      this.simpleMode()
    );

    console.log('Monthly calculation result:', result);

    if (!result) {
      return;
    }

    this.monthlyPayment.set(result.monthAllPayment);
    this.lifetimePayment.set(result.lifetimeTotal);

    this.onCalculateMonthly.emit({
      totalMonth: result.monthPayment,
      interest: result.monthInterest,
      tax: Number(result.monthTax.toString().replace(/,/g, '')),
      insurance: Number(result.monthInsurance.toString().replace(/,/g, ''))
    });

    this.scheduleChanged.emit(true);
  }

  private monthlyPayCalculate(
    loanAmount: number,
    interest: number,
    term: number,
    propertyTax: string,
    insurance: string,
    payPerYear = 12,
    simpleMode = true
  ) {
    if (!loanAmount) return;

    const totalPayments = term * payPerYear;
    const rate = (interest / 100) / payPerYear;

    const tax = Number(propertyTax.toString().replace(/,/g, '') || 0);
    const ins = Number(insurance.toString().replace(/,/g, '') || 0);

    // Handle 0% interest loans
    if (rate === 0) {
      const payment = loanAmount / totalPayments;
      const totalPayment = payment + (simpleMode ? 0 : tax + ins);

      return {
        monthPayment: Number(payment.toFixed(2)),
        monthAllPayment: Number(totalPayment.toFixed(2)).toLocaleString(),

        monthInterest: 0,
        monthPrincipal: Number(payment.toFixed(2)),
        monthBalance: Number((loanAmount - payment).toFixed(2)),

        monthTax: propertyTax,
        monthInsurance: insurance,

        lifetimeTotal: Number((totalPayment * totalPayments).toFixed(2)).toLocaleString()
      };
    }

    const payment =
      loanAmount *
      (rate * Math.pow(1 + rate, totalPayments)) /
      (Math.pow(1 + rate, totalPayments) - 1);

    const firstInterest = loanAmount * rate;
    const firstPrincipal = payment - firstInterest;
    const firstBalance = loanAmount - firstPrincipal;

    const totalPayment = payment + (simpleMode ? 0 : tax + ins);

    return {
      monthPayment: Number(payment.toFixed(2)),
      monthAllPayment: Number(totalPayment.toFixed(2)).toLocaleString(),

      monthInterest: Number(firstInterest.toFixed(2)),
      monthPrincipal: Number(firstPrincipal.toFixed(2)),
      monthBalance: Number(firstBalance.toFixed(2)),

      monthTax: propertyTax,
      monthInsurance: insurance,

      lifetimeTotal: Number((totalPayment * totalPayments).toFixed(2)).toLocaleString()
    };
  }
}
