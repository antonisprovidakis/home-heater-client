import { Component } from '@angular/core';
import {
	ToastController,
	AlertController,
	ActionSheetController,
	ModalController,
	ViewController,
	Platform,
	PopoverController
} from 'ionic-angular';

import { Profile } from '../../model/profile.interface';

import { NewProfilePage } from '../../pages/new-profile/new-profile';
import { EditProfilePage } from '../../pages/edit-profile/edit-profile';

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
		public popoverCtrl: PopoverController,
		public profilesProvider: ProfilesProvider,
		public arduino: ArduinoHeaterProvider
	) {
	}

	ionViewDidLoad() {
		this.profilesProvider.getProfiles().subscribe(profiles => {
			this.profiles = profiles;
		});

		this.profilesProvider.getActiveProfile().subscribe(profile => {
			if (!this.arduino.heaterConnected) {
				return;
			}

			this.arduino.activateProfile(profile);
		});
	}

	showMoreOptions(event) {
		this.popoverCtrl.create(ProfilesPopoverPage).present({ ev: event });
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
				}, {
					text: 'Edit',
					icon: !this.platform.is('ios') ? 'create' : null,
					handler: () => {
						this.onEditProfileClicked(profile);
					}
				}, {
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

	onActivateProfileButtonClicked(profileId: number) {
		if (!this.arduino.heaterConnected) {
			this.showNotConnectedToHeaterAlert();
			return;
		}

		this.activateProfile(profileId);
	}

	private showNotConnectedToHeaterAlert() {
		this.alertCtrl.create({
			title: 'Profile activation error!',
			message: "You can't activate this profile because you are not connected to the heater.",
			buttons: ['OK']
		}).present();
	}

	activateProfile(profileId: number) {
		this.profilesProvider.activateProfile(profileId).then((activatedProfile) => {
			this.showToast('Profile "' + activatedProfile.name + '" activated');
		}).catch((e) => console.log("error: ", e));
	}

	onCreateProfileButtonClicked() {
		this.showCreateProfilePage();
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

	onEditProfileClicked(profile: Profile) {
		this.showEditProfileModal(profile);
	}

	showEditProfileModal(profile: Profile) {
		let editModal = this.modalCtrl.create(EditProfilePage, { profileToEdit: profile });

		editModal.onDidDismiss((data) => {
			if (data && data.updates) {
				this.updateProfile(data.updates);
			}
		});

		editModal.present();
	}

	updateProfile(updates: Profile) {
		this.profilesProvider.updateProfile(updates).then((updatedProfile) => {
			// TODO: what to do here?

			// if (this.arduino.heaterConnected) {
			// 	this.arduino.activateProfile(updatedProfile)
			// 		.then(() => this.showToast('Profile "' + updatedProfile.name + '" updated'))
			// 		.catch((e) => console.log(e));
			// }
			this.showToast('Profile "' + updatedProfile.name + '" updated');
		}).catch((e) => console.log(e));
	}

	onDeleteProfileClicked(profile: Profile) {
		this.alertCtrl.create({
			title: 'Delete: "' + profile.name + '"?',
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
// Popover Menu
@Component({
	template: `
		<ion-list no-lines>
			<button ion-item (click)="onRestoreDefaultProfilesClicked()">Restore default profiles</button>
    </ion-list>
  `
})
export class ProfilesPopoverPage {

	constructor(
		public toastCtrl: ToastController,
		public alertCtrl: AlertController,
		public viewCtrl: ViewController,
		public profilesProvider: ProfilesProvider,
	) {
	}

	onRestoreDefaultProfilesClicked() {
		this.alertCtrl.create({
			title: 'Restore default profiles?',
			buttons: [
				{ text: 'Cancel' },
				{
					text: 'Restore',
					handler: () => {
						this.restoreDefaultProfiles();
					}
				}
			]
		}).present();
	}

	restoreDefaultProfiles() {
		this.viewCtrl.dismiss().then(() => {
			this.profilesProvider.restoreDefaultProfiles().then(() => {
				this.toastCtrl.create({
					message: "Default profiles restored",
					duration: 3000,
					showCloseButton: true,
					closeButtonText: 'Ok'
				}).present();
			});
		});
	}

}
