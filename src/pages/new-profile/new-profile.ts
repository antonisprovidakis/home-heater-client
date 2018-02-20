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
	heatTimeUnit: string;
	preserveTimeUnit: string;
	restTimeUnit: string;

	constructor(
		public viewCtrl: ViewController,
		public alertCtrl: AlertController,
		public timing: TimingProvider,
		public platform: Platform
	) {

		this.heatTimeUnit = 'm';
		this.preserveTimeUnit = 'm';
		this.restTimeUnit = 'm';
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
		// const name = this.name;
		// const heat = this.heat;
		// const preserve = this.preserve;
		// const rest = this.rest;
		// const heat = this.timing.millisBasedOnTimeUnit(this.heatTimeUnit, this.heat);
		// const preserve = this.timing.millisBasedOnTimeUnit(this.preserveTimeUnit, this.preserve);
		// const rest = this.timing.millisBasedOnTimeUnit(this.restTimeUnit, this.rest);

		const newProfileData: Profile = {
			name: this.name,
			heat: this.heat,
			heatTimeUnit: this.heatTimeUnit,
			preserve: this.preserve,
			preserveTimeUnit: this.preserveTimeUnit,
			rest: this.rest,
			restTimeUnit: this.restTimeUnit
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
