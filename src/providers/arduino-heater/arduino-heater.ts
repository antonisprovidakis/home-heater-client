import { Injectable, NgZone } from '@angular/core';

import { BluetoothSerial } from '@ionic-native/bluetooth-serial';

import { Profile } from '../../model/profile.interface';

const MAC_ADDRESS: string = "20:17:11:06:16:62";

const HEATER_FUNCTION: string = "HF";
const PROFILE_UPDATE: string = "PU";
const CHECK_ENABLED: string = "check_enabled";

const SECOND: number = 1000;
const MINUTE: number = 60 * SECOND;
const HOUR: number = 60 * MINUTE;

// something less than 4294967295 ms = 71582.78825 minutes
const INFINITY_SIM_VALUE: number = 71582; // minutes

@Injectable()
export class ArduinoHeaterProvider {

	heaterConnected: boolean;
	heaterEnabled: boolean;
	disabledTimestamp: number;

	constructor(
		private ngZone: NgZone,
		private bt: BluetoothSerial
	) {
	}

	sendMessage(msg: string) {
		return this.bt.write(msg);
	}

	enableBT() {
		return this.bt.enable();
	}

	connectToHeater(): Promise<void> {
		return new Promise((resolve, reject) => {
			this.bt.connect(MAC_ADDRESS).subscribe(
				() => {
					this.ngZone.run(() => {
						this.heaterConnected = true;

						this.checkHeaterEnabled()
							.then(() => resolve())
							.catch((e) => reject(e));
					});
				},
				(e) => {
					this.heaterConnected = false;
					reject();
				});
		});
	}

	disconnectFromHeater() {
		this.bt.disconnect()
			.then(() => {
				this.heaterConnected = false;
				this.heaterEnabled = null;
			})
			.catch((e) => console.log("error: ", e));
	}

	disableHeater() {
		const commandType = HEATER_FUNCTION;
		const params = {
			enabled: false
		};

		const msg = this.buildMessage(commandType, params);
		this.sendMessage(msg)
			.then(() => {
				this.disabledTimestamp = Date.now();
				this.heaterEnabled = false;
			});
	}

	enableHeater() {
		const commandType = HEATER_FUNCTION;
		const params = {
			enabled: true
		};

		const msg = this.buildMessage(commandType, params);

		this.sendMessage(msg).then(() => {
			this.heaterEnabled = true;
			this.disabledTimestamp = null;
		});
	}

	checkHeaterEnabled(): Promise<boolean> {
		return new Promise((resolve, reject) => {
			const msg = this.buildMessage(CHECK_ENABLED);

			this.sendMessage(msg)
				.then(() => {
					this.bt.subscribe("~").subscribe((data: string) => {
						// TODO: this part needs some debugging because it receives arduino buffer garbage
						const textToSearch = CHECK_ENABLED + "=";
						const index = data.indexOf(textToSearch);

						if (index == -1) { // not found
							return reject(new Error("Not a 'check_enabled' response received"));
						}

						const response = data.slice(index, index + textToSearch.length + 1);

						const enabled = !! + response.split("=")[1];
						this.heaterEnabled = enabled;
						resolve();
					});
				})
				.catch((e) => {
					reject(e);
				});
		});
	}

	activateProfile(profile: Profile) {
		// const heatMillis = this.minutesToMillis(profile.heat);
		// const preserveMillis = this.minutesToMillis(profile.preserve);
		// const restMillis = this.minutesToMillis(profile.rest);

		// TODO: remove this block after debugging
		const heatMillis = this.secondsToMillis(profile.heat);
		const preserveMillis = this.secondsToMillis(profile.preserve);
		const restMillis = this.secondsToMillis(profile.rest);

		const params = {
			id: profile.id,
			heat: heatMillis,
			preserve: preserveMillis,
			rest: restMillis
		};

		const msg = this.buildMessage(PROFILE_UPDATE, params);

		return this.sendMessage(msg);
	}

	startFromHeatPhase() {
		const msg = this.buildMessage(HEATER_FUNCTION, { phase: 'heat' });
		return this.sendMessage(msg);
	}

	private buildMessage(commandType: string, params?: any): string {
		let msg = this.createCommandPart(commandType);

		if (params) {
			msg = msg + this.createParametersPart(params);
		}

		return this.wrapMessageInDelimeters(msg);
	}

	private createParametersPart(params: any): string {
		let paramPart = "";

		for (const key in params) {
			paramPart = paramPart + "," + key + "=" + params[key];
		}

		return paramPart;
	}

	private createCommandPart(commandType): string {
		return "command=" + commandType;
	}

	private wrapMessageInDelimeters(msg: string): string {
		return "<" + msg + ">";
	}

	private minutesToMillis(minutes: number): number {
		if (minutes == -1) { // inifinity
			return INFINITY_SIM_VALUE * MINUTE;
		}

		return minutes * MINUTE;
	}

	private secondsToMillis(seconds: number): number {
		if (seconds == -1) { // inifinity
			return INFINITY_SIM_VALUE * SECOND;
		}

		return seconds * SECOND;
	}

}
