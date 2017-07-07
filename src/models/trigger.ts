import { Switch } from './switch';

export class Trigger{
    id: string;
    name: string;
    frequency: number;
    type: number;
    time: Date;
    switch: Switch;
}