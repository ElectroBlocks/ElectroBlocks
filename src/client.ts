import * as sapper from '@sapper/app';
import config from './env';
import { initializeApp } from 'firebase/app';
import { initializeAnalytics } from 'firebase/analytics';

sapper.start({
  target: document.querySelector('#sapper'),
});

// Initialize Firebase
const app = initializeApp(config.firebase);
initializeAnalytics(app);

localStorage.removeItem('no_alert');
