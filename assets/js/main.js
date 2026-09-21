(() => {
  const header = document.querySelector('[data-header]');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-nav]');
  const progress = document.querySelector('.reading-progress span');
  const parallax = document.querySelector('[data-parallax]');
  const year = document.querySelector('[data-year]');

  if (year) year.textContent = new Date().getFullYear();

  const setMenu = (open) => {
    menuToggle?.setAttribute('aria-expanded', String(open));
    nav?.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
  };

  menuToggle?.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    setMenu(open);
  });

  nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));

  const onScroll = () => {
    const y = window.scrollY;
    header?.classList.toggle('is-scrolled', y > 24);

    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
    if (progress) progress.style.width = `${ratio * 100}%`;

    if (parallax && window.innerWidth > 980 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const offset = Math.min(28, y * 0.025);
      parallax.style.transform = `translate3d(0, ${offset}px, 0)`;
    }
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('revealed'));
  }

  // Subtle interactive light on thematic cards (desktop only).
  document.querySelectorAll('.theme-card').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      if (window.innerWidth < 980) return;
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(157,17,24,.16), transparent 48%)`;
    });
    card.addEventListener('pointerleave', () => { card.style.background = ''; });
  });


  // Premium book-cover interaction: subtle 3D tilt + moving velvet sheen.
  const coverStage = document.querySelector('.cover-stage');
  const coverPicture = coverStage?.querySelector('picture');
  const canHoverCover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (coverStage && coverPicture && canHoverCover && !reduceMotion) {
    const updateCover = (e) => {
      const r = coverStage.getBoundingClientRect();
      const px = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      const py = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
      const rotateY = (px - 0.5) * 11;
      const rotateX = (0.5 - py) * 7;

      coverStage.style.setProperty('--cover-rx', `${rotateX.toFixed(2)}deg`);
      coverStage.style.setProperty('--cover-ry', `${rotateY.toFixed(2)}deg`);
      coverStage.style.setProperty('--shine-x', `${(px * 100).toFixed(1)}%`);
      coverStage.style.setProperty('--shine-y', `${(py * 100).toFixed(1)}%`);
      coverStage.style.setProperty('--shine-opacity', '.9');
      coverStage.classList.add('is-hovering');
    };

    const resetCover = () => {
      coverStage.style.setProperty('--cover-rx', '.6deg');
      coverStage.style.setProperty('--cover-ry', '-4deg');
      coverStage.style.setProperty('--shine-x', '50%');
      coverStage.style.setProperty('--shine-y', '44%');
      coverStage.style.setProperty('--shine-opacity', '0');
      coverStage.classList.remove('is-hovering');
    };

    coverStage.addEventListener('pointermove', updateCover);
    coverStage.addEventListener('pointerleave', resetCover);
  }


  // Reproductor doble: conversación / debate.
  const audioPlayer = document.querySelector('[data-audio-player]');
  if (audioPlayer) {
    const audio = audioPlayer.querySelector('[data-audio-element]');
    const play = audioPlayer.querySelector('[data-audio-play]');
    const back = audioPlayer.querySelector('[data-audio-back]');
    const forward = audioPlayer.querySelector('[data-audio-forward]');
    const seek = audioPlayer.querySelector('[data-audio-seek]');
    const current = audioPlayer.querySelector('[data-audio-current]');
    const duration = audioPlayer.querySelector('[data-audio-duration]');
    const status = audioPlayer.querySelector('[data-audio-status]');
    const label = audioPlayer.querySelector('[data-audio-label]');
    const meta = audioPlayer.querySelector('[data-audio-meta]');
    const speed = audioPlayer.querySelector('[data-audio-speed]');
    const volume = audioPlayer.querySelector('[data-audio-volume]');
    const volumeValue = audioPlayer.querySelector('[data-audio-volume-value]');
    const mute = audioPlayer.querySelector('[data-audio-mute]');
    const tabs = [...audioPlayer.querySelectorAll('[data-audio-tab]')];

    const tracks = {
      conversacion: { src: 'assets/audio/conversacion.mp3', label: 'Conversación', time: 0 },
      debate: { src: 'assets/audio/debate.mp3', label: 'Debate', time: 0 }
    };
    let active = 'conversacion';

    const fmt = (seconds) => {
      if (!Number.isFinite(seconds)) return '0:00';
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
      return `${mins}:${secs}`;
    };
    const fmtMinutes = (seconds) => Number.isFinite(seconds) ? `${Math.max(1, Math.round(seconds / 60))} min` : 'Audio';
    const setPlayIcon = (isPlaying) => {
      play.textContent = isPlaying ? '❙❙' : '▶';
      play.setAttribute('aria-label', isPlaying ? 'Pausar' : 'Reproducir');
    };
    const updateVolume = () => {
      const pct = Math.round(audio.volume * 100);
      volume.value = audio.volume;
      volumeValue.textContent = `${pct}%`;
      mute.textContent = audio.muted || audio.volume === 0 ? '🔇' : '🔊';
    };
    const selectTrack = (name) => {
      if (!tracks[name] || name === active) return;
      tracks[active].time = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
      audio.pause();
      setPlayIcon(false);
      active = name;
      tabs.forEach((tab) => {
        const selected = tab.dataset.audioTab === active;
        tab.classList.toggle('is-active', selected);
        tab.setAttribute('aria-selected', String(selected));
      });
      label.textContent = tracks[active].label;
      meta.textContent = 'Audio';
      current.textContent = '0:00';
      duration.textContent = '0:00';
      seek.value = 0;
      status.textContent = 'Cargando audio…';
      audio.src = tracks[active].src;
      audio.load();
    };

    audio.volume = 1;
    audio.playbackRate = 1;
    updateVolume();

    tabs.forEach((tab) => tab.addEventListener('click', () => selectTrack(tab.dataset.audioTab)));
    speed.addEventListener('change', () => { audio.playbackRate = Number(speed.value); });
    volume.addEventListener('input', () => {
      audio.volume = Number(volume.value);
      audio.muted = audio.volume === 0;
      updateVolume();
    });
    mute.addEventListener('click', () => {
      audio.muted = !audio.muted;
      if (!audio.muted && audio.volume === 0) audio.volume = .7;
      updateVolume();
    });

    audio.addEventListener('loadedmetadata', () => {
      duration.textContent = fmt(audio.duration);
      meta.textContent = fmtMinutes(audio.duration);
      const resumeAt = tracks[active].time;
      if (resumeAt > 0 && resumeAt < audio.duration) audio.currentTime = resumeAt;
      status.textContent = 'Preparado para reproducir';
    });
    audio.addEventListener('timeupdate', () => {
      current.textContent = fmt(audio.currentTime);
      if (audio.duration) seek.value = (audio.currentTime / audio.duration) * 100;
    });
    audio.addEventListener('ended', () => {
      setPlayIcon(false);
      status.textContent = 'Finalizado';
      tracks[active].time = 0;
    });
    audio.addEventListener('error', () => {
      setPlayIcon(false);
      meta.textContent = 'Próximamente';
      status.textContent = 'Audio disponible próximamente';
    });
    play.addEventListener('click', () => {
      if (audio.paused) {
        audio.play().then(() => {
          setPlayIcon(true);
          status.textContent = 'Reproduciendo…';
        }).catch(() => {
          setPlayIcon(false);
          status.textContent = 'Audio disponible próximamente';
        });
      } else {
        audio.pause();
        setPlayIcon(false);
        status.textContent = 'En pausa';
      }
    });
    back.addEventListener('click', () => { audio.currentTime = Math.max(0, audio.currentTime - 15); });
    forward.addEventListener('click', () => {
      if (audio.duration) audio.currentTime = Math.min(audio.duration, audio.currentTime + 15);
    });
    seek.addEventListener('input', () => {
      if (audio.duration) audio.currentTime = (Number(seek.value) / 100) * audio.duration;
    });
  }

})();
