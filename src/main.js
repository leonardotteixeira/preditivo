import './styles/app.css';
import * as FutoroComponents from './js/ui/components.js';

window.FutoroComponents = FutoroComponents;

function start() {
  if (typeof window.__futuroStart === 'function') {
    window.__futuroStart();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start);
} else {
  start();
}
