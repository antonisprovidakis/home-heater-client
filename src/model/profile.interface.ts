export interface Profile {
	id?: number;
	name?: string;
	active?: boolean;
	heat?: number; // millis
	preserve?: number; // millis
	rest?: number; // millis
}
