import { Component } from '@angular/core';

import { TriggersPage } from '../triggers/triggers';
import { SwitchesPage } from '../switches/switches';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = SwitchesPage;
  tab2Root = TriggersPage;

  constructor() {

  }
}
