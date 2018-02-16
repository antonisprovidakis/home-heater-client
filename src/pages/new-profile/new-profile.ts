import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ProfilesProvider } from '../../providers/profiles/profiles';


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
		public navCtrl: NavController,
		public navParams: NavParams,
		public profilesProvider: ProfilesProvider
	) {
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad NewProfilePage');
	}

	stringifyInfinite(value: number): string {
		if (value >= 0) {
			return value.toString();
		}
		else {
			return "Infinite";
		}
	}

	checkButtonDisabled() {
		return this.heat === undefined
			|| this.preserve === undefined
			|| this.rest === undefined;
	}

	// onCreateButtonClicked() {
	// 	console.log("onCreateButtonClicked");

	// 	// TODO: implement
	// 	// gather info
	// 	const name = "";
	// 	const heat = 2;
	// 	const preserve = 2;
	// 	const rest = 2;

	// 	this.createProfile(name, heat, preserve, rest);
	// }

	// createProfile(name: string, heat: number, preserve: number, rest: number) {
	createProfile() {
		console.log("create profile");
		const name = this.createProfileName(this.name);
		const heat = this.heat;
		const preserve = this.preserve;
		const rest = this.rest;

		this.profilesProvider.createProfile(name, heat, preserve, rest).then(() => {
			this.dismiss();
		});
	}

	private createProfileName(typedName: string): string {
		if (typedName) {
			const trimmedName = typedName.trim();
			if (trimmedName.length > 0) {
				return trimmedName;
			}
		}

		const date = new Date();

		const d = date.getDate();
		const m = date.getMonth() + 1;
		const y = date.getFullYear();
		const t = date.toTimeString().split(" ")[0];

		const dateTimeString = "(" + d + "/" + m + "/" + y + ", " + t + ")";

		const name = "H" + this.heat + "_P" + this.preserve + "_R" + this.rest + " " + dateTimeString;
		return name;
	}

	private getTimingSelectValues(): number[] {
		const low = -1;
		const high = 60;

		const values: number[] = [];

		for (let i = low; i < high; i++) {
			values.push(i);
		}

		return values;
	}

	private dismiss() {
		this.navCtrl.pop();
	}

}
