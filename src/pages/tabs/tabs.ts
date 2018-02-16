import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { ProfilesPage } from '../profiles/profiles';


@Component({
	templateUrl: 'tabs.html'
})
export class TabsPage {

	tab1Root = HomePage;
	tab2Root = ProfilesPage;

	constructor() {

	}
}
