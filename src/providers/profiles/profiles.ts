import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';


import { Profile } from '../../model/profile.interface';

@Injectable()
export class ProfilesProvider {

	private profilesSubject = new BehaviorSubject([]);

	constructor(private storage: Storage) {
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
			console.log("pass default profiles init");
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

	activateProfile(profileId: number): Promise<Profile> {
		return new Promise((resolve, reject) => {
			this.getProfilesFromStorage().then(profiles => {
				const p = profiles.find(x => x.id === profileId);
				const currentlyActiveProfile = profiles.find(x => x.active === true);

				if (profileId === currentlyActiveProfile.id) {
					return reject(new Error(`Profile with id ${profileId} is already active`));
				}

				currentlyActiveProfile.active = false;
				p.active = true;

				this.storage.set("profiles", profiles)
					.then(() => {
						this.profilesSubject.next(profiles);
						resolve(p);
					})
					.catch(e => reject(e));
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
					rest: newProfileValues.rest,
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
		if (!name) {
			return "Profile " + id;
		}

		const trimmedName = name.trim();

		if (trimmedName.length === 0) {
			// empty string after trimming
			return "Profile " + id;
		}

		return trimmedName;
	}

	deleteProfile(profileId: number): Promise<Profile> {
		return new Promise((resolve, reject) => {
			this.getProfilesFromStorage().then(profiles => {
				const profileToDelete = profiles.find(x => x.id === profileId);

				if (!profileToDelete) {
					return reject(new Error(`Profile with id ${profileId} not found`));
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

	async restoreDefaultProfiles() {
		const storage = "profiles";
		await this.storage.remove(storage);
		await this.saveDefaultProfiles();
		const profiles = await this.getProfilesFromStorage();
		this.profilesSubject.next(profiles);
		return profiles;
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
				// THIS IS THE DEFAULT PROFILE
				id: 1,
				name: 'Profile 1',
				active: true,
				heat: 105,
				preserve: 2,
				rest: 2,
			},
			{
				id: 2,
				name: 'Profile 2',
				active: false,
				heat: 60,
				preserve: 3,
				rest: 20,
			},
			{
				id: 3,
				name: 'Profile 3',
				active: false,
				heat: 30,
				preserve: 45,
				rest: 4,
			},
			{
				id: 4,
				name: 'Profile 4',
				active: false,
				heat: 8,
				preserve: 5,
				rest: 3,
			}
		];
	}

}
