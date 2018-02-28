import { Component } from '@angular/core';
import {
	ToastController,
	AlertController,
	ActionSheetController,
	ModalController,
	ViewController,
	Platform
} from 'ionic-angular';

import { Profile } from '../../model/profile.interface';

import { NewProfilePage } from '../../pages/new-profile/new-profile';
import { ProfilesProvider } from '../../providers/profiles/profiles';
import { ArduinoHeaterProvider } from '../../providers/arduino-heater/arduino-heater';


@Component({
	selector: 'page-profiles',
	templateUrl: 'profiles.html',
})
export class ProfilesPage {

	profiles: Profile[];

	constructor(
		public platform: Platform,
		public alertCtrl: AlertController,
		public toastCtrl: ToastController,
		public actionSheetCtrl: ActionSheetController,
		public modalCtrl: ModalController,
		public profilesProvider: ProfilesProvider,
		public arduino: ArduinoHeaterProvider
	) {
	}

	ionViewDidLoad() {
		this.profilesProvider.getProfiles().subscribe(profiles => {
			this.profiles = profiles;
		});
	}

	showProfileOptions(profile: Profile) {
		let actionSheet = this.actionSheetCtrl.create({
			title: profile.name,
			buttons: [
				{
					text: 'Activate',
					icon: !this.platform.is('ios') ? 'play' : null,
					handler: () => {
						this.onActivateProfileButtonClicked(profile.id);
					}
				},
				{
					text: 'Delete',
					role: 'destructive',
					icon: !this.platform.is('ios') ? 'trash' : null,
					handler: () => {
						this.onDeleteProfileClicked(profile);
					}
				}
			]
		});

		actionSheet.present();
	}

	showToast(msg: string) {
		const toast = this.toastCtrl.create({
			message: msg,
			duration: 3000,
			// position: 'top',
			showCloseButton: true,
			closeButtonText: 'Ok'
		});
		toast.present();
	}

	private showPreventionAlert(title: string, message: string) {
		this.alertCtrl.create({
			title: title,
			message: message,
			buttons: ['OK']
		}).present();
	}

	onActivateProfileButtonClicked(profileId: number) {
		if (!this.arduino.heaterConnected) {
			this.showPreventionAlert("Profile activation error!", "You can't activate this profile because you are not connected to the heater.");
			return;
		}

		this.alertCtrl.create({
			title: 'Do you want to skip heat phase?',
			buttons: [
				{
					text: 'Restart heat phase',
					handler: () => {
						this.activateProfile(profileId, true);
					}
				},
				{
					text: 'Skip heat phase',
					handler: () => {
						this.activateProfile(profileId, false);
					}
				}
			]
		}).present();
	}

	activateProfile(profileId: number, startFromHeatPhase: boolean) {
		this.profilesProvider.activateProfile(profileId).then((activatedProfile) => {

			this.arduino.activateProfile(activatedProfile).then(() => {

				if (startFromHeatPhase) {
					this.arduino.startFromHeatPhase();
				}

				this.showToast(`Profile ${activatedProfile.name} activated`);
			});
		}).catch((e) => console.log("error: ", e));
	}

	showCreateProfilePage() {
		let createProfileModal = this.modalCtrl.create(NewProfilePage);

		createProfileModal.onDidDismiss((data) => {
			if (data && data.newProfileData) {
				this.createProfile(data.newProfileData);
			}
		});

		createProfileModal.present();
	}

	createProfile(profileData: Profile) {
		this.profilesProvider.createProfile(profileData).then((createdProfile) => {
			this.showToast('Profile "' + createdProfile.name + '" created');
		});
	}

	onDeleteProfileClicked(profile: Profile) {
		if (profile.active) {
			this.showPreventionAlert("Profile deletion error!", "You can't delete this profile because it is currently active. You will be able to delete it after you have chosen another one.");
			return;
		}

		this.alertCtrl.create({
			title: `Delete: ${profile.name}?`,
			message: 'Are you sure you want to delete this profile?',
			buttons: [
				{ text: 'Cancel' },
				{
					text: 'Delete',
					handler: () => {
						this.deleteProfile(profile.id);
					}
				}
			]
		}).present();
	}

	deleteProfile(profileId: number) {
		this.profilesProvider.deleteProfile(profileId).then((deletedProfile) => {
			this.showToast('Profile "' + deletedProfile.name + '" deleted');
		}).catch((e) => console.log(e));;
	}

	stringifyInfinite(value: number): string {
		if (value >= 0) {
			return value.toString();
		}
		else {
			return "Infinite";
		}
	}

}
