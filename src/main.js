import './styles/app.css';
import * as BubuyaComponents from './js/ui/components.js';

window.BubuyaComponents = BubuyaComponents;

function start() {
  if (typeof window.__bubuyaStart === 'function') {
    window.__bubuyaStart();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start);
} else {
  start();
}
