import { Component } from '@angular/core';
import {
	NavParams,
	ViewController,
	AlertController,
	Platform
} from 'ionic-angular';

import { Profile } from '../../model/profile.interface';
import { ProfilesProvider } from '../../providers/profiles/profiles';
import { TimingProvider } from '../../providers/timing/timing';

@Component({
	selector: 'page-edit-profile',
	templateUrl: 'edit-profile.html',
})
export class EditProfilePage {

	profileInitialValues: Profile;

	newName: string;
	newHeat: number;
	newPreserve: number;
	newRest: number;

	constructor(
		public navParams: NavParams,
		public viewCtrl: ViewController,
		public alertCtrl: AlertController,
		public platform: Platform,
		public timing: TimingProvider,
		public profilesProvider: ProfilesProvider
	) {

		this.profileInitialValues = this.navParams.get('profileToEdit');

		this.newName = this.profileInitialValues.name;
		this.newHeat = this.profileInitialValues.heat;
		this.newPreserve = this.profileInitialValues.preserve;
		this.newRest = this.profileInitialValues.rest;
	}

	ionViewDidLoad() {
		this.platform.registerBackButtonAction(() => {
			this.onCancelClicked();
		});
	}

	checkDataChanged() {
		return !(this.newName === this.profileInitialValues.name
			&& this.newHeat === this.profileInitialValues.heat
			&& this.newPreserve === this.profileInitialValues.preserve
			&& this.newRest === this.profileInitialValues.rest);
	}

	saveChanges() {
		const updatedValues: Profile = {
			id: this.profileInitialValues.id
		}

		if (this.newName !== this.profileInitialValues.name) {
			updatedValues.name = this.newName;
		}
		if (this.newHeat !== this.profileInitialValues.heat) {
			updatedValues.heat = this.newHeat;
		}
		if (this.newPreserve !== this.profileInitialValues.preserve) {
			updatedValues.preserve = this.newPreserve;
		}
		if (this.newRest !== this.profileInitialValues.rest) {
			updatedValues.rest = this.newRest;
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
