import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';

import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import {ProfilesPage} from '../pages/profiles/profiles';
import {NewProfilePage} from '../pages/new-profile/new-profile';
import {EditProfilePage} from '../pages/edit-profile/edit-profile';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ArduinoBtApiProvider } from '../providers/arduino-bt-api/arduino-bt-api';
import { ProfilesProvider } from '../providers/profiles/profiles';
import { TimingProvider } from '../providers/timing/timing';

@NgModule({
  declarations: [
		MyApp,
		TabsPage,
		HomePage,
		ProfilesPage,
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
		NewProfilePage,
		EditProfilePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ArduinoBtApiProvider,
    ProfilesProvider,
    TimingProvider
  ]
})
export class AppModule {}
