import { Injectable } from '@angular/core';

import { BluetoothSerial } from '@ionic-native/bluetooth-serial';

import { Profile } from '../../model/profile.interface';
import { TimingProvider } from '../../providers/timing/timing';


@Injectable()
export class ArduinoHeaterProvider {

	constructor(private bt: BluetoothSerial, public timing: TimingProvider) {

	}

	/*
		Some methods are defined below
	 */

	// connect()

	// disconect()

	// isConnected(): boolean

	// turn off()

	// isEnabled() : boolean

	activateProfile(profile: Profile){
	// brake down values
		const heatMillis = this.timing.minutesToMillis(profile.heat);
		const preserveMillis = this.timing.minutesToMillis(profile.preserve);
		const restMillis = this.timing.minutesToMillis(profile.rest);
	}

	// private saveActiveProfile ??? (maybe this method's functionality is abstracted away in "activateProfile")

}
