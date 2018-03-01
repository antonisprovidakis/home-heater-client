import { Component } from '@angular/core';
import {
	ToastController,
	AlertController,
	ActionSheetController,
	ModalController,
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
					text: 'Ενεργοποίηση προφίλ',
					icon: !this.platform.is('ios') ? 'play' : null,
					handler: () => {
						this.onActivateProfileButtonClicked(profile);
					}
				},
				{
					text: 'Διαγραφή προφίλ',
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
			closeButtonText: 'OK'
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

	onActivateProfileButtonClicked(profile: Profile) {
		if (!this.arduino.heaterConnected) {
			this.showPreventionAlert("Σφάλμα ενεργοποίσης προφίλ!", "Δεν μπορεί να πραγματοποιηθεί η ενεργοποίηση του προφίλ επειδή δεν έχει γίνει σύνδεση με την σόμπα.");
			return;
		}

		if (profile.heat == -1) {
			this.activateProfile(profile, true);
			return;
		}


		this.alertCtrl.create({
			title: 'Σημείο εκκίνησης νέου προφίλ',
			message: 'Θέλετε να πραγματοποιηθεί το Ζέσταμα από την αρχή κατά την ενεργοποίηση του νέου προφίλ;',
			buttons: [
				{
					text: 'ΟΧΙ',
					handler: () => {
						this.activateProfile(profile, false);
					}
				},
				{
					text: 'ΝΑΙ',
					handler: () => {
						this.activateProfile(profile, true);
					}
				}
			]
		}).present();
	}

	activateProfile(profile: Profile, startFromHeatPhase: boolean) {
		this.profilesProvider.activateProfile(profile).then((activatedProfile) => {

			this.arduino.activateProfile(activatedProfile).then(() => {

				if (startFromHeatPhase) {
					this.arduino.startFromHeatPhase();
				}

				this.showToast(`Το προφίλ "${activatedProfile.name}" ενεργοποιήθηκε`);
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
			this.showToast(`Το προφίλ "${createdProfile.name}" δημιουργήθηκε`);
		});
	}

	onDeleteProfileClicked(profile: Profile) {
		if (profile.active) {
			this.showPreventionAlert("Σφάλμα διαγραφής προφίλ!", "Δεν μπορείτε να διαγράψετε το ενεργό προφίλ. Η διαγραφή του θα είναι εφικτή αφού πρώτα ενεργοποιήσετε κάποιο άλλο.");
			return;
		}

		this.alertCtrl.create({
			title: `Διαγραφή "${profile.name}"`,
			message: 'Είστε σίγουρος πως θέλετε να διαγράψετε αυτό το προφίλ;',
			buttons: [
				{ text: 'ΑΚΥΡΩΣΗ' },
				{
					text: 'ΔΙΑΓΡΑΦΗ',
					handler: () => {
						this.deleteProfile(profile.id);
					}
				}
			]
		}).present();
	}

	deleteProfile(profileId: number) {
		this.profilesProvider.deleteProfile(profileId).then((deletedProfile) => {
			this.showToast(`Το προφίλ "${deletedProfile.name}" διαγράφτηκε`);
		}).catch((e) => console.log(e));;
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
