/* Listening room player.
   One audio element, created on the first press of play, drives every play button and the
   bar at the foot of the page, so playback can be paused, scrubbed or stopped from anywhere.
   The recordings are files in audio/, served by this site. Nothing is fetched until a press.
   To move the recordings to a bucket later, change AUDIO_BASE and nothing else. */
(function () {
  'use strict';

  var AUDIO_BASE = 'audio/';

  var tracks = {};
  document.querySelectorAll('[data-track]').forEach(function (el) {
    tracks[el.getAttribute('data-track')] = {
      el: el,
      src: AUDIO_BASE + el.getAttribute('data-src'),
      title: el.getAttribute('data-title'),
      details: el.getAttribute('data-details')
    };
  });

  var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-play]'));
  var videos = Array.prototype.slice.call(document.querySelectorAll('video'));
  var player = document.getElementById('player');
  var toggle = document.getElementById('player-toggle');
  var stopBtn = document.getElementById('player-stop');
  var titleEl = document.getElementById('player-title');
  var timeEl = document.getElementById('player-time');
  var barEl = document.getElementById('player-bar');
  var seekEl = document.getElementById('player-seek');
  var linkEl = document.getElementById('player-link');

  var audio = null;
  var currentId = null;
  var playing = false;
  var seeking = false;

  function fmt(sec) {
    var s = Math.max(0, Math.round(sec));
    return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2);
  }

  function isFailed() { return player.classList.contains('is-failed'); }

  function setButtons() {
    buttons.forEach(function (b) {
      var mine = b.getAttribute('data-play') === currentId;
      b.setAttribute('aria-pressed', mine && playing ? 'true' : 'false');
    });
    Object.keys(tracks).forEach(function (id) {
      tracks[id].el.classList.toggle('is-playing', id === currentId && playing);
    });
    player.classList.toggle('is-paused', !playing);
    toggle.setAttribute('aria-label', playing ? 'Pause' : 'Play');
    if ('mediaSession' in navigator) navigator.mediaSession.playbackState = playing ? 'playing' : 'paused';
  }

  function setBusy(id, on) {
    buttons.forEach(function (b) {
      if (b.getAttribute('data-play') !== id) return;
      if (on) b.setAttribute('aria-busy', 'true'); else b.removeAttribute('aria-busy');
    });
  }

  function setProgress(pos, dur) {
    var ok = isFinite(dur) && dur > 0;
    timeEl.textContent = fmt(pos) + (ok ? ' / ' + fmt(dur) : '');
    barEl.style.width = (ok ? Math.min(100, (pos / dur) * 100) : 0) + '%';
    seekEl.disabled = !ok;
    if (ok && !seeking) seekEl.value = Math.round((pos / dur) * 1000);
    seekEl.setAttribute('aria-valuetext', ok ? fmt(pos) + ' of ' + fmt(dur) : '0:00');
  }

  function showBar(t) {
    titleEl.textContent = t.title;
    if (t.details) { linkEl.href = t.details; linkEl.hidden = false; } else { linkEl.hidden = true; }
    player.hidden = false;
    player.classList.remove('is-failed');
    document.body.classList.add('has-player');
  }

  function hideBar() {
    player.hidden = true;
    player.classList.remove('is-failed');
    document.body.classList.remove('has-player');
    setProgress(0, 0);
  }

  function setSession(t) {
    if (!('mediaSession' in navigator) || !window.MediaMetadata) return;
    navigator.mediaSession.metadata = new window.MediaMetadata({
      title: t.title,
      artist: 'Levant Noir',
      artwork: [{ src: 'images/og.jpg', sizes: '1200x630', type: 'image/jpeg' }]
    });
  }

  function createAudio() {
    audio = new Audio();
    audio.preload = 'auto';
    audio.addEventListener('playing', function () {
      if (!currentId) { audio.pause(); return; }
      playing = true;
      setBusy(currentId, false);
      setButtons();
      videos.forEach(function (v) { v.pause(); });
    });
    audio.addEventListener('waiting', function () { if (currentId) setBusy(currentId, true); });
    audio.addEventListener('pause', function () { playing = false; setButtons(); });
    audio.addEventListener('ended', function () {
      playing = false; setButtons();
      setProgress(audio.duration, audio.duration);
    });
    audio.addEventListener('error', function () { if (currentId) failed(currentId); });
    audio.addEventListener('timeupdate', function () { setProgress(audio.currentTime, audio.duration); });
    audio.addEventListener('durationchange', function () { setProgress(audio.currentTime, audio.duration); });

    if ('mediaSession' in navigator) {
      var ms = navigator.mediaSession;
      try {
        ms.setActionHandler('play', function () { audio.play(); });
        ms.setActionHandler('pause', function () { audio.pause(); });
        ms.setActionHandler('stop', stop);
        ms.setActionHandler('seekto', function (e) { if (typeof e.seekTime === 'number') audio.currentTime = e.seekTime; });
      } catch (e) {}
    }
  }

  function play() {
    var p = audio.play();
    if (p && p.catch) p.catch(function (err) {
      /* a newer press interrupts the pending one; only a real refusal is a failure */
      if (err && err.name === 'AbortError') return;
      if (currentId) failed(currentId);
    });
  }

  function loadAndPlay(id) {
    var t = tracks[id];
    if (!audio) createAudio();
    currentId = id;
    playing = false;
    showBar(t);
    setProgress(0, 0);
    setButtons();
    setBusy(id, true);
    setSession(t);
    audio.src = t.src;
    play();
  }

  function failed(id) {
    var t = tracks[id];
    currentId = id; playing = false;
    setBusy(id, false);
    showBar(t);
    player.classList.add('is-failed');
    titleEl.textContent = t.title + ': the recording could not load. Press play to try again.';
    setButtons();
  }

  function onPlayPress(id) {
    if (!tracks[id]) return;
    if (audio && currentId === id && !isFailed()) {
      if (audio.paused) play(); else audio.pause();
      return;
    }
    loadAndPlay(id);
  }

  function stop() {
    var id = currentId;
    currentId = null;
    playing = false;
    if (audio) { audio.pause(); audio.removeAttribute('src'); audio.load(); }
    if (id) setBusy(id, false);
    setButtons();
    hideBar();
    var back = (id && document.querySelector('.tracks [data-play="' + id + '"]')) || buttons[0];
    if (back) back.focus();
  }

  buttons.forEach(function (b) {
    b.addEventListener('click', function () { onPlayPress(b.getAttribute('data-play')); });
  });

  toggle.addEventListener('click', function () { if (currentId) onPlayPress(currentId); });
  stopBtn.addEventListener('click', stop);

  seekEl.addEventListener('input', function () {
    if (!audio || !isFinite(audio.duration)) return;
    seeking = true;
    setProgress((seekEl.value / 1000) * audio.duration, audio.duration);
  });
  seekEl.addEventListener('change', function () {
    if (audio && isFinite(audio.duration)) audio.currentTime = (seekEl.value / 1000) * audio.duration;
    seeking = false;
  });

  /* A film and the bar never sound together. */
  videos.forEach(function (v) {
    v.addEventListener('play', function () {
      if (audio && !audio.paused) audio.pause();
      videos.forEach(function (o) { if (o !== v) o.pause(); });
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && playing && audio) audio.pause();
  });
})();
