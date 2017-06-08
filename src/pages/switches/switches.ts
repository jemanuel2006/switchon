import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Switch } from './../../models/switch';

import { NewSwitchPage } from './../new-switch/new-switch'
import { ModalController } from 'ionic-angular';

import { SwitchService } from './../../services/switch-service';

@Component({
  selector: 'page-home',
  templateUrl: 'switches.html'
})
export class SwitchesPage {
  switches: Switch[];

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public swService: SwitchService) {
    this.switches = swService.getAllSwitches();
  }

  onSelectSwitch(sw){
    let modal = this.modalCtrl.create(NewSwitchPage, {selectedSwitch: sw});
    modal.present();
  }

  onSelectNewSwitch(){
    let modal = this.modalCtrl.create(NewSwitchPage);
    modal.onDidDismiss(data => {
      this.switches = this.swService.getAllSwitches();
    });

    modal.present();
  }

  onTurnOnSwitch(sw){
    this.swService.sendTurnOnCommand(sw).then(() => {
      this.switches = this.swService.getAllSwitches();
    });
  }

  onTurnOffSwitch(sw){
    this.swService.sendTurnOffCommand(sw).then(() =>{
      this.switches = this.swService.getAllSwitches();
    });
  }
}
