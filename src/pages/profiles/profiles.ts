import { Component } from '@angular/core';
import {
	ToastController,
	AlertController,
	ActionSheetController,
	ModalController,
	Platform
} from 'ionic-angular';

import { NewProfilePage } from '../../pages/new-profile/new-profile';
import { EditProfilePage } from '../../pages/edit-profile/edit-profile';

import { ProfilesProvider } from '../../providers/profiles/profiles';
import { TimingProvider } from '../../providers/timing/timing';

import { Profile } from '../../model/profile.interface';


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
		public timing: TimingProvider,
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
						this.onActivateProfileButtonClicked(profile);
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
			showCloseButton: true,
			closeButtonText: 'Ok'
		});
		toast.present();
	}

	onActivateProfileButtonClicked(profile: Profile) {
		this.activateProfile(profile);
	}

	activateProfile(profile: Profile) {
		this.profilesProvider.activateProfile(profile).then((activatedProfile) => {
			this.showToast('Profile "' + activatedProfile.name + '" activated');
		}).catch((e) => console.log("error: ", e));
		// TODO: implement - send signal to arduino
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
			this.showToast('Profile "' + updatedProfile.name + '" updated');
		}).catch((e) => console.log(e));
	}

	onDeleteProfileClicked(profile: Profile) {
		let confirm = this.alertCtrl.create({
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
		});
		confirm.present();
	}

	deleteProfile(profileId: number) {
		this.profilesProvider.deleteProfile(profileId).then((deletedProfile) => {
			this.showToast('Profile "' + deletedProfile.name + '" deleted');
		}).catch((e) => console.log(e));;
	}

}
