import {TimeUnit} from '../providers/timing/timing'

export interface Profile {
	id?: number;
	name?: string;
	active?: boolean;
	heat?: number; // millis
	heatTimeUnit?: TimeUnit;
	preserve?: number; // millis
	preserveTimeUnit?: TimeUnit;
	rest?: number; // millis
	restTimeUnit?: TimeUnit;
}
