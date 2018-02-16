import { Component } from '@angular/core';
import {
	NavController,
	NavParams,
	ToastController,
	AlertController,
	ActionSheetController,
	ModalController,
	Platform
} from 'ionic-angular';

import { NewProfilePage } from '../../pages/new-profile/new-profile';
import { EditProfilePage } from '../../pages/edit-profile/edit-profile';

import { ProfilesProvider } from '../../providers/profiles/profiles';
import { Profile } from '../../model/profile.interface';


@Component({
	selector: 'page-profiles',
	templateUrl: 'profiles.html',
})
export class ProfilesPage {

	profiles: Profile[];

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public platform: Platform,
		public alertCtrl: AlertController,
		public toastCtrl: ToastController,
		public actionSheetCtrl: ActionSheetController,
		public modalCtrl: ModalController,
		public profilesProvider: ProfilesProvider) {
	}

	ionViewDidLoad() {
		this.profilesProvider.getProfiles().subscribe(profiles => {
			this.profiles = profiles;
		});
	}

	stringifyInfinite(value: number): string {
		if (value >= 0) {
			return value.toString();
		}
		else {
			return "Infinite";
		}
	}

	showProfileOptions(profile: Profile) {
		let actionSheet = this.actionSheetCtrl.create({
			title: profile.name,
			buttons: [
				{
					text: 'Activate',
					icon: !this.platform.is('ios') ? 'play' : null,
					handler: () => {
						console.log('Activate clicked');
						this.onCreateProfileButtonClicked();
					}
				}, {
					text: 'Edit',
					icon: !this.platform.is('ios') ? 'create' : null,
					handler: () => {
						console.log('Edit clicked');
						this.onEditProfileClicked(profile);
					}
				}, {
					text: 'Delete',
					role: 'destructive',
					icon: !this.platform.is('ios') ? 'trash' : null,
					handler: () => {
						console.log('Delete clicked');
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
			duration: 3000
		});
		toast.present();
	}

	onCreateProfileButtonClicked() {
		this.showCreateProfilePage();
	}

	private showCreateProfilePage() {
		const totalProfiles = this.profiles.length + 1;
		this.navCtrl.push(NewProfilePage);

		// let newProfileModal = this.modalCtrl.create(NewProfilePage);
		// newProfileModal.onDidDismiss(data => {
		// 	console.log(data);
		// });

		// newProfileModal.present();
	}

	onEditProfileClicked(profile: Profile) {
		this.editProfile(profile);
	}

	editProfile(profile: Profile) {
		console.log("edit profile");
		// TODO: implement
		// show edit dialog
		// let modal = this.modalCtrl.create(EditProfilePage);
		// modal.present();


		// gather info
		// on confirm => update profile
	}

	updateProfile(profile: Profile) {
		this.profilesProvider.updateProfile(profile).then(() => {
			this.showToast("Profile updated");
		});

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
		this.profilesProvider.deleteProfile(profileId).then(() => {
			this.showToast("Profile deleted");
		});
	}

}
