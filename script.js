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

            playMusic();
        }, 700);
    });


    /* Background music */

    async function playMusic() {
        try {
            await backgroundMusic.play();

            if (invitationOpened) {
                musicButton.classList.remove("hidden");
                musicButton.classList.add("playing");
                musicButton.setAttribute(
                    "aria-label",
                    "Pause background music"
                );
            }
        } catch (error) {
            /*
             * Music will remain hidden if the audio file
             * has not been added or cannot be played.
             */
            musicButton.classList.add("hidden");
        }
    }

    musicButton.addEventListener("click", async () => {
        if (backgroundMusic.paused) {
            try {
                await backgroundMusic.play();

                musicButton.classList.add("playing");
                musicButton.setAttribute(
                    "aria-label",
                    "Pause background music"
                );
            } catch (error) {
                musicButton.classList.remove("playing");
            }
        } else {
            backgroundMusic.pause();

            musicButton.classList.remove("playing");
            musicButton.setAttribute(
                "aria-label",
                "Play background music"
            );
        }
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