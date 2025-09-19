const tl = new TimelineMax();

tl.to(".container", 0.6, {
    visibility: "visible"
})
    .from(".one", 0.9, {
        opacity: 0,
        y: 10
    })
    .from(".two", 1.9, {
        opacity: 0,
        y: 10
    })
    .to(".one",
        0.9,
        {
            opacity: 0,
            y: 10
        },
        "+=3.5")
    .to(".two",
        1.9,
        {
            opacity: 0,
            y: 10
        },
        "-=1")
    .from(".three", 1.9, {
        opacity: 0,
        y: 10
    })
    .to(".three",
        0.7,
        {
            opacity: 0,
            y: 10
        },
        "+=3")
    .add(() => {
        const audio = document.querySelector('.song');
        if (!audio) { return; }
        const attemptPlay = () => audio.play();
        const onUserResume = () => {
            attemptPlay().finally(() => {
                document.removeEventListener('click', onUserResume);
                document.removeEventListener('touchstart', onUserResume);
            });
        };
        const playPromise = attemptPlay();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(() => {
                document.addEventListener('click', onUserResume, { once: true });
                document.addEventListener('touchstart', onUserResume, { once: true });
            });
        }
    })
    .add(() => {
        const images = Array.from(document.querySelectorAll('#cone img'));
        if (images.length === 0) {
            return;
        }
        let remaining = images.length;
        const resume = () => {
            remaining -= 1;
            if (remaining <= 0) {
                tl.play();
            }
        };
        let anyPending = false;
        images.forEach(img => {
            if (img.complete) {
                resume();
            } else {
                anyPending = true;
                img.addEventListener('load', resume, { once: true });
                img.addEventListener('error', resume, { once: true });
            }
        });
        if (anyPending) {
            tl.pause();
        }
    })
    .add(() => {
        const audio = document.querySelector('.song');
        if (!audio) { return; }
        const attemptPlay = () => audio.play();
        const onUserResume = () => {
            attemptPlay().finally(() => {
                document.removeEventListener('click', onUserResume);
                document.removeEventListener('touchstart', onUserResume);
            });
        };
        const playPromise = attemptPlay();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(() => {
                document.addEventListener('click', onUserResume, { once: true });
                document.addEventListener('touchstart', onUserResume, { once: true });
            });
        }
    })
    .fromTo("#cone", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.7 });
const pictures = document.querySelectorAll('.Picture');
var previousTouch = undefined;

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
    const elementX = parseInt(element.style.left || 0) + movementX;

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
    const stopFunction = () => stopDrag({ update: updateFunction, stop: stopFunction });
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