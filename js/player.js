/* Listening room player.
   One SoundCloud widget, created on the first press of play, drives every play button and the
   bar at the foot of the page, so playback can be paused or stopped from anywhere.
   The small SoundCloud API script is fetched when a play button is first hovered or focused
   (so the press itself can start sound within the browser's gesture window); the player
   iframe is created only on the press. */
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
  var readyTimer = null;

  host.inert = true;

  function fmt(ms) {
    var s = Math.max(0, Math.round(ms / 1000));
    return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2);
  }

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
  }

  function setBusy(id, on) {
    buttons.forEach(function (b) {
      if (b.getAttribute('data-play') !== id) return;
      if (on) b.setAttribute('aria-busy', 'true'); else b.removeAttribute('aria-busy');
    });
  }

  function showBar(t) {
    titleEl.textContent = t.title;
    linkEl.textContent = 'SoundCloud';
    linkEl.href = t.url;
    player.hidden = false;
    player.classList.remove('is-failed');
    document.body.classList.add('has-player');
  }

  function hideBar() {
    player.hidden = true;
    player.classList.remove('is-failed');
    document.body.classList.remove('has-player');
    barEl.style.width = '0%';
    timeEl.textContent = '0:00';
  }

  function armReadyTimer() {
    clearTimeout(readyTimer);
    readyTimer = setTimeout(function () {
      if (currentId && !playing) failed(currentId);
    }, 12000);
  }

  function loadApi() {
    if (window.SC && window.SC.Widget) return Promise.resolve();
    if (apiPromise) return apiPromise;
    apiPromise = new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = 'https://w.soundcloud.com/player/api.js';
      s.async = true;
      var timer = setTimeout(function () { fail(new Error('timeout')); }, 8000);
      function fail(err) { clearTimeout(timer); apiPromise = null; if (s.parentNode) s.parentNode.removeChild(s); reject(err); }
      s.onload = function () {
        clearTimeout(timer);
        if (window.SC && window.SC.Widget) resolve(); else fail(new Error('no widget api'));
      };
      s.onerror = function () { fail(new Error('load')); };
      document.head.appendChild(s);
    });
    return apiPromise;
  }

  function widgetParams() {
    return 'auto_play=true&show_artwork=false&show_user=false&show_comments=false&show_playcount=false&buying=false&sharing=false&download=false&hide_related=true&visual=false';
  }

  function createWidget(firstUrl) {
    var iframe = document.createElement('iframe');
    iframe.title = 'SoundCloud player';
    iframe.allow = 'autoplay';
    iframe.tabIndex = -1;
    iframe.src = 'https://w.soundcloud.com/player/?url=' + encodeURIComponent(firstUrl) + '&' + widgetParams();
    host.appendChild(iframe);
    try {
      widget = window.SC.Widget(iframe);
    } catch (e) {
      host.removeChild(iframe);
      widget = null;
      return false;
    }
    var E = window.SC.Widget.Events;
    widget.bind(E.READY, function () {
      clearTimeout(readyTimer);
      widget.getDuration(function (d) { durationMs = d || 0; });
      if (currentId && !playing) widget.play();
    });
    widget.bind(E.PLAY, function () {
      clearTimeout(readyTimer);
      if (!currentId) { widget.pause(); return; }
      playing = true;
      setBusy(currentId, false);
      setButtons();
    });
    widget.bind(E.PAUSE, function () { playing = false; setButtons(); });
    widget.bind(E.FINISH, function () {
      playing = false; setButtons();
      barEl.style.width = '100%';
    });
    widget.bind(E.ERROR, function () { if (currentId) failed(currentId); });
    widget.bind(E.PLAY_PROGRESS, function (e) {
      if (e && typeof e.currentPosition === 'number') {
        timeEl.textContent = fmt(e.currentPosition) + (durationMs ? ' / ' + fmt(durationMs) : '');
        if (durationMs) barEl.style.width = Math.min(100, (e.currentPosition / durationMs) * 100) + '%';
      }
    });
    return true;
  }

  function loadAndPlay(id) {
    var t = tracks[id];
    currentId = id;
    playing = false;
    durationMs = 0;
    barEl.style.width = '0%';
    timeEl.textContent = '0:00';
    showBar(t);
    setButtons();
    setBusy(id, true);
    armReadyTimer();
    if (!widget) {
      if (!createWidget(t.url)) { setBusy(id, false); failed(id); }
      return;
    }
    widget.load(t.url, {
      auto_play: true, show_artwork: false, show_user: false, show_comments: false,
      show_playcount: false, buying: false, sharing: false, download: false, hide_related: true,
      callback: function () { widget.getDuration(function (d) { durationMs = d || 0; }); }
    });
  }

  function failed(id) {
    var t = tracks[id];
    clearTimeout(readyTimer);
    currentId = id; playing = false;
    setBusy(id, false);
    showBar(t);
    player.classList.add('is-failed');
    titleEl.textContent = t.title + ': the player could not load here.';
    linkEl.textContent = 'Listen on SoundCloud';
    linkEl.href = t.url;
    setButtons();
  }

  function onPlayPress(id) {
    var t = tracks[id];
    if (!t) return;
    if (widget && currentId === id && !player.classList.contains('is-failed')) {
      widget.toggle();
      return;
    }
    if (window.SC && window.SC.Widget) { loadAndPlay(id); return; }
    setBusy(id, true);
    loadApi().then(function () {
      setBusy(id, false);
      loadAndPlay(id);
    }, function () {
      setBusy(id, false);
      failed(id);
    });
  }

  function warm() { loadApi().then(null, function () {}); }

  buttons.forEach(function (b) {
    b.addEventListener('click', function () { onPlayPress(b.getAttribute('data-play')); });
    b.addEventListener('pointerenter', warm, { once: true });
    b.addEventListener('focus', warm, { once: true });
    b.addEventListener('touchstart', warm, { once: true, passive: true });
  });

  toggle.addEventListener('click', function () {
    if (!currentId) return;
    if (widget && !player.classList.contains('is-failed')) widget.toggle();
    else onPlayPress(currentId);
  });

  stopBtn.addEventListener('click', function () {
    var id = currentId;
    currentId = null;
    playing = false;
    clearTimeout(readyTimer);
    if (widget) { try { widget.pause(); widget.seekTo(0); } catch (e) {} }
    setButtons();
    hideBar();
    var back = (id && document.querySelector('.tracks [data-play="' + id + '"]')) || buttons[0];
    if (back) back.focus();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && playing && widget) widget.pause();
  });
})();
