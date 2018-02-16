import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { Profile } from '../../model/profile.interface';
import { TimeConverterProvider } from '../time-converter/time-converter'
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class ProfilesProvider {

	private profilesSubject = new BehaviorSubject([]);

	constructor(public storage: Storage, public timeConverter: TimeConverterProvider) {
		this.init();
	}

	private init() {
		this.firstRunInitOrPass().then(() => {
			this.getProfilesFromStorage().then(profiles => {
				this.profilesSubject.next(profiles);
			});
		});
	}

	private async firstRunInitOrPass() {
		const storageName = 'profiles';
		const currentKeys = await this.storage.keys();

		// TODO: remove after deb
		// await this.saveDefaultProfiles();

		// TODO: remove after debug
		// /*
		if (!currentKeys.some(k => k === storageName)) {
			// "profiles" not found, so it's first run
			console.log("do initialize profiles");
			await this.saveDefaultProfiles();
		}
		else {
			console.log("pass init");
		}
		// */
	}

	getProfiles(): Observable<Profile[]> {
		return this.profilesSubject.asObservable();
	}

	private getProfilesFromStorage(): Promise<Profile[]> {
		return this.storage.get("profiles");
	}

	createProfile(name: string, heat: number, preserve: number, rest: number) {
		return this.getProfilesFromStorage().then(profiles => {
			let p = profiles;

			if (!this.profilesSubject) {
				p = [];
			}

			const profile: Profile = {
				id: p.length + 1,
				name: name,
				active: false,
				heat: heat,
				preserve: preserve,
				rest: rest
			};

			p.push(profile);
			this.profilesSubject.next(p);
			this.storage.set("profiles", p);
		});
	}

	updateProfile(profile: Profile) {
		return this.getProfilesFromStorage().then(profiles => {
			const p = profiles.find(x => x.id === profile.id);

			p.name = profile.name;
			p.heat = profile.heat;
			p.preserve = profile.preserve;
			p.rest = profile.rest;

			this.profilesSubject.next(profiles);
			this.storage.set("profiles", profiles);
		});
	}

	deleteProfile(profileId: number) {
		return this.getProfilesFromStorage().then(profiles => {
			const found = !!profiles.find(x => x.id === profileId);

			if (!found) {
				console.log("profile id not found: ", profileId);
				return;
			}

			profiles = profiles.filter(x => x.id !== profileId);

			this.profilesSubject.next(profiles);
			this.storage.set("profiles", profiles);
		});
	}

	private saveDefaultProfiles(): Promise<any> {
		console.log("save default profiles");
		let profiles: Profile[] = this.createDefaultProfiles();
		// this.profilesSubject.next(profiles);
		return this.storage.set("profiles", profiles)
	}

	private createDefaultProfiles(): Profile[] {
		// TODO: fill with predefined profiles
		return [
			{
				id: 1,
				name: "Profile 1",
				active: true,
				heat: 10000,
				preserve: 3000,
				rest: 2000
			},
			{
				id: 2,
				name: "Profile 2",
				active: false,
				heat: 8000,
				preserve: 4000,
				rest: 1000
			}
		];
	}

}
