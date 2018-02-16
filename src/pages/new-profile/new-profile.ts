import { Component } from '@angular/core';
import {
	ViewController,
	AlertController,
	Platform
} from 'ionic-angular';

import { Profile } from '../../model/profile.interface';

import { TimingProvider } from '../../providers/timing/timing';


@Component({
	selector: 'page-new-profile',
	templateUrl: 'new-profile.html',
})
export class NewProfilePage {

	name: string;
	heat: number;
	preserve: number;
	rest: number;

	constructor(
		public viewCtrl: ViewController,
		public alertCtrl: AlertController,
		public timing: TimingProvider,
		public platform: Platform
	) {
	}

	ionViewDidLoad() {
		this.platform.registerBackButtonAction(() => {
			this.onCancelClicked();
		});
	}

	checkDataFilled() {
		return !(this.heat === undefined
			|| this.preserve === undefined
			|| this.rest === undefined);
	}

	createProfile() {
		const name = this.name;
		const heat = this.heat;
		const preserve = this.preserve;
		const rest = this.rest;

		const newProfileData: Profile = {
			name: name,
			heat: heat,
			preserve: preserve,
			rest: rest
		};

		this.dismiss(newProfileData);
	}

	onCancelClicked() {
		if (this.checkDataFilled()) {
			this.showConfirmAlert();
		}
		else {
			this.dismiss(null);
		}
	}

	private showConfirmAlert() {
		let confirm = this.alertCtrl.create({
			title: 'Discard changes?',
			buttons: [
				{ text: 'Cancel' },
				{
					text: 'Discard',
					handler: () => {
						this.dismiss(null);
					}
				}
			]
		});
		confirm.present();
	}

	private dismiss(newProfileData: Profile) {
		this.viewCtrl.dismiss({ newProfileData: newProfileData });
	}

}
