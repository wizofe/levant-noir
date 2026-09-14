/* Listening room player.
   One SoundCloud widget (created only after the first press of play), custom controls,
   and a persistent bar so playback can be paused or stopped from anywhere on the page.
   Nothing loads from SoundCloud until the visitor asks for sound. */
(function () {
  'use strict';

  var tracks = {};
  document.querySelectorAll('[data-track]').forEach(function (el) {
    tracks[el.getAttribute('data-track')] = {
      el: el,
      url: el.getAttribute('data-url'),
      title: el.getAttribute('data-title')
    };
  });

  var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-play]'));
  var player = document.getElementById('player');
  var toggle = document.getElementById('player-toggle');
  var stopBtn = document.getElementById('player-stop');
  var titleEl = document.getElementById('player-title');
  var timeEl = document.getElementById('player-time');
  var barEl = document.getElementById('player-bar');
  var linkEl = document.getElementById('player-link');
  var host = document.getElementById('sc-host');

  var widget = null;
  var apiPromise = null;
  var currentId = null;
  var playing = false;
  var durationMs = 0;

  function fmt(ms) {
    var s = Math.max(0, Math.round(ms / 1000));
    return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2);
  }

  function setButtons() {
    buttons.forEach(function (b) {
      var mine = b.getAttribute('data-play') === currentId;
      b.setAttribute('aria-pressed', mine && playing ? 'true' : 'false');
      var t = tracks[b.getAttribute('data-play')];
      if (t) b.setAttribute('aria-label', (mine && playing ? 'Pause ' : 'Play ') + t.title);
    });
    Object.keys(tracks).forEach(function (id) {
      tracks[id].el.classList.toggle('is-playing', id === currentId && playing);
    });
    player.classList.toggle('is-paused', !playing);
    toggle.setAttribute('aria-label', playing ? 'Pause' : 'Play');
  }

  function showBar(t) {
    titleEl.textContent = t.title;
    linkEl.href = t.url;
    player.hidden = false;
    player.classList.remove('is-failed');
    document.body.classList.add('has-player');
  }

  function hideBar() {
    player.hidden = true;
    document.body.classList.remove('has-player');
    barEl.style.width = '0%';
    timeEl.textContent = '0:00';
  }

  function loadApi() {
    if (apiPromise) return apiPromise;
    apiPromise = new Promise(function (resolve, reject) {
      if (window.SC && window.SC.Widget) return resolve();
      var s = document.createElement('script');
      s.src = 'https://w.soundcloud.com/player/api.js';
      s.async = true;
      var timer = setTimeout(function () { reject(new Error('timeout')); }, 8000);
      s.onload = function () { clearTimeout(timer); resolve(); };
      s.onerror = function () { clearTimeout(timer); reject(new Error('load')); };
      document.head.appendChild(s);
    });
    return apiPromise;
  }

  function ensureWidget(firstUrl) {
    if (widget) return widget;
    var iframe = document.createElement('iframe');
    iframe.title = 'SoundCloud player';
    iframe.allow = 'autoplay';
    iframe.src = 'https://w.soundcloud.com/player/?url=' + encodeURIComponent(firstUrl) +
      '&auto_play=false&show_artwork=false&show_user=false&show_comments=false&show_playcount=false&buying=false&sharing=false&download=false&hide_related=true&visual=false';
    host.appendChild(iframe);
    widget = window.SC.Widget(iframe);
    var E = window.SC.Widget.Events;
    widget.bind(E.PLAY, function () { playing = true; setButtons(); });
    widget.bind(E.PAUSE, function () { playing = false; setButtons(); });
    widget.bind(E.FINISH, function () {
      playing = false; setButtons();
      barEl.style.width = '100%';
    });
    widget.bind(E.PLAY_PROGRESS, function (e) {
      if (e && typeof e.currentPosition === 'number') {
        timeEl.textContent = fmt(e.currentPosition) + (durationMs ? ' / ' + fmt(durationMs) : '');
        if (durationMs) barEl.style.width = Math.min(100, (e.currentPosition / durationMs) * 100) + '%';
      }
    });
    widget.bind(E.READY, function () {
      widget.getDuration(function (d) { durationMs = d || 0; });
    });
    return widget;
  }

  function loadAndPlay(id) {
    var t = tracks[id];
    currentId = id;
    durationMs = 0;
    barEl.style.width = '0%';
    timeEl.textContent = '0:00';
    showBar(t);
    setButtons();
    ensureWidget(t.url);
    widget.load(t.url, {
      auto_play: true, show_artwork: false, show_user: false, show_comments: false,
      show_playcount: false, buying: false, sharing: false, download: false, hide_related: true,
      callback: function () { widget.getDuration(function (d) { durationMs = d || 0; }); }
    });
  }

  function failed(id) {
    var t = tracks[id];
    currentId = id; playing = false;
    showBar(t);
    player.classList.add('is-failed');
    titleEl.textContent = t.title + ' · the player could not load here; listen on SoundCloud';
    setButtons();
  }

  function onPlayPress(id) {
    var t = tracks[id];
    if (!t) return;
    if (widget && currentId === id) {
      widget.toggle();
      return;
    }
    if (window.SC && window.SC.Widget) { loadAndPlay(id); return; }
    var pressed = buttons.filter(function (b) { return b.getAttribute('data-play') === id; });
    pressed.forEach(function (b) { b.setAttribute('aria-busy', 'true'); });
    loadApi().then(function () {
      pressed.forEach(function (b) { b.removeAttribute('aria-busy'); });
      loadAndPlay(id);
    }, function () {
      pressed.forEach(function (b) { b.removeAttribute('aria-busy'); });
      failed(id);
    });
  }

  buttons.forEach(function (b) {
    b.addEventListener('click', function () { onPlayPress(b.getAttribute('data-play')); });
  });

  toggle.addEventListener('click', function () {
    if (widget) widget.toggle();
    else if (currentId) onPlayPress(currentId);
  });

  stopBtn.addEventListener('click', function () {
    if (widget) { widget.pause(); widget.seekTo(0); }
    playing = false; currentId = null;
    setButtons();
    hideBar();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !player.hidden && playing) { widget && widget.pause(); }
  });
})();
