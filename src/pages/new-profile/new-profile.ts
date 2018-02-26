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

	form: FormGroup;

	constructor(
		public viewCtrl: ViewController,
		public alertCtrl: AlertController,
		public timing: TimingProvider,
		public platform: Platform,
		private formBuilder: FormBuilder
	) {

		// TODO: add validation to accept only numbers (not ".", ",", "e") to form
		this.form = this.formBuilder.group({
			name: [''],
			heat: ['', [Validators.required, Validators.max(71582)]],
			preserve: ['', [Validators.required, Validators.max(71582)]],
			rest: ['', [Validators.required, Validators.max(71582)]],
		});

	}

	ionViewDidLoad() {
		this.platform.registerBackButtonAction(() => {
			this.onCancelClicked();
		});
	}

	createProfile() {
		const name = this.form.get("name").value as string;
		const heat = parseInt(this.form.get("heat").value);
		const preserve = parseInt(this.form.get("preserve").value);
		const rest = parseInt(this.form.get("rest").value);

		const newProfileData: Profile = {
			name: name,
			heat: heat,
			preserve: preserve,
			rest: rest
		};

		this.dismiss(newProfileData);
	}

	onCancelClicked() {
		if (this.form.valid) {
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
