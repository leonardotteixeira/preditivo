(() => {
  const nativeInnerHtml = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');

  function sanitizeNodeTree(root) {
    const blockedTags = new Set(['SCRIPT', 'IFRAME', 'OBJECT', 'EMBED', 'LINK', 'STYLE']);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
    const toRemove = [];

    while (walker.nextNode()) {
      const el = walker.currentNode;
      if (blockedTags.has(el.tagName)) {
        toRemove.push(el);
        continue;
      }

      const attrs = Array.from(el.attributes || []);
      for (const attr of attrs) {
        const name = attr.name.toLowerCase();
        const value = String(attr.value || '').trim();
        if (name.startsWith('on')) {
          el.removeAttribute(attr.name);
          continue;
        }
        if ((name === 'href' || name === 'src' || name === 'xlink:href') && /^javascript:/i.test(value)) {
          el.removeAttribute(attr.name);
        }
      }
    }

    toRemove.forEach((node) => node.remove());
  }

  function sanitizeHtml(input) {
    const template = document.createElement('template');
    const html = String(input == null ? '' : input);
    if (nativeInnerHtml && nativeInnerHtml.set && nativeInnerHtml.get) {
      nativeInnerHtml.set.call(template, html);
    } else {
      template.innerHTML = html;
    }
    sanitizeNodeTree(template.content);
    if (nativeInnerHtml && nativeInnerHtml.get) {
      return nativeInnerHtml.get.call(template);
    }
    return template.innerHTML;
  }

  if (nativeInnerHtml && nativeInnerHtml.set && nativeInnerHtml.get) {
    Object.defineProperty(Element.prototype, 'innerHTML', {
      configurable: true,
      enumerable: nativeInnerHtml.enumerable,
      get: nativeInnerHtml.get,
      set(value) {
        return nativeInnerHtml.set.call(this, sanitizeHtml(value));
      }
    });
  }

  const originalFetch = window.fetch.bind(window);
  window.fetch = function secureFetch(input, init) {
    const nextInit = { ...(init || {}) };
    if (!nextInit.credentials) nextInit.credentials = 'include';
    return originalFetch(input, nextInit);
  };

  const storage = window.localStorage;
  let pseudoToken = '__cookie__';
  const originalSetItem = storage.setItem.bind(storage);
  const originalGetItem = storage.getItem.bind(storage);
  const originalRemoveItem = storage.removeItem.bind(storage);

  storage.setItem = function patchedSetItem(key, value) {
    if (key === 'preditivo_token') {
      pseudoToken = String(value || '__cookie__');
      return;
    }
    return originalSetItem(key, value);
  };
  storage.getItem = function patchedGetItem(key) {
    if (key === 'preditivo_token') return pseudoToken;
    return originalGetItem(key);
  };
  storage.removeItem = function patchedRemoveItem(key) {
    if (key === 'preditivo_token') {
      pseudoToken = null;
      window.BubuyaAuth.logout(window.API);
      return;
    }
    return originalRemoveItem(key);
  };

  window.BubuyaAuth = {
    async logout(apiBase) {
      const base = apiBase || window.API || '';
      try {
        await fetch(`${base}/auth/logout`, { method: 'POST' });
      } catch (_) {}
    }
  };

  window.logoutUser = function logoutUser(apiBase) {
    window.BubuyaAuth.logout(apiBase).finally(() => {
      window.location.reload();
    });
  };
})();
