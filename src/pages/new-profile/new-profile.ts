import { Component } from '@angular/core';
import {
	ViewController,
	AlertController,
	Platform
} from 'ionic-angular';

import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { Profile } from '../../model/profile.interface';
import { TimingProvider } from '../../providers/timing/timing';


@Component({
	selector: 'page-new-profile',
	templateUrl: 'new-profile.html',
})
export class NewProfilePage {

	newProfileForm: FormGroup;

	constructor(
		public viewCtrl: ViewController,
		public alertCtrl: AlertController,
		public timing: TimingProvider,
		public platform: Platform,
		private formBuilder: FormBuilder
	) {

		// TODO: add validation to form
		this.newProfileForm = this.formBuilder.group({
			name: ['', [Validators.required]],
			heat: ['', [Validators.required]],
			preserve: ['', [Validators.required]],
			rest: ['', [Validators.required]]
		});

	}

	ionViewDidLoad() {
		this.platform.registerBackButtonAction(() => {
			this.onCancelClicked();
		});
	}

	createProfile() {
		const name = this.newProfileForm.get("name").value as string;
		const heat = parseInt(this.newProfileForm.get("heat").value);
		const preserve = parseInt(this.newProfileForm.get("preserve").value);
		const rest = parseInt(this.newProfileForm.get("rest").value);

		const newProfileData: Profile = {
			name: name,
			heat: heat,
			preserve: preserve,
			rest: rest
		};

		this.dismiss(newProfileData);
	}

	onCancelClicked() {
		if (this.newProfileForm.valid) {
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
