  const SEC = {
    s1: { total:2, cur:0 },
    s2: { total:2, cur:0 },
    s3: { total:2, cur:0 },
    s4: { total:2, cur:0 },
    s5: { total:2, cur:0 },
    s6: { total:2, cur:0 },
  };

  // Build dots
  document.addEventListener('DOMContentLoaded', () => {
    Object.keys(SEC).forEach(id => {
      const wrap = document.getElementById(id + '-dots');
      for (let i = 0; i < SEC[id].total; i++) {
        const d = document.createElement('button');
        d.className = 'sdot' + (i === 0 ? ' active' : '');
        d.setAttribute('aria-label', 'Slide ' + (i+1));
        d.onclick = () => goSlide(id, i);
        wrap.appendChild(d);
      }
    });
  });

  function goSlide(id, n) {
    const s = SEC[id];
    if (n < 0 || n >= s.total) return;
    s.cur = n;
    document.getElementById(id + '-track').style.transform = `translateX(-${n * 100}vw)`;
    document.getElementById(id + '-cnt').textContent   = `${n+1} / ${s.total}`;
    document.getElementById(id + '-prev').disabled     = (n === 0);
    document.getElementById(id + '-next').disabled     = (n === s.total - 1);
    document.querySelectorAll(`#${id}-dots .sdot`).forEach((d,i) => d.classList.toggle('active', i===n));
    // update progress bar
    const pb = document.getElementById('prog-' + id);
    if (pb) pb.style.width = ((n+1)/s.total*100) + '%';
  }

  function sNav(id, dir) { goSlide(id, SEC[id].cur + dir); }

  // ── Screen transitions ──
  let activeScreen = 'cover';
  let activeSection = null;

  function show(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    activeScreen = id;
  }

  function enterLobby() { show('lobby'); }
  function exitLobby() { show('cover'); }

  function openSection(id) {
    goSlide(id, 0);
    show(id);
    activeSection = id;
  }

  function backToLobby() {
    show('lobby');
    activeSection = null;
  }

  // ── Keyboard ──
  document.addEventListener('keydown', e => {
    if (activeScreen === 'cover' && (e.key === 'Enter' || e.key === 'ArrowRight')) {
      enterLobby();
    } else if (activeSection) {
      if (e.key === 'ArrowRight') sNav(activeSection, 1);
      if (e.key === 'ArrowLeft')  sNav(activeSection, -1);
      if (e.key === 'Escape')     backToLobby();
    } else if (activeScreen === 'lobby' && e.key === 'Escape') {
      // already in lobby, nothing to do
    }
  });

  // ── Touch swipe ──
  let tx0 = null;
  document.addEventListener('touchstart', e => { tx0 = e.touches[0].clientX; }, {passive:true});
  document.addEventListener('touchend',   e => {
    if (tx0 === null || !activeSection) return;
    const dx = tx0 - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 48) sNav(activeSection, dx > 0 ? 1 : -1);
    tx0 = null;
  });

  // (s2 parallax removed — no longer applicable)