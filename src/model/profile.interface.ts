export interface Profile {
	id?: number;
	name?: string;
	active?: boolean;
	heat?: number; // millis
	heatTimeUnit?: string;
	preserve?: number; // millis
	preserveTimeUnit?: string;
	rest?: number; // millis
	restTimeUnit?: string;
}
