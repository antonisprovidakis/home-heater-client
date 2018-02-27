import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';

import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import {ProfilesPage, ProfilesPopoverPage} from '../pages/profiles/profiles';
import {NewProfilePage} from '../pages/new-profile/new-profile';
import {EditProfilePage} from '../pages/edit-profile/edit-profile';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';


import { ProfilesProvider } from '../providers/profiles/profiles';
import { ArduinoHeaterProvider } from '../providers/arduino-heater/arduino-heater';

@NgModule({
  declarations: [
		MyApp,
		TabsPage,
		HomePage,
		ProfilesPage,
		ProfilesPopoverPage,
		NewProfilePage,
		EditProfilePage
  ],
  imports: [
    BrowserModule,
		IonicModule.forRoot(MyApp),
		IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
		MyApp,
		TabsPage,
		HomePage,
		ProfilesPage,
		ProfilesPopoverPage,
		NewProfilePage,
		EditProfilePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
		{provide: ErrorHandler, useClass: IonicErrorHandler},
		BluetoothSerial,
    ProfilesProvider,
    ArduinoHeaterProvider
  ]
})
export class AppModule {}
