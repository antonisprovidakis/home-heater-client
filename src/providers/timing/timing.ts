import { Injectable } from '@angular/core';

export const enum TimeUnit {
	SECOND = "s",
	MINUTE = "m",
	HOUR = "h"
}

@Injectable()
export class TimingProvider {

	public static readonly SECOND = 1000;
	public static readonly MINUTE = 60 * TimingProvider.SECOND;
	public static readonly HOUR = 60 * TimingProvider.MINUTE;

	timeValues: number[];

	constructor() {
	}

	// TODO: more user friendly implementation.
	// e.g. to format: hh:mm:ss

	millisBasedOnTimeUnit(timeUnit: TimeUnit, value: number): number {
		if (value === -1) {
			return -1; // it's infinite
		}

		switch (timeUnit) {
			case TimeUnit.HOUR:
				return this.hoursToMillis(value);
			case TimeUnit.MINUTE:
				return this.minutesToMillis(value);
			case TimeUnit.SECOND:
				return this.secondsToMillis(value);
			default:
				return value;
		}
	}

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
		if (!this.timeValues) {
			const low = -1;
			const high = 60;
			this.timeValues = this.createArrayWithinRange(low, high);
		}

		return this.timeValues;
	}

	private createArrayWithinRange(low: number, high: number): number[] {
		const values: number[] = [];

		for (let i = low; i <= high; i++) {
			values.push(i);
		}

		return values;
	}

	getTimingUnits() {
		return [
			{ val: TimeUnit.HOUR, label: this.timeUnitToString(TimeUnit.HOUR) },
			{ val: TimeUnit.MINUTE, label: this.timeUnitToString(TimeUnit.MINUTE) },
			{ val: TimeUnit.SECOND, label: this.timeUnitToString(TimeUnit.SECOND) }
		];
	}

	timeUnitToString(timeUnit: TimeUnit): string {
		switch (timeUnit) {
			case TimeUnit.HOUR:
				return "Hours";
			case TimeUnit.MINUTE:
				return "Minutes";
			case TimeUnit.SECOND:
				return "Seconds";
			default:
				return "";
		}
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
