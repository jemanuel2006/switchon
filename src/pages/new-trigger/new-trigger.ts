import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Trigger } from './../../models/trigger';
import { Switch } from './../../models/switch';
import { TriggerService } from './../../services/trigger-service';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { LoadingController } from 'ionic-angular';

import { UUID } from 'angular2-uuid';

@Component({
  selector: 'page-trigger',
  templateUrl: 'new-trigger.html'
})

export class NewTriggerPage{
    currentTrigger: Trigger;
    isNewTrigger: boolean;
    validateTrigger: FormGroup;
    public switches: Switch[];

    constructor(public navCtrl: NavController, public navParam: NavParams, private triggerService: TriggerService,
            private formBuilder: FormBuilder, public loadingCtrl: LoadingController) {
        let trigger = navParam.get('selectedTrigger');
        this.switches = navParam.get('avaiableSwitches');

        this.isNewTrigger = trigger == null;
        
        if(trigger == null){
            trigger = new Trigger();
        }

        this.currentTrigger = trigger;
        this.validateTrigger = this.formBuilder.group({
            name: [trigger.name, Validators.required],
            frequency: [trigger.frequency, Validators.required],
            type: [trigger.type, Validators.required],
            time: [trigger.time, Validators.required],
            switch: [trigger.switch, Validators.required]
        });
    }

    onSave(form){
        let loader = this.loadingCtrl.create({
            content: "Creating trigger, please wait..."
        });
        loader.present();

        this.currentTrigger.name = this.validateTrigger.value.name;
        this.currentTrigger.frequency = this.validateTrigger.value.frequency;
        this.currentTrigger.type = this.validateTrigger.value.type;
        this.currentTrigger.time = this.validateTrigger.value.time;
        this.currentTrigger.switch = this.validateTrigger.value.switch;

        this.triggerService.saveOrUpdateTrigger(this.currentTrigger).then(() =>{
            loader.dismiss();
            this.navCtrl.pop();
        });
    }
}