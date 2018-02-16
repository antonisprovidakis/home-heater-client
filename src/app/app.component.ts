import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Storage } from '@ionic/storage';
import { ProfilesProvider } from '../providers/profiles/profiles'

import { TabsPage } from '../pages/tabs/tabs';
import {NewProfilePage} from '../pages/new-profile/new-profile'

@Component({
	templateUrl: 'app.html'
})
export class MyApp {
	rootPage: any = TabsPage;
	// rootPage: any = NewProfilePage;

	constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public storage: Storage, public profilesProvider: ProfilesProvider) {
		platform.ready().then(() => {
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.

			statusBar.styleDefault();
			splashScreen.hide();
		});
	}
}
