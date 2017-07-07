import { Switch } from './../models/switch';
import { Injectable } from "@angular/core";
import { UUID } from 'angular2-uuid';

import { Storage } from '@ionic/storage';
import { SMS } from '@ionic-native/sms';
import { Events } from 'ionic-angular';

@Injectable()

export class SwitchService{
    switches: Switch[];
    private STORAGE_VALUE = "switches";
    isLoaded: boolean;

    constructor(private storage: Storage, private sms: SMS, public events: Events){
        this.initialize();
    }

    async initialize()
    {
        this.isLoaded = false;
        let a = await this.storage.get(this.STORAGE_VALUE);
        this.switches = a == null ? [] : a;
        this.isLoaded = true;
    }

    async getAllSwitches(){
        return new Promise<Switch[]>(async (resolve) =>{
            if(this.isLoaded == false)
                await this.initialize();
            
            resolve(this.switches);
        });
    }

    async getSwitchById(id){
        return new Promise<Switch>(async (resolve) => {
            let sw = this.switches.find((sw) => {
                        return sw.id == id;
                    });
            resolve(sw);
        });
    }

    async saveOrUpdateSwitch(sw:Switch){
        return new Promise<Switch>(async (resolve) => {
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
            resolve();
        });
    }

    async deleteSwitch(sw:Switch){
        return new Promise(async () =>{
            let index = this.switches.findIndex((swit) =>{
                return swit.id == sw.id;
            });

            if(index == -1)
                return;
            
            this.switches.splice(index, 1);
            this.events.publish("switch:deleted", sw);
        });
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
        let index = null;

        do{
            guid = UUID.UUID();
            index = this.switches.findIndex((sw) =>{
                return sw.id == guid;
            });
        } while(index == null || index > -1)

        return guid;
    }
}