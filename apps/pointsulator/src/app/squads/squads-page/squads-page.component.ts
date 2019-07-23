import { Component, OnInit } from '@angular/core';
import { ManagersApiService } from '../../managers/managers-api.service';
import { ManagerDTO } from '@pointsulator/api-interface';
import { sumBy } from 'lodash';

interface ManagerEx extends ManagerDTO {
  cashRemaining: number;
}

// TODO: Store this on the server and make it configurable.
const MAX_CASH = 50;

@Component({
  selector: 'pt-squads-page',
  templateUrl: './squads-page.component.html',
  styleUrls: ['./squads-page.component.scss']
})
export class SquadsPageComponent implements OnInit {
  managers: ManagerEx[];

  constructor(private readonly managersApi: ManagersApiService) {
    this.managersApi.loadAll().subscribe(managers => {
      this.managers = managers.map(m => ({
        ...m,
        cashRemaining: MAX_CASH - sumBy(m.squad, a => a.price)
      }));
    });
  }

  ngOnInit() {}
}
