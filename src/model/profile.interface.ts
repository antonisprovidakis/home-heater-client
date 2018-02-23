export interface Profile {
	id?: number;
	name?: string;
	active?: boolean;
	heat?: number; // minutes
	preserve?: number; // minutes
	rest?: number; // minutes
}
