(() => {
  'use strict';
  const action = document.getElementById('download-action');
  const message = document.getElementById('release-message');
  const state = document.getElementById('release-state');
  const assets = document.getElementById('release-assets');
  const hash = document.getElementById('release-hash');
  const EXPECTED_TAG = 'desktop-0.2.0-beta.1-rc2';
  const EXPECTED_MSI = 'Recline_0.2.0-beta.1_x64_en-US.msi';
  const SOURCE_REPO = '/recline-social/recline-client/releases/download/';

  function safeReleaseLink(value, filename) {
    if (typeof value !== 'string') return null;
    try {
      const url = new URL(value);
      if (url.protocol !== 'https:' || url.hostname !== 'github.com' || url.username || url.password || url.search || url.hash) return null;
      if (url.pathname !== `${SOURCE_REPO}${EXPECTED_TAG}/${filename}`) return null;
      return url.href;
    } catch { return null; }
  }
  function addLink(target, label, href) {
    const a = document.createElement('a');
    a.href = href;
    a.textContent = label;
    a.rel = 'noopener noreferrer';
    target.appendChild(a);
  }
  function setPublished(c) {
    if (!c || c.published !== true || c.tag !== EXPECTED_TAG || c.filename !== EXPECTED_MSI) return;
    if (!/^[a-fA-F0-9]{64}$/.test(c.sha256 || '')) return;
    const msi = safeReleaseLink(c.msiUrl, EXPECTED_MSI);
    const sig = safeReleaseLink(c.signatureUrl, `${EXPECTED_MSI}.asc`);
    const sums = safeReleaseLink(c.checksumsUrl, 'SHA256SUMS.txt');
    const sumsSig = safeReleaseLink(c.checksumsSignatureUrl, 'SHA256SUMS.txt.asc');
    if (!msi || !sig || !sums || !sumsSig || c.publicKeyUrl !== '/security/recline-public-key.asc') return;
    const link = document.createElement('a');
    link.href = msi;
    link.className = 'button primary download-primary';
    link.textContent = 'Download for Windows (MSI)';
    link.rel = 'noopener noreferrer';
    action.replaceChildren(link);
    addLink(action, 'Use Recline on the web', 'https://app.recline.social/');
    assets.replaceChildren();
    addLink(assets, 'Windows MSI installer', msi);
    addLink(assets, 'OpenPGP signature (.msi.asc)', sig);
    addLink(assets, 'Recline public key (.asc)', c.publicKeyUrl);
    addLink(assets, 'SHA-256 checksums', sums);
    addLink(assets, 'Checksums signature (.asc)', sumsSig);
    state.className = 'release-chip release-chip-live';
    state.textContent = 'Public beta available';
    message.textContent = 'Review the release notes, verify the installer signature, and check the fingerprint before installing. Windows may still show Unknown publisher.';
    hash.textContent = c.sha256.toLowerCase();
    document.title = 'Download Recline Desktop for Windows';
  }

  fetch('/download/release.json', { cache: 'no-store' })
    .then(r => { if (!r.ok) throw new Error('Release configuration unavailable'); return r.json(); })
    .then(setPublished)
    .catch(() => { /* Keep the safe, disabled preview if config is unavailable. */ });

  document.querySelectorAll('[data-copy], [data-copy-target]').forEach(button => {
    button.addEventListener('click', async () => {
      const target = button.getAttribute('data-copy-target');
      const text = target ? document.getElementById(target)?.textContent : button.getAttribute('data-copy');
      if (!text || !navigator.clipboard || !window.isSecureContext) return;
      try {
        await navigator.clipboard.writeText(text);
        const previous = button.textContent;
        button.textContent = 'Copied';
        button.setAttribute('aria-label', 'Copied to clipboard');
        window.setTimeout(() => { button.textContent = previous; button.removeAttribute('aria-label'); }, 1800);
      } catch { /* Manual text selection remains possible. */ }
    });
  });
})();
