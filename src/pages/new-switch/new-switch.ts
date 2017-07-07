import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Switch } from './../../models/switch';
import { SwitchService } from './../../services/switch-service';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { LoadingController } from 'ionic-angular';
import { UUID } from 'angular2-uuid';

@Component({
  selector: 'page-home',
  templateUrl: 'new-switch.html'
})

export class NewSwitchPage {
    currentSwitch: Switch;
    isNewSwitch: boolean;
    validateSwitch: FormGroup;

    constructor(public navCtrl: NavController, public navParam: NavParams, private swService: SwitchService,
            private formBuilder: FormBuilder, public loadingCtrl: LoadingController) {
        let sw = navParam.get('selectedSwitch');
        this.isNewSwitch = sw == null;
        
        if(sw == null){
            sw = new Switch();
            sw.isOn = false;
        }

        this.currentSwitch = sw;
        this.validateSwitch = this.formBuilder.group({
            name: [sw.name, Validators.required],
            turnOnMessage: [sw.turnOnMessage, Validators.required],
            turnOffMessage: [sw.turnOffMessage, Validators.required],
            telephone: [sw.telephone, Validators.required]
        });
    }

    onSave(form){
        let loader = this.loadingCtrl.create({
            content: "Creating switch, please wait..."
        });
        loader.present();

        this.currentSwitch.name = this.validateSwitch.value.name;
        this.currentSwitch.turnOnMessage = this.validateSwitch.value.turnOnMessage;
        this.currentSwitch.turnOffMessage = this.validateSwitch.value.turnOffMessage;
        this.currentSwitch.telephone = this.validateSwitch.value.telephone;

        this.swService.saveOrUpdateSwitch(this.currentSwitch).then(() =>{
            loader.dismiss();
            this.navCtrl.pop();
        });
    }
}
