import { Injectable } from '@angular/core';


@Injectable()
export class TimingProvider {

	public static readonly SECOND_TEXT = "s";
	public static readonly MINUTE_TEXT = "m";
	public static readonly HOUR_TEXT = "h";

	public static readonly SECOND = 1000;
	public static readonly MINUTE = 60 * TimingProvider.SECOND;
	public static readonly HOUR = 60 * TimingProvider.MINUTE;

	constructor() {

	}

	// TODO: more user friendly implementation.
	// e.g. to format: hh:mm:ss

	hoursToMillis(hours: number): number {
		return hours * TimingProvider.HOUR;
	}

	minutesToMillis(minutes: number): number {
		return minutes * TimingProvider.MINUTE;
	}

	secondsToMillis(seconds: number): number {
		return seconds * TimingProvider.SECOND;
	}

	millisToMinutes(millis: number): number {
		return millis * TimingProvider.MINUTE;
	}

	millisToHours(millis: number): number {
		return millis * TimingProvider.HOUR;
	}

	millisToSeconds(millis: number): number {
		return millis * TimingProvider.SECOND;
	}


	getTimingValues(): number[] {
		const low = -1;
		const high = 60;

		const values: number[] = [];

		for (let i = low; i < high; i++) {
			values.push(i);
		}

		return values;
	}

	getTimingUnitHourText() {
		return TimingProvider.HOUR_TEXT;
	}

	getTimingUnitMinuteText() {
		return TimingProvider.MINUTE_TEXT;
	}

	getTimingUnitSecondText() {
		return TimingProvider.SECOND_TEXT;
	}

	getTimingUnits() {
		return [
			{ val: TimingProvider.HOUR_TEXT, label: "Hours" },
			{ val: TimingProvider.MINUTE_TEXT, label: "Minutes" },
			{ val: TimingProvider.SECOND_TEXT, label: "Seconds" }
		];
	}

	// Helper method
	stringifyInfinite(value: number): string {
		if (value >= 0) {
			return value.toString();
		}
		else {
			return "Infinite";
		}
	}

}
