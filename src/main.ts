import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// if (environment.production) {
// 	console.log('Enabling production mode with enableProMode() function');
// 	enableProdMode();
// }

// Enable production mode unless running locally
if (!/localhost/.test(document.location.host)) {
	console.log('PRODUCTION MODE ENABLED');
	enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
