document.addEventListener("DOMContentLoaded", () => {
    const openingScreen = document.getElementById("opening");
    const invitation = document.getElementById("invitation");
    const openButton = document.getElementById("open-invitation");

    const guestName = document.getElementById("guest-name");

    const musicButton = document.getElementById("music-button");
    const backgroundMusic = document.getElementById("background-music");

    const daysElement = document.getElementById("days");
    const hoursElement = document.getElementById("hours");
    const minutesElement = document.getElementById("minutes");
    const secondsElement = document.getElementById("seconds");

    let invitationOpened = false;


    /* Guest name from URL */

    const urlParameters = new URLSearchParams(window.location.search);
    const guest = urlParameters.get("to");

    if (guest && guest.trim() !== "") {
        guestName.textContent = guest.trim();
    }


    /* Open invitation */

    openingScreen.style.transition = "opacity 0.7s ease";

    openButton.addEventListener("click", () => {
    openButton.disabled = true;

    openingScreen.style.opacity = "0";

    setTimeout(() => {
        openingScreen.classList.add("hidden");
        invitation.classList.remove("hidden");

        document.body.classList.add("invitation-open");

        invitationOpened = true;
        window.scrollTo(0, 0);

        if (!backgroundMusic.paused) {
            musicButton.classList.remove("hidden");
            musicButton.classList.add("playing");
        }
    }, 700);
});


    /* Background music */
/* Background music */

function updateMusicButton(isPlaying) {
    musicButton.classList.remove("hidden");
    musicButton.textContent = isPlaying ? "❚❚" : "▶";
    musicButton.classList.toggle("playing", isPlaying);

    musicButton.setAttribute(
        "aria-label",
        isPlaying
            ? "Pause background music"
            : "Play background music"
    );
}

async function playMusic() {
    musicButton.classList.remove("hidden");
    backgroundMusic.muted = false;

    try {
        await backgroundMusic.play();
        updateMusicButton(true);
    } catch (error) {
        updateMusicButton(false);
        console.error("Music playback failed:", error);
    }
}

function pauseMusic() {
    backgroundMusic.pause();
    updateMusicButton(false);
}

musicButton.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (backgroundMusic.paused || backgroundMusic.ended) {
        await playMusic();
    } else {
        pauseMusic();
    }
});

backgroundMusic.addEventListener("play", () => {
    updateMusicButton(true);
});

backgroundMusic.addEventListener("pause", () => {
    updateMusicButton(false);
});

backgroundMusic.addEventListener("error", () => {
    updateMusicButton(false);
    console.error("Audio file error:", backgroundMusic.error);
});

    /* Wedding countdown */

    const weddingDate = new Date(
        "2027-10-27T00:00:00+07:00"
    ).getTime();

    function formatNumber(number) {
        return String(number).padStart(2, "0");
    }

    function updateCountdown() {
        const currentTime = new Date().getTime();
        const distance = weddingDate - currentTime;

        if (distance <= 0) {
            daysElement.textContent = "00";
            hoursElement.textContent = "00";
            minutesElement.textContent = "00";
            secondsElement.textContent = "00";

            clearInterval(countdownInterval);
            return;
        }

        const days = Math.floor(
            distance / (1000 * 60 * 60 * 24)
        );

        const hours = Math.floor(
            (distance % (1000 * 60 * 60 * 24)) /
            (1000 * 60 * 60)
        );

        const minutes = Math.floor(
            (distance % (1000 * 60 * 60)) /
            (1000 * 60)
        );

        const seconds = Math.floor(
            (distance % (1000 * 60)) / 1000
        );

        daysElement.textContent = formatNumber(days);
        hoursElement.textContent = formatNumber(hours);
        minutesElement.textContent = formatNumber(minutes);
        secondsElement.textContent = formatNumber(seconds);
    }

    updateCountdown();

    const countdownInterval = setInterval(
        updateCountdown,
        1000
    );


    /* Scroll reveal animation */

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!reduceMotion && "IntersectionObserver" in window) {
        const revealElements = document.querySelectorAll(
            ".section h2, " +
            ".section .description, " +
            ".couple-container, " +
            ".countdown, " +
            ".event-card, " +
            ".gallery-grid, " +
            ".closing-monogram"
        );

        revealElements.forEach((element) => {
            element.style.opacity = "0";
            element.style.transform = "translateY(28px)";
            element.style.transition =
                "opacity 0.8s ease, transform 0.8s ease";
        });

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = "1";
                        entry.target.style.transform =
                            "translateY(0)";

                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.15
            }
        );

        revealElements.forEach((element) => {
            observer.observe(element);
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
        return;
    }


    /* Floating golden petals */

    const petalsContainer = document.createElement("div");
    petalsContainer.className = "floating-petals";
    petalsContainer.setAttribute("aria-hidden", "true");

    document.body.appendChild(petalsContainer);

    const totalPetals = 22;

    for (let index = 0; index < totalPetals; index += 1) {
        const petal = document.createElement("span");
        const size = 7 + Math.random() * 7;
        const drift = -90 + Math.random() * 180;

        petal.className = "gold-petal";

        petal.style.left = `${Math.random() * 100}%`;
        petal.style.width = `${size}px`;
        petal.style.height = `${size * 1.65}px`;
        petal.style.animationDuration =
            `${9 + Math.random() * 9}s`;
        petal.style.animationDelay =
            `${Math.random() * -18}s`;
        petal.style.setProperty("--drift", `${drift}px`);

        petalsContainer.appendChild(petal);
    }


    /* Scroll progress */

    const scrollProgress = document.createElement("div");
    scrollProgress.className = "scroll-progress";

    document.body.appendChild(scrollProgress);

    function updateScrollProgress() {
        const maximumScroll =
            document.documentElement.scrollHeight -
            window.innerHeight;

        const progress =
            maximumScroll > 0
                ? window.scrollY / maximumScroll
                : 0;

        scrollProgress.style.transform =
            `scaleX(${Math.min(progress, 1)})`;
    }

    window.addEventListener(
        "scroll",
        updateScrollProgress,
        { passive: true }
    );


    /* Hero parallax for mouse devices */

    const hero = document.querySelector(".hero");
    const heroContent = document.querySelector(".hero-content");

    const supportsMouse = window.matchMedia(
        "(pointer: fine)"
    ).matches;

    if (hero && heroContent && supportsMouse) {
        hero.addEventListener("pointermove", (event) => {
            const rectangle = hero.getBoundingClientRect();

            const horizontalPosition =
                (event.clientX - rectangle.left) /
                rectangle.width -
                0.5;

            const verticalPosition =
                (event.clientY - rectangle.top) /
                rectangle.height -
                0.5;

            heroContent.style.transform =
                `translate3d(
                    ${horizontalPosition * 18}px,
                    ${verticalPosition * 18}px,
                    0
                )`;
        });

        hero.addEventListener("pointerleave", () => {
            heroContent.style.transform =
                "translate3d(0, 0, 0)";
        });
    }
});