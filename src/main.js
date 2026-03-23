import './styles/app.css';
import * as FutoroComponents from './js/ui/components.js';

window.FutoroComponents = FutoroComponents;

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
