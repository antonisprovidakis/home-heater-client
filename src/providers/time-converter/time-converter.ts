import { Injectable } from '@angular/core';


@Injectable()
export class TimeConverterProvider {

	public static readonly SECOND_TEXT = "s";
	public static readonly MINUTE_TEXT = "m";
	public static readonly HOUR_TEXT = "h";

	public static readonly SECOND = 1000;
	public static readonly MINUTE = 60 * TimeConverterProvider.SECOND;
	public static readonly HOUR = 60 * TimeConverterProvider.MINUTE;

	constructor() {

	}

	// TODO: more user friendly implementation.
	// e.g. to format: hh:mm:ss

	hoursToMillis(hours: number): number {
		return hours * TimeConverterProvider.HOUR;
	}

	minutesToMillis(minutes: number): number {
		return minutes * TimeConverterProvider.MINUTE;
	}

	secondsToMillis(seconds: number): number {
		return seconds * TimeConverterProvider.SECOND;
	}

	millisToMinutes(millis: number): number {
		return millis * TimeConverterProvider.MINUTE;
	}

	millisToHours(millis: number): number {
		return millis * TimeConverterProvider.HOUR;
	}

	millisToSeconds(millis: number): number {
		return millis * TimeConverterProvider.SECOND;
	}

}
