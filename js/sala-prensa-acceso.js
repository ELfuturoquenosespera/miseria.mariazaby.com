(() => {
  'use strict';
  const body = document.body;
  const form = document.querySelector('#press-code-form');
  const input = document.querySelector('#press-code');
  const error = document.querySelector('#press-code-error');
  const locked = document.querySelector('#press-locked');
  const unlocked = document.querySelector('#press-unlocked');
  const frame = document.querySelector('#press-pdf-frame');
  const open = document.querySelector('#press-open-pdf');
  const download = document.querySelector('#press-download-pdf');
  const doc = body.dataset.pressPdf;
  const saveName = body.dataset.pressDownload;
  const key = 'miseria_press_room_access_2026';
  if (!form || !input || !locked || !unlocked || !doc) return;

  function reveal() {
    error.textContent = '';
    locked.hidden = true;
    unlocked.hidden = false;
    frame.src = doc + '#view=FitH&toolbar=1';
    open.href = doc;
    download.href = doc;
    download.setAttribute('download', saveName || 'miseria-dossier.pdf');
    try { sessionStorage.setItem(key, 'yes'); } catch (_) {}
    requestAnimationFrame(() => document.querySelector('#press-doc-title')?.focus({preventScroll: true}));
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (input.value.trim() === '2026') reveal();
    else { error.textContent = body.dataset.pressError || 'Incorrect code'; input.select(); input.focus(); }
  });

  try { if (sessionStorage.getItem(key) === 'yes') reveal(); } catch (_) {}
})();
