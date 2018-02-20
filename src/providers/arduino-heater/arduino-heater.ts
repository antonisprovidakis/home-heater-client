import { Injectable } from '@angular/core';

import { BluetoothSerial } from '@ionic-native/bluetooth-serial';


@Injectable()
export class ArduinoHeaterProvider {

	constructor(private bt: BluetoothSerial) {

	}

	/*
		Some methods are defined below
	 */

	// connect()

	// disconect()

	// turn off()

	// isEnabled() : boolean

	// activateProfile(profile: Profile)

	// private saveActiveProfile ??? (maybe this method's functionality is abstracted away in "activateProfile")

}
