import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { SwitchOnApp } from './app.component';

import { TriggersPage } from '../pages/triggers/triggers';
import { SwitchesPage } from '../pages/switches/switches';
import { NewSwitchPage } from '../pages/new-switch/new-switch';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { IonicStorageModule } from '@ionic/storage';
import { SMS } from '@ionic-native/sms';
import { SwitchService } from './../services/switch-service';

@NgModule({
  declarations: [
    SwitchOnApp,
    TriggersPage,
    SwitchesPage,
    NewSwitchPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(SwitchOnApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    SwitchOnApp,
    TriggersPage,
    SwitchesPage,
    NewSwitchPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SwitchService,
    SMS
  ]
})
export class AppModule {}
