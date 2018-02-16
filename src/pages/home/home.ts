import { Component } from '@angular/core';
import {
	AlertController,
	ToastController
} from 'ionic-angular';

import { ProfilesProvider } from '../../providers/profiles/profiles';
import { Profile } from '../../model/profile.interface';
import { TimingProvider } from '../../providers/timing/timing';


@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {

	enabled: boolean = true;
	activeProfile: Profile;

	constructor(
		public alertCtrl: AlertController,
		public toastCtrl: ToastController,
		public profilesProvider: ProfilesProvider,
		public timing: TimingProvider
	) {
	}

	ionViewDidLoad() {
		this.profilesProvider.getActiveProfile().subscribe(activeProfile => {
			this.activeProfile = activeProfile;
		});
	}

	onTurnOffButtonClicked() {
		let confirm = this.alertCtrl.create({
			title: 'Turning off',
			message: 'Are you sure you want to turn off the heater?',
			buttons: [
				{ text: 'Cancel' },
				{
					text: 'Turn off',
					handler: () => {
						this.turnoff();
						this.showInfoToast();
					}
				}
			]
		});
		confirm.present();
	}

	turnoff() {
		this.enabled = false;
		// TODO: implement - send signal to arduino
	}

	private showInfoToast() {
		let toast = this.toastCtrl.create({
			message: 'In order for the heater to come back to life, you have to reset it manually',
			duration: 5000,
			showCloseButton: true,
			closeButtonText: 'Ok'
		});
		toast.present();
	}

}
