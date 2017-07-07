import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Switch } from './../../models/switch';

import { NewSwitchPage } from './../new-switch/new-switch'
import { ModalController } from 'ionic-angular';

import { SwitchService } from './../../services/switch-service';
import { LoadingController } from 'ionic-angular';

import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'switches.html'
})
export class SwitchesPage {
  switches: Switch[];

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public swService: SwitchService,
              public loadingCtrl: LoadingController, private alertCtrl: AlertController) {
  }

  ngOnInit() {
      let control = this.showLoading("Loading switches, please wait...");

      return this.swService.getAllSwitches().then((val) =>{
        this.switches = val;
        control.dismiss();
      });
  }
  onSelectSwitch(sw){
    let modal = this.modalCtrl.create(NewSwitchPage, {selectedSwitch: sw});
    modal.present();
  }

  onSelectNewSwitch(){
    let modal = this.modalCtrl.create(NewSwitchPage);
    modal.onDidDismiss(data => {
      this.swService.getAllSwitches().then((val) =>{
          this.switches = val;
      });
    });

    modal.present();
  }

  onTurnOnSwitch(sw){
    let control = this.showLoading("Sending command, please wait...");
    this.swService.sendTurnOnCommand(sw).then(() => {
      this.swService.getAllSwitches().then((val) =>{
          this.switches = val;
          control.dismiss();
      });
    });
  }

  onTurnOffSwitch(sw){
    let control = this.showLoading("Sending command, please wait...");
    this.swService.sendTurnOffCommand(sw).then(() =>{
      this.swService.getAllSwitches().then((val) =>{
          this.switches = val;
          control.dismiss();
      });
    });
  }

  onDeleteSwitch(sw){
    let control = this.showLoading("Deleting switch, please wait...");
    let alert = this.alertCtrl.create({
      title: 'Delete switch',
      message: 'Do you want to delete the "' + sw.name + '" switch?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Confirm',
          handler: () => {
            this.confirmDelete(sw, control);
          }
        }
      ]
    });
    alert.present();
  }

  private confirmDelete(sw, loader){
    this.swService.deleteSwitch(sw).then(() =>{
      this.swService.getAllSwitches().then((val) =>{
          this.switches = val;
          loader.dismiss();
      });
    });
  }

  private showLoading(message){
      let control = this.loadingCtrl.create({
        content: message
      });
      control.present();

      return control;
  }
}
