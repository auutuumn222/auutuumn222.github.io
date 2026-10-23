(function () {
  'use strict';

  if (!window.matchMedia || !window.requestAnimationFrame || !window.PointerEvent) {
    return;
  }

  var mouseAvailable = window.matchMedia('(any-hover: hover) and (any-pointer: fine)');
  var dot = document.createElement('div');
  dot.className = 'glass-cursor';
  dot.setAttribute('aria-hidden', 'true');
  dot.hidden = true;
  document.body.appendChild(dot);

  var frame = null;
  var x = 0;
  var y = 0;

  function hide() {
    dot.hidden = true;
    if (frame !== null) {
      window.cancelAnimationFrame(frame);
      frame = null;
    }
  }

  document.addEventListener('pointermove', function (event) {
    if (!mouseAvailable.matches || event.pointerType !== 'mouse') {
      hide();
      return;
    }

    x = event.clientX;
    y = event.clientY;
    if (frame === null) {
      frame = window.requestAnimationFrame(function () {
        dot.style.transform = 'translate3d(' + x + 'px, ' + y + 'px, 0) translate(-50%, -50%)';
        dot.hidden = false;
        frame = null;
      });
    }
  }, { passive: true });

  document.addEventListener('pointerout', function (event) {
    if (!event.relatedTarget) {
      hide();
    }
  });
  document.addEventListener('pointerdown', function (event) {
    if (event.pointerType !== 'mouse') {
      hide();
    }
  }, { passive: true });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      hide();
    }
  });
  window.addEventListener('blur', hide);
  if (mouseAvailable.addEventListener) {
    mouseAvailable.addEventListener('change', hide);
  } else {
    mouseAvailable.addListener(hide);
  }
})();
