import { Component } from '@angular/core';
import {
	NavController,
	AlertController,
	ToastController
} from 'ionic-angular';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {

	enabled: boolean = true;

	constructor(public navCtrl: NavController, public alertCtrl: AlertController, public toastCtrl: ToastController) {
	}

	ionViewDidLoad() {
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
