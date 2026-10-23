
"use strict";

// =====================================
// 1. SELECT HTML ELEMENTS
// =====================================

const screens = document.querySelectorAll(".screen");

const openButton = document.getElementById("openButton");
const nextButtons = document.querySelectorAll(".next-button");
const musicButton = document.getElementById("musicButton");
const restartButton = document.getElementById("restartButton");

const backgroundMusic = document.getElementById("backgroundMusic");
const birthdayVideo = document.getElementById("birthdayVideo");

const videoFrame = document.querySelector(".video-frame");
const wishStars = document.querySelectorAll(".wish-star");
const wishCount = document.getElementById("wishCount");
const wishMessage = document.getElementById("wishMessage");
const finalButton = document.getElementById("finalButton");

const envelope = document.getElementById("envelope");
const floatingStars = document.getElementById("stars");


// =====================================
// 2. WISHES
// =====================================

const wishes = [
    "May happiness find you in the smallest moments. ♡",
    "May your biggest dreams become your reality. ✨",
    "May you always have a reason to smile. ♡",
    "May the people around you appreciate your beautiful soul.",
    "May this year bring you wonderful surprises. ✨",
    "May you always be proud of how far you have come.",
    "And most importantly, may you always feel loved. ♡"
];

const discoveredWishes = new Set();


// =====================================
// 3. NAVIGATION
// =====================================

function showScreen(index) {
    if (index < 0 || index >= screens.length) {
        return;
    }

    screens.forEach(function (screen) {
        screen.classList.remove("active");
    });

    screens[index].classList.add("active");

    if (birthdayVideo && index !== 2) {
        birthdayVideo.pause();
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// =====================================
// 4. OPEN ENVELOPE
// =====================================

if (openButton) {
    openButton.addEventListener("click", function () {

        if (envelope) {
            envelope.classList.add("opened");
        }

        openButton.disabled = true;

        window.setTimeout(function () {
            showScreen(1);
            openButton.disabled = false;
        }, 350);

        // Music is optional.
        // A missing music file will not prevent navigation.
        if (backgroundMusic) {
            backgroundMusic.play().catch(function () {
                console.log("Music has not been added yet.");
            });
        }
    });
}


// =====================================
// 5. NEXT BUTTONS
// =====================================

nextButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const currentIndex = Array.from(screens).findIndex(
            function (screen) {
                return screen.classList.contains("active");
            }
        );

        showScreen(currentIndex + 1);
    });

});


// =====================================
// 6. MUSIC BUTTON
// =====================================

if (musicButton && backgroundMusic) {

    musicButton.addEventListener("click", function () {

        if (backgroundMusic.paused) {

            backgroundMusic.play()
                .then(function () {
                    musicButton.textContent = "♫ Music On";
                })
                .catch(function () {
                    musicButton.textContent = "♫ Music Unavailable";
                });

        } else {

            backgroundMusic.pause();
            musicButton.textContent = "♫ Music Off";

        }

    });

}


// =====================================
// 7. VIDEO PLACEHOLDER
// =====================================

if (birthdayVideo && videoFrame) {

    function updateVideoPlaceholder() {

        const videoSource = birthdayVideo.querySelector("source");

        if (
            videoSource &&
            birthdayVideo.readyState > 0 &&
            birthdayVideo.videoWidth > 0
        ) {
            videoFrame.classList.add("has-video");
        } else {
            videoFrame.classList.remove("has-video");
        }

    }

    birthdayVideo.addEventListener("loadeddata", updateVideoPlaceholder);
    birthdayVideo.addEventListener("error", updateVideoPlaceholder);

    updateVideoPlaceholder();

}


// =====================================
// 8. DISCOVER THE SEVEN WISHES
// =====================================

wishStars.forEach(function (star) {

    star.addEventListener("click", function () {

        const index = Number(star.dataset.wish);

        if (
            !Number.isInteger(index) ||
            index < 0 ||
            index >= wishes.length
        ) {
            return;
        }

        if (discoveredWishes.has(index)) {
            return;
        }

        discoveredWishes.add(index);

        star.classList.add("discovered");
        star.textContent = "♥";
        star.disabled = true;

        wishMessage.textContent = wishes[index];
        wishCount.textContent = discoveredWishes.size;

        if (discoveredWishes.size === wishes.length) {

            wishMessage.textContent =
                "You discovered all seven wishes! Your final surprise is ready. ♡";

            finalButton.disabled = false;

        }

    });

});


// =====================================
// 9. FINAL SURPRISE
// =====================================

if (finalButton) {

    finalButton.addEventListener("click", function () {

        if (discoveredWishes.size === wishes.length) {
            showScreen(4);
            createCelebrationStars();
        }

    });

}


// =====================================
// 10. FLOATING STARS
// =====================================

function createFloatingStar() {

    if (!floatingStars) {
        return;
    }

    const star = document.createElement("span");

    star.className = "floating-star";
    star.textContent = Math.random() > 0.5 ? "✦" : "✧";

    star.style.left = Math.random() * 100 + "%";
    star.style.bottom = "-20px";

    star.style.fontSize =
        (10 + Math.random() * 15) + "px";

    floatingStars.appendChild(star);

    window.setTimeout(function () {
        star.remove();
    }, 7000);

}

window.setInterval(createFloatingStar, 800);


// =====================================
// 11. FINAL CELEBRATION
// =====================================

let celebrationInterval = null;

function createCelebrationStars() {

    if (celebrationInterval !== null) {
        window.clearInterval(celebrationInterval);
    }

    for (let i = 0; i < 15; i++) {
        createFloatingStar();
    }

    celebrationInterval = window.setInterval(function () {

        const finalScreen = document.getElementById("finalScreen");

        if (finalScreen && finalScreen.classList.contains("active")) {
            createFloatingStar();
        } else {
            window.clearInterval(celebrationInterval);
            celebrationInterval = null;
        }

    }, 250);

}


// =====================================
// 12. RESTART
// =====================================

if (restartButton) {

    restartButton.addEventListener("click", function () {

        discoveredWishes.clear();

        wishStars.forEach(function (star, index) {

            star.classList.remove("discovered");
            star.disabled = false;
            star.textContent = index % 2 === 0 ? "✦" : "✧";

        });

        wishCount.textContent = "0";

        wishMessage.textContent =
            "Your wishes are waiting for you ♡";

        finalButton.disabled = true;

        if (birthdayVideo) {
            birthdayVideo.pause();
            birthdayVideo.currentTime = 0;
        }

        if (backgroundMusic) {
            backgroundMusic.pause();
            backgroundMusic.currentTime = 0;
        }

        if (musicButton) {
            musicButton.textContent = "♫ Music Off";
        }

        if (envelope) {
            envelope.classList.remove("opened");
        }

        showScreen(0);

    });

}


// =====================================
// 13. START WEBSITE
// =====================================

showScreen(0);

console.log("Birthday website loaded successfully! ♡");


