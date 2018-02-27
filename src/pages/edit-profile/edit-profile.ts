import { Component } from '@angular/core';
import {
	NavParams,
	ViewController,
	AlertController,
	Platform
} from 'ionic-angular';

import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { Profile } from '../../model/profile.interface';
import { ProfilesProvider } from '../../providers/profiles/profiles';

@Component({
	selector: 'page-edit-profile',
	templateUrl: 'edit-profile.html',
})
export class EditProfilePage {

	form: FormGroup;

	oldValues: Profile;

	constructor(
		public navParams: NavParams,
		public viewCtrl: ViewController,
		public alertCtrl: AlertController,
		public platform: Platform,
		private formBuilder: FormBuilder,
		public profilesProvider: ProfilesProvider
	) {
		this.oldValues = this.navParams.get('profileToEdit');

		// TODO: add validation to accept only numbers (not ".", ",", "e") to form
		this.form = this.formBuilder.group({
			name: [this.oldValues.name],
			heat: [this.oldValues.heat, [Validators.required, Validators.min(-1), Validators.max(71582)]],
			preserve: [this.oldValues.preserve, [Validators.required, Validators.min(0), Validators.max(71582)]],
			rest: [this.oldValues.rest, [Validators.required, Validators.min(0), Validators.max(71582)]],
		});
	}

	saveChanges() {
		const name = this.form.get("name").value as string;
		const heat = parseInt(this.form.get("heat").value);
		const preserve = parseInt(this.form.get("preserve").value);
		const rest = parseInt(this.form.get("rest").value);

		const updatedValues: Profile = {
			id: this.oldValues.id,
			active: this.oldValues.active
		}

		if (name !== this.oldValues.name) {
			updatedValues.name = name;
		}
		if (heat !== this.oldValues.heat) {
			updatedValues.heat = heat;
		}
		if (preserve !== this.oldValues.preserve) {
			updatedValues.preserve = preserve;
		}
		if (rest !== this.oldValues.rest) {
			updatedValues.rest = rest;
		}

		this.dismiss(updatedValues);
	}

	onCancelClicked() {
		if (this.form.valid) {
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
		this.alertCtrl.create({
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
		}).present();
	}

}
