import { Injectable } from '@angular/core';

@Injectable()
export class TimingProvider {

	public static readonly SECOND = 1000;
	public static readonly MINUTE = 60 * TimingProvider.SECOND;
	public static readonly HOUR = 60 * TimingProvider.MINUTE;

	// private timeValues: number[];

	constructor() {
		// this.timeValues = this.timeValues = this.createArrayWithinRange(-1, 59);
	}

	// millisBasedOnTimeUnit(timeUnit: string, value: number): number {
	// 	if (value === -1) {
	// 		return -1; // it's infinite
	// 	}

	// 	switch (timeUnit) {
	// 		case 'h':
	// 			return this.hoursToMillis(value);
	// 		case 'm':
	// 			return this.minutesToMillis(value);
	// 		case 's':
	// 			return this.secondsToMillis(value);
	// 		default:
	// 			return value;
	// 	}
	// }

	// hoursToMillis(hours: number): number {
	// 	return hours * TimingProvider.HOUR;
	// }

	minutesToMillis(minutes: number): number {
		return minutes * TimingProvider.MINUTE;
	}

	secondsToMillis(seconds: number): number {
		return seconds * TimingProvider.SECOND;
	}

	millisToMinutes(millis: number): number {
		return millis * TimingProvider.MINUTE;
	}

	// millisToHours(millis: number): number {
	// 	return millis * TimingProvider.HOUR;
	// }

	millisToSeconds(millis: number): number {
		return millis * TimingProvider.SECOND;
	}

	// getTimingValues(): number[] {
	// 	return this.timeValues;
	// }

	private createArrayWithinRange(low: number, high: number): number[] {
		const values: number[] = [];

		for (let i = low; i <= high; i++) {
			values.push(i);
		}

		return values;
	}

	// timeUnitToHumanReadableFormat(timeUnit: string): string {
	// 	switch (timeUnit) {
	// 		case 'h':
	// 			return "Hours";
	// 		case 'm':
	// 			return "Minutes";
	// 		case 's':
	// 			return "Seconds";
	// 		default:
	// 			return "N/A time unit";
	// 	}
	// }

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


