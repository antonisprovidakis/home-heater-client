import { Component } from '@angular/core';
import {
	NavParams,
	ViewController,
	AlertController,
	Platform
} from 'ionic-angular';

import { Profile } from '../../model/profile.interface';
import { ProfilesProvider } from '../../providers/profiles/profiles';
import { TimingProvider, TimeUnit } from '../../providers/timing/timing';

@Component({
	selector: 'page-edit-profile',
	templateUrl: 'edit-profile.html',
})
export class EditProfilePage {

	oldValues: Profile;

	name: string;
	heat: number;
	preserve: number;
	rest: number;
	heatTimeUnit: TimeUnit;
	preserveTimeUnit: TimeUnit;
	restTimeUnit: TimeUnit;

	constructor(
		public navParams: NavParams,
		public viewCtrl: ViewController,
		public alertCtrl: AlertController,
		public platform: Platform,
		public timing: TimingProvider,
		public profilesProvider: ProfilesProvider
	) {
		this.oldValues = this.navParams.get('profileToEdit');

		this.name = this.oldValues.name;
		this.heat = this.oldValues.heat;
		this.preserve = this.oldValues.preserve;
		this.rest = this.oldValues.rest;
		this.heatTimeUnit = this.oldValues.heatTimeUnit;
		this.preserveTimeUnit = this.oldValues.preserveTimeUnit;
		this.restTimeUnit = this.oldValues.restTimeUnit;
	}

	ionViewDidLoad() {
		this.platform.registerBackButtonAction(() => {
			this.onCancelClicked();
		});
	}

	checkDataChanged() {
		return !(this.name === this.oldValues.name
			&& this.heat === this.oldValues.heat
			&& this.preserve === this.oldValues.preserve
			&& this.rest === this.oldValues.rest
			&& this.heatTimeUnit === this.oldValues.heatTimeUnit
			&& this.preserveTimeUnit === this.oldValues.preserveTimeUnit
			&& this.restTimeUnit === this.oldValues.restTimeUnit
		);
	}

	saveChanges() {
		const updatedValues: Profile = {
			id: this.oldValues.id
		}

		if (this.name !== this.oldValues.name) {
			updatedValues.name = this.name;
		}
		if (this.heat !== this.oldValues.heat) {
			updatedValues.heat = this.heat;
		}
		if (this.preserve !== this.oldValues.preserve) {
			updatedValues.preserve = this.preserve;
		}
		if (this.rest !== this.oldValues.rest) {
			updatedValues.rest = this.rest;
		}
		if (this.heatTimeUnit !== this.oldValues.heatTimeUnit) {
			updatedValues.heatTimeUnit = this.heatTimeUnit;
		}
		if (this.preserveTimeUnit !== this.oldValues.preserveTimeUnit) {
			updatedValues.preserveTimeUnit = this.preserveTimeUnit;
		}
		if (this.restTimeUnit !== this.oldValues.restTimeUnit) {
			updatedValues.restTimeUnit = this.restTimeUnit;
		}

		this.dismiss(updatedValues);
	}

	onCancelClicked() {
		if (this.checkDataChanged()) {
			this.showConfirmAlert();
		}
		else {
			this.dismiss(null);
		}
	}

	dismiss(updates: Profile) {
		this.viewCtrl.dismiss({ updates: updates });
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

}
