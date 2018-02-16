import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';


import { Profile } from '../../model/profile.interface';
import { TimingProvider } from '../timing/timing'

@Injectable()
export class ProfilesProvider {

	private profilesSubject = new BehaviorSubject([]);

	constructor(public storage: Storage, public timing: TimingProvider) {
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

		if (!currentKeys.some(k => k === storageName)) {
			// "profiles" not found, so it's first run
			console.log("do initialize profiles");
			await this.saveDefaultProfiles();
		}
		else {
			console.log("pass init");
		}
	}

	getProfiles(): Observable<Profile[]> {
		return this.profilesSubject.asObservable();
	}

	getActiveProfile(): Observable<Profile> {
		return this.getProfiles()
			.map(profiles =>
				profiles.find(profile => profile.active === true)
			);
	}

	private getProfilesFromStorage(): Promise<Profile[]> {
		return this.storage.get("profiles");
	}

	activateProfile(profile: Profile): Promise<Profile> {
		return new Promise((resolve, reject) => {
			this.getProfilesFromStorage().then(profiles => {
				const p = profiles.find(x => x.id === profile.id);
				const currentlyActiveProfile = profiles.find(x => x.active === true);

				if (!p) {
					return reject("Profile not found");
				}

				if (p.id === currentlyActiveProfile.id) {
					return reject("Profile is already active");
				}

				currentlyActiveProfile.active = false;
				p.active = true;

				this.storage.set("profiles", profiles).then(() => {
					this.profilesSubject.next(profiles);
					resolve(p);
				}).catch(e => reject(e));
			});
		});
	}

	createProfile(newProfileValues: Profile): Promise<Profile> {
		return new Promise((resolve, reject) => {
			this.getProfilesFromStorage().then(profiles => {
				let p = profiles;

				if (!this.profilesSubject) {
					p = [];
				}

				const newId = p.length + 1;

				const profile: Profile = {
					id: newId,
					name: this.createName(newProfileValues.name, newId),
					active: false,
					heat: newProfileValues.heat,
					preserve: newProfileValues.preserve,
					rest: newProfileValues.rest
				};

				p.push(profile);
				this.storage.set("profiles", p)
					.then(() => {
						this.profilesSubject.next(p);
						resolve(profile);
					})
					.catch(e => reject(e));
			});
		});
	}

	private createName(name: string, id: number): string {
		if (name) {
			const trimmedName = name.trim();
			if (trimmedName.length > 0) {
				return trimmedName;
			}
		}

		return "Profile " + id;
	}

	updateProfile(updates: Profile): Promise<Profile> {
		return new Promise((resolve, reject) => {
			if (!updates.id) {
				return reject("profile not selected");
			}

			this.getProfilesFromStorage().then(profiles => {
				const p = profiles.find(x => x.id === updates.id);

				if (!p) {
					return reject("profile not found");
				}

				p.name = updates.name || p.name;
				p.heat = updates.heat || p.heat;
				p.preserve = updates.preserve || p.preserve;
				p.rest = updates.rest || p.rest;

				this.storage.set("profiles", profiles)
					.then(() => {
						this.profilesSubject.next(profiles);
						resolve(p);
					})
					.catch((e) => reject(e));
			});
		});
	}

	deleteProfile(profileId: number): Promise<Profile> {
		return new Promise((resolve, reject) => {
			this.getProfilesFromStorage().then(profiles => {
				const profileToDelete = profiles.find(x => x.id === profileId);

				if (!profileToDelete) {
					return reject("profile id not found: " + profileId);
				}

				profiles = profiles.filter(x => x.id !== profileId);

				this.storage.set("profiles", profiles)
					.then(() => {
						this.profilesSubject.next(profiles);
						resolve(profileToDelete);
					})
					.catch((e) => reject(e));
			});
		});
	}

	private saveDefaultProfiles() {
		console.log("save default profiles");
		let profiles: Profile[] = this.createDefaultProfiles();
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
