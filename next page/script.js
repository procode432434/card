const pictures = document.querySelectorAll('.Picture');
var previousTouch = undefined;

// Auto-play audio safely without user interaction
window.addEventListener('load', () => {
  const audio = document.querySelector('audio');
  if (!audio) return;
  try {
    audio.muted = true;
    audio.volume = 0;
    const p = audio.play();
    if (p && typeof p.catch === 'function') {
      p.catch(() => {});
    }
    let step = 0;
    const steps = 20;
    const interval = setInterval(() => {
      step += 1;
      audio.volume = Math.min(1, step / steps);
      if (step >= steps) {
        clearInterval(interval);
        audio.muted = false;
      }
    }, 100);
  } catch (_) {}
});

function updateElementPosition(element, event) {
  var movementX, movementY;

  if (event.type === 'touchmove') {
    const touch = event.touches[0];
    movementX = previousTouch ? touch.clientX - previousTouch.clientX : 0;
    movementY = previousTouch ? touch.clientY - previousTouch.clientY : 0;
    console.log('touch', { movementX: movementX, newX: touch.clientX, oldX: previousTouch && previousTouch.clientX });
    previousTouch = touch;
  } else {
    movementX = event.movementX;
    movementY = event.movementY;
  }
  
  const elementY = parseInt(element.style.top || 0) + movementY;
  const elementX = parseInt(element.style.left|| 0) + movementX;

  element.style.top = elementY + "px";
  element.style.left = elementX + "px";
}

function startDrag(element, event) {
  if (event.type === 'touchstart') {
    if (event.touches && event.touches[0]) {
      previousTouch = event.touches[0];
    }
  }
  const updateFunction = (event) => {
    if (event.cancelable) { event.preventDefault(); }
    updateElementPosition(element, event);
  };
  const stopFunction = () => stopDrag({update: updateFunction, stop: stopFunction});
  document.addEventListener("mousemove", updateFunction, { passive: false });
  document.addEventListener("touchmove", updateFunction, { passive: false });
  document.addEventListener("mouseup", stopFunction, { passive: true });
  document.addEventListener("touchend", stopFunction, { passive: true });
}

function stopDrag(functions) {
  previousTouch = undefined;
  document.removeEventListener("mousemove", functions.update, { passive: false });
  document.removeEventListener("touchmove", functions.update, { passive: false });
  document.removeEventListener("mouseup", functions.stop, { passive: true });
  document.removeEventListener("touchend", functions.stop, { passive: true });
}

pictures.forEach(picture => {
  const range = 100;
  const randomX = Math.random() * (range * 2) - range;
  const randomY = Math.random() * (range * 2) - range;
  const randomRotate = Math.random() * (range / 2) - range / 4;
  const startFunction = (event) => {
    if (event.cancelable) { event.preventDefault(); }
    startDrag(picture, event);
  };
  picture.style.top = `${randomY}px`;
  picture.style.left = `${randomX}px`;
  picture.style.transform = `translate(-50%, -50%) rotate(${randomRotate}deg)`;
  picture.addEventListener("mousedown", startFunction, { passive: false });
  picture.addEventListener("touchstart", startFunction, { passive: false });
});