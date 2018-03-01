import { Component } from '@angular/core';
import {
	AlertController,
	ToastController,
	LoadingController
} from 'ionic-angular';

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
		this.arduino.enableBT().then(() => {

			let loading = this.loadingCtrl.create({
				content: 'Σύνδεση με την σόμπα...'
			});

			loading.present();

			this.arduino.connectToHeater()
				.then(() => {
					loading.dismiss();
				})
				.catch(() => {
					loading.dismiss();

					let alert = this.alertCtrl.create({
						title: 'Σφάλμα σύνδεσης με την σόμπα!',
						subTitle: 'Η σύνδεση με την σόμπα δεν ήταν εφικτό να πραγματοποιηθεί. Ελέγξτε αν η σόμπα (arduino) τροφοδοτείται.',
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
			title: 'Απενεργοποίηση Σόμπας',
			message: 'Είστε σίγουρος ότι θέλετε να απενεργοποιήσετε την σόμπα;',
			buttons: [
				{ text: 'ΑΚΥΡΩΣΗ' },
				{
					text: 'ΑΠΕΝΕΡΓΟΠΟΙΗΣΗ',
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
				title: 'Ενεργοποίσηση Σόμπας',
				message: 'Η σόμπα είναι απενεργοποιημένη για πάνω από ένα λεπτό. Δεν συνιστάται η ενεργοποίηση της, καθώς ο χώρος μπορεί να γεμίσει καπνό ή ακόμα χειρότερα να μην καταφέρει ποτέ να επανέλθει σε κατάσταση λειτουργίας. Είστε σίγουρος ότι θέλετε να ενεργοποιήσετε την σόμπα;',
				buttons: [
					{ text: 'ΑΚΥΡΩΣΗ' },
					{
						text: 'ΕΝΕΡΓΟΠΟΙΗΣΗ',
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
			return "Άπειρο";
		}
	}

}
