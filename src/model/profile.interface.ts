export interface Profile {
	id: number;
	name: string;
	active: boolean;
	heat: number; // mills
	preserve: number; // mills
	rest: number; // mills
}
