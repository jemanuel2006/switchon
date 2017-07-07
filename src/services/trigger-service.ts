import { Trigger } from './../models/trigger';
import { Switch } from './../models/switch';
import { Injectable } from "@angular/core";

import { UUID } from 'angular2-uuid';

import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';

@Injectable()

export class TriggerService{
    private STORAGE_VALUE = "triggers";
    private triggers: Trigger[];
    isLoaded: boolean;

    constructor(private storage: Storage, public events: Events){
        this.initialize();

        events.subscribe("swtich:deleted", sw =>{
            this.deleteRelatedSwitchFromTriggers(sw);
        });
    }

    async initialize()
    {
        this.isLoaded = false;
        let a = await this.storage.get(this.STORAGE_VALUE);
        this.triggers = a == null ? [] : a;
        this.isLoaded = true;
    }

    async getAllTriggers(){
        return new Promise<Trigger[]>(async (resolve) =>{
            if(this.isLoaded == false)
                await this.initialize();
            
            resolve(this.triggers);
        });
    }

    getTriggerById(id){
        return new Promise<Trigger>(async (resolve) => {
            let t = this.triggers.find((trigger) => {
                        return trigger.id == id;
                    });
            resolve(t);
        });
    }

    saveOrUpdateTrigger(tr:Trigger){
        return new Promise<Switch>(async (resolve) => {
            let index = this.triggers.findIndex((swit) =>{
                return swit.id == tr.id;
            });

            if(index == -1){
                tr.id = this.getAvaiableGuid();
                this.triggers.push(tr);
            }
            else {
                let currentSwitch = this.triggers[index];
                currentSwitch.name = tr.name;
            }

            this.saveStorage();
            resolve();
        });
    }

    async deleteTrigger(tr:Trigger){
        return new Promise(async () =>{
            let index = this.triggers.findIndex((trigg) =>{
                return trigg.id == tr.id;
            });

            if(index == -1)
                return;
            
            this.triggers.splice(index, 1);
        });
    }

    deleteRelatedSwitchFromTriggers(sw){
        for(let i = 0; i < this.triggers.length; i++){
            let t = this.triggers[i];
            if(t.switch.id == sw.id){
                this.triggers[i].switch = null;
            }
        };
    }

     private saveStorage(){
        this.storage.set(this.STORAGE_VALUE, this.triggers);
    }

    private getAvaiableGuid(){
        let guid = null;
        let index = null;

        while(index == null || index > -1){
            guid = UUID.UUID();
            index = this.triggers.findIndex((sw) =>{
                return sw.id == guid;
            });
        }

        return guid;
    }
}