import { Component, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-mortgage-calc',
  templateUrl: './mortgage-calc.page.html',
  styleUrls: ['./mortgage-calc.page.css'],
  standalone: false
})
export class MortgageCalcPage {
  private readonly queryParamMap = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap
  });

  public readonly price = computed(() => {
    const value = this.queryParamMap().get('price');
    if (!value || !/^\d+$/.test(value)) {
      return undefined;
    }

    const price = Number(value);
    return Number.isSafeInteger(price) && price > 0 ? price : undefined;
  });

  constructor(private readonly route: ActivatedRoute) {}
}
