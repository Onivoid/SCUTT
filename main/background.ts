import { app } from 'electron'
import { setupWindowEvents } from './events/windowEvents'
import { databaseEvents } from './events/databaseEvents'
import { systemEvents } from './events/systemEvents'
import { socialEvents } from './events/socialEvents';

;(async () => {

  
  await app.whenReady();

  //Events Listeners
  await setupWindowEvents();
  await databaseEvents();
  await systemEvents();
  await socialEvents();

})()