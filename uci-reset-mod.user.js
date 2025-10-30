// ==UserScript==
// @name         Netskope UCI Reset Mod
// @description  Adds a Reset UCI Score link beside the active user in the Incidents dashboard for Netskope Advanced Behavior Analytics
// @match        https://*.goskope.com/*
// @grant        GM_xmlhttpRequest
// @connect      *
// @version      1.0
// ==/UserScript==

(() => {
  const TENANT = 'https://example.goskope.com';   // Netskope tenant FQDN
  const TOKEN  = 'abc123def456ghi789jk';          // Netskope API token
  const API    = `${TENANT}/api/v2/incidents/users/uci/reset`;

  let lastEmail = '';

  const log = (label, data) => {
    console.groupCollapsed(`[UCI Reset] ${label}`);
    console.log(data);
    console.groupEnd();
  };

  const remove = () => document.querySelectorAll('.uci-wrapper').forEach(e => e.remove());

  const inject = () => {
    if (!location.hash.includes('/uba-analytics')) {
      remove();
      return;
    }

    const span = document.querySelector('.user-icon-text');
    if (!span) return;

    const email = span.textContent.trim();
    if (!email) return;

    // Reset indicator if we changed users
    if (lastEmail && lastEmail !== email) {
      const dot = document.querySelector('.uci-dot');
      if (dot) dot.style.backgroundColor = 'gray';
    }
    lastEmail = email;

    if (span.parentNode.querySelector('.uci-wrapper')) return;

    const wrapper = document.createElement('span');
    wrapper.className = 'uci-wrapper';
    Object.assign(wrapper.style, {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      marginLeft: '10px',
      fontFamily: 'Lato, sans-serif',
      fontSize: '14px',
      lineHeight: '1',
      verticalAlign: 'middle'
    });

    const link = document.createElement('a');
    link.textContent = 'Reset UCI Score';
    Object.assign(link.style, {
      color: '#0078d4',
      textDecoration: 'underline',
      cursor: 'pointer',
      lineHeight: '1'
    });

    const dot = document.createElement('span');
    dot.className = 'uci-dot';
    Object.assign(dot.style, {
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      backgroundColor: 'gray',
      flexShrink: '0',
      transition: 'background-color .3s ease',
      position: 'relative',
      top: '1px'
    });

    link.onclick = e => {
      e.preventDefault();
      if (!email) return;
      dot.style.backgroundColor = 'orange';

      const body = JSON.stringify({ users: [email] });
      log('POST', { url: API, body });

      GM_xmlhttpRequest({
        method: 'POST',
        url: API,
        headers: {
          'Content-Type': 'application/json',
          'Netskope-Api-Token': TOKEN
        },
        data: body,
        onload: r => {
          let parsed;
          try { parsed = JSON.parse(r.responseText); } catch { parsed = r.responseText; }
          if (r.status >= 200 && r.status < 300) {
            dot.style.backgroundColor = 'green';
            log('Success', { status: r.status, body: parsed });
          } else {
            dot.style.backgroundColor = 'red';
            log('Failure', { status: r.status, body: parsed });
          }
        },
        onerror: err => {
          dot.style.backgroundColor = 'red';
          log('Error', err);
        }
      });
    };

    wrapper.append(link, dot);
    span.after(wrapper);
  };

  new MutationObserver(inject).observe(document.body, { childList: true, subtree: true });
  window.addEventListener('hashchange', () => { lastEmail = ''; inject(); });
  inject();
})();