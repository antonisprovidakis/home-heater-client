import { Component } from '@angular/core';
import {
	AlertController,
	ToastController,
	LoadingController
} from 'ionic-angular';

import { Observable } from 'rxjs/Observable';


import { ProfilesProvider } from '../../providers/profiles/profiles';
import { ArduinoHeaterProvider } from '../../providers/arduino-heater/arduino-heater';
import { Profile } from '../../model/profile.interface';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {


	activeProfile: Profile;

	constructor(
		public alertCtrl: AlertController,
		public toastCtrl: ToastController,
		public loadingCtrl: LoadingController,
		public profilesProvider: ProfilesProvider,
		public arduino: ArduinoHeaterProvider
	) {
	}

	ionViewDidLoad() {
		this.profilesProvider.getActiveProfile().subscribe(profile => {
			this.activeProfile = profile;
		});
	}

	connectToHeater() {
		this.arduino.enableBT()
			.then(() => {

				let loading = this.loadingCtrl.create({
					content: 'Connecting to Heater...'
				});

				loading.present();

				this.arduino.connectToHeater()
					.then(() => {
						loading.dismiss();
					})
					.catch(() => {
						loading.dismiss();

						let alert = this.alertCtrl.create({
							title: 'Heater connection error!',
							subTitle: 'Connection with heater could not be established. Check if arduino is properly powered.',
							buttons: ['OK']
						});

						alert.present();
					});
			});
	}

	disconnectFromHeater() {
		this.arduino.disconnectFromHeater();
	}

	onDisableHeaterButtonClicked() {
		const confirm = this.alertCtrl.create({
			title: 'Disable heater',
			message: 'Are you sure you want to disable the heater?',
			buttons: [
				{ text: 'Cancel' },
				{
					text: 'Disable Heater',
					handler: () => {
						this.disableHeater();
					}
				}
			]
		});
		confirm.present();
	}

	disableHeater() {
		this.arduino.disableHeater();
	}

	onEnableHeaterButtonClicked() {
		const nowTimestamp = Date.now();

		if (nowTimestamp - this.arduino.disabledTimestamp > 60000) { // 1 minute has passed
			const confirm = this.alertCtrl.create({
				title: 'Enable heater',
				message: 'Heater is disabled for more than a minute. Enabling is not recommended, as the place may be filled with smoke or worse it may not be enough to light the fire back again in the stove. Are you sure you want to enable it?',
				buttons: [
					{ text: 'Cancel' },
					{
						text: 'Enable Heater',
						handler: () => {
							this.enableHeater();
						}
					}
				]
			});

			confirm.present();
		}
		else {
			this.enableHeater();
		}
	}

	enableHeater() {
		this.arduino.enableHeater();
	}

	stringifyInfinite(value: number): string {
		if (value >= 0) {
			return value.toString();
		}
		else {
			return "Infinite";
		}
	}

}
