import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Trigger } from './../../models/trigger';
import { Switch } from './../../models/switch';

import { NewTriggerPage } from './../new-trigger/new-trigger'
import { ModalController } from 'ionic-angular';

import { TriggerService } from './../../services/trigger-service';
import { SwitchService } from './../../services/switch-service';

import { LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-about',
  templateUrl: 'triggers.html'
})
export class TriggersPage {
  triggers: Trigger[];

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, 
    public triggerService: TriggerService, public swService: SwitchService, public loadingCtrl: LoadingController,
    private alertCtrl: AlertController) {
  }

  ngOnInit(){
    let control = this.showLoading("Loading triggers, please wait...");

    return this.triggerService.getAllTriggers().then((val) =>{
      this.triggers = val;
      control.dismiss();
    });
  }

  onSelectTrigger(trigger){
    this.openEditModal(trigger);
  }

  onSelectNewTrigger(){
    this.openEditModal(null);
  }

  onDeleteTrigger(tr){
    let control = this.showLoading("Deleting trigger, please wait...");
    let alert = this.alertCtrl.create({
      title: 'Delete trigger',
      message: 'Do you want to delete the "' + tr.name + '" trigger?',
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
            this.confirmDelete(tr, control);
          }
        }
      ]
    });
    alert.present();
  }

  private confirmDelete(tr, loader){
    this.triggerService.deleteTrigger(tr).then(() =>{
      this.triggerService.getAllTriggers().then((val) =>{
          this.triggers = val;
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

  private openEditModal(trigger){
    let control = this.showLoading("Please wait...");
    this.swService.getAllSwitches().then(val =>{
      let modal = this.modalCtrl.create(NewTriggerPage, 
      {
        selectedTrigger: trigger, 
        avaiableSwitches: val
      });
      
      control.dismiss();
      modal.present();
    }); 
  }
}
