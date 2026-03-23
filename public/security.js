(() => {
  if (window.__FUTORO_SECURITY_PATCHED__) return;
  window.__FUTORO_SECURITY_PATCHED__ = true;

  const originalFetch = window.fetch.bind(window);
  window.fetch = function secureFetch(input, init) {
    const nextInit = { ...(init || {}) };
    if (!nextInit.credentials) nextInit.credentials = 'include';
    return originalFetch(input, nextInit);
  };

  window.FutoroAuth = {
    async logout(apiBase) {
      const base = apiBase || window.API || '';
      const token = localStorage.getItem('preditivo_token');
      try {
        await originalFetch(`${base}/auth/logout`, {
          method: 'POST',
          credentials: 'include',
          headers: token
            ? { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
            : { 'Content-Type': 'application/json' }
        });
      } catch (_) {}
      localStorage.removeItem('preditivo_token');
    }
  };

  window.logoutUser = function logoutUser(apiBase) {
    window.FutoroAuth.logout(apiBase).finally(() => {
      window.location.reload();
    });
  };
})();
