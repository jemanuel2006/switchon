import { Switch } from './../models/switch';
import { Injectable } from "@angular/core";
import { UUID } from 'angular2-uuid';

import { Storage } from '@ionic/storage';
import { SMS } from '@ionic-native/sms';

@Injectable()

export class SwitchService{
    switches: Switch[];
    private STORAGE_VALUE = "switches";

    constructor(private storage: Storage, private sms: SMS){
        this.storage.get(this.STORAGE_VALUE).then((val) => {
            if(val == null)
                this.switches = [];
            else
                this.switches = val;
        });
    }

    getAllSwitches(){
        return this.switches;
    }

    getSwitchById(id){
        return this.switches.find((sw) => {
            return sw.id == id;
        });
    }

    saveOrUpdateSwitch(sw:Switch){
        let index = this.switches.findIndex((swit) =>{
            return swit.id == sw.id;
        });

        if(index == -1){
            sw.id = this.getAvaiableGuid();
            this.switches.push(sw);
        }
        else {
            let currentSwitch = this.switches[index];
            currentSwitch.isOn = sw.isOn;
            currentSwitch.name = sw.name;
            currentSwitch.turnOffMessage = sw.turnOffMessage;
            currentSwitch.turnOnMessage = sw.turnOnMessage;
        }

        this.saveStorage();
    }

    sendTurnOnCommand(sw: Switch){
        return new Promise(() =>{
            this.sms.send(sw.telephone, sw.turnOnMessage);
            sw.isOn = true;
            this.saveOrUpdateSwitch(sw);
        })
    }

    sendTurnOffCommand(sw: Switch){
        return new Promise(() =>{
            this.sms.send(sw.telephone, sw.turnOffMessage);
            sw.isOn = false;
            this.saveOrUpdateSwitch(sw);
        })
    }

    private saveStorage(){
        this.storage.set(this.STORAGE_VALUE, this.switches);
    }

    private getAvaiableGuid(){
        let guid = null;
        var index = null;

        while(index == null || index > -1){
            let guid = UUID.UUID();
            index = this.switches.findIndex((sw) =>{
                return sw.id == guid;
            });
        }

        return guid;
    }
}