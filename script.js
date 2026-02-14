/*
    Valentine's Day Website
    Logic: Pure Vanilla JavaScript for universal compatibility and performance.
    Features: Screen transitions, typing effect, particle systems, music toggle.
    Author: Gemini
*/

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. DOM Element Caching ---
    const screens = {
        opening: document.getElementById('openingScreen'),
        animatedMessage: document.getElementById('animatedMessage'),
        loveLetter: document.getElementById('loveLetter'),
        surprise: document.getElementById('surpriseSection'),
        final: document.getElementById('finalScene'),
    };

    const buttons = {
        openMessage: document.getElementById('openMessageBtn'),
        moveToLetter: document.getElementById('moveToLetterBtn'),
        showSurprise: document.getElementById('showSurpriseBtn'),
        triggerSurprise: document.getElementById('triggerSurpriseBtn'),
        moveToFinal: document.getElementById('moveToFinalBtn'),
        restart: document.getElementById('restartBtn'),
        musicToggle: document.getElementById('musicToggle'),
    };

    const containers = {
        particleBg: document.querySelector('.particle-bg'),
        cursorTrail: document.getElementById('cursor-trail-container'),
        confetti: document.getElementById('confetti-container'),
    };

    const elements = {
        typingEffect: document.querySelector('.typing-effect'),
        specialMessage: document.querySelector('.special-message'),
        musicIcon: buttons.musicToggle.querySelector('i'),
        backgroundMusic: document.getElementById('backgroundMusic'),
    };

    const loveMessage = "Sayang, makasih sudah jadi bagian penting dalam hidupku. Semoga kita selalu bisa saling jaga dan tetap bareng. Selamat Hari Valentine.";
    let isMusicPlaying = false;
    let activeScreen = screens.opening;

    // --- 2. Core Functions (Navigation, Effects) ---

    /**
     * Shows a specific screen with a smooth transition.
     * @param {HTMLElement} screenToShow - The screen element to make active.
     */
    function showScreen(screenToShow) {
        if (activeScreen) {
            activeScreen.classList.remove('active');
        }
        screenToShow.classList.add('active');
        activeScreen = screenToShow;
    }

    /**
     * Animates text with a typing effect.
     * @param {HTMLElement} element - The element to display the text in.
     * @param {string} text - The text to type out.
     */
    function typeWriter(element, text) {
        element.innerHTML = '';
        let i = 0;
        const typingInterval = setInterval(() => {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
            } else {
                clearInterval(typingInterval);
                element.style.borderRight = 'none'; // Hide caret
                buttons.moveToLetter.classList.remove('hidden'); // Show next button
            }
        }, 80);
    }

    /**
     * Creates and animates a single particle in the background.
     */
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 5 + 2; // 2px to 7px
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.animationDuration = `${Math.random() * 15 + 10}s`; // 10-25s
        particle.style.animationDelay = `${Math.random() * 5}s`;
        particle.style.opacity = Math.random() * 0.5 + 0.2; // 0.2-0.7
        containers.particleBg.appendChild(particle);

        // Remove particle from DOM after animation ends to save memory
        particle.addEventListener('animationend', () => {
            particle.remove();
        });
    }

    /**
     * Creates a burst of confetti and hearts for the surprise.
     */
    function triggerConfettiExplosion() {
        const colors = ['#e74c3c', '#ff79c6', '#ffffff', '#6a11cb'];
        for (let i = 0; i < 60; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            
            // Heart shape for some particles
            if (Math.random() > 0.7) {
                confetti.innerHTML = '❤️';
                confetti.style.background = 'transparent';
                confetti.style.fontSize = `${Math.random() * 15 + 10}px`;
            } else {
                const size = Math.random() * 8 + 4; // 4px to 12px
                confetti.style.width = `${size}px`;
                confetti.style.height = `${size}px`;
                confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            }
            
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.top = `${-20}px`; // Start from above the screen
            confetti.style.animationDelay = `${Math.random() * 0.2}s`;
            containers.confetti.appendChild(confetti);

            confetti.addEventListener('animationend', () => {
                confetti.remove();
            });
        }
    }

    // --- 3. Event Listeners ---

    // Navigation Buttons
    buttons.openMessage.addEventListener('click', () => {
        showScreen(screens.animatedMessage);
        elements.typingEffect.style.borderRight = '.15em solid var(--primary-pink)'; // Reset caret
        typeWriter(elements.typingEffect, loveMessage);

        // Attempt to play music on first user interaction
        if (!isMusicPlaying) {
            elements.backgroundMusic.play().then(() => {
                isMusicPlaying = true;
                elements.musicIcon.classList.replace('fa-play', 'fa-pause');
            }).catch(() => {
                // Autoplay was prevented, user must click the toggle manually
            });
        }
    });

    buttons.moveToLetter.addEventListener('click', () => showScreen(screens.loveLetter));
    buttons.showSurprise.addEventListener('click', () => showScreen(screens.surprise));

    buttons.triggerSurprise.addEventListener('click', () => {
        triggerConfettiExplosion();
        buttons.triggerSurprise.classList.add('hidden');
        elements.specialMessage.classList.remove('hidden');
        buttons.moveToFinal.classList.remove('hidden');
    });

    buttons.moveToFinal.addEventListener('click', () => showScreen(screens.final));

    buttons.restart.addEventListener('click', () => {
        // Reset surprise screen
        buttons.triggerSurprise.classList.remove('hidden');
        elements.specialMessage.classList.add('hidden');
        buttons.moveToFinal.classList.add('hidden');
        // Reset typing screen
        buttons.moveToLetter.classList.add('hidden');
        elements.typingEffect.innerHTML = '';
        // Go to opening screen
        showScreen(screens.opening);
    });

    // Music Toggle
    buttons.musicToggle.addEventListener('click', () => {
        if (isMusicPlaying) {
            elements.backgroundMusic.pause();
            elements.musicIcon.classList.replace('fa-pause', 'fa-play');
        } else {
            elements.backgroundMusic.play();
            elements.musicIcon.classList.replace('fa-play', 'fa-pause');
        }
        isMusicPlaying = !isMusicPlaying;
    });

    // Cursor Trail (Lightweight)
    document.addEventListener('mousemove', (e) => {
        const heart = document.createElement('div');
        heart.className = 'cursor-heart';
        heart.innerHTML = '❤️';
        heart.style.left = `${e.clientX}px`;
        heart.style.top = `${e.clientY}px`;
        containers.cursorTrail.appendChild(heart);

        heart.addEventListener('animationend', () => {
            heart.remove();
        });
    });

    // --- 4. Initialization ---

    // Start background particle system (optimized to run every 1.5 seconds)
    setInterval(createParticle, 1500);
});

