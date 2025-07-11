document.addEventListener("DOMContentLoaded", () => {
  const musicToggle = document.getElementById('musicToggle');
  const soundToggle = document.getElementById('soundToggle');
  const music = document.getElementById('backgroundMusic');

  let isMusicOn = true;
  let isSoundOn = true;

  if (music) {
    music.volume = 0.5;

    // Autoplay on page load
    const tryPlay = () => {
      const playPromise = music.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay might be blocked until user interacts
        });
      }
    };
    tryPlay();
  }

  // Toggle music
  if (musicToggle) {
    musicToggle.addEventListener('click', () => {
      isMusicOn = !isMusicOn;
      if (isMusicOn) {
        music.play();
        musicToggle.textContent = '🎵 Music: On';
      } else {
        music.pause();
        musicToggle.textContent = '🎵 Music: Off';
      }
    });
  }

  // Toggle sound (for future use)
  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      isSoundOn = !isSoundOn;
      soundToggle.textContent = isSoundOn ? '🔊 Sound: On' : '🔇 Sound: Off';
    });
  }

  // Optional export to other scripts
  window.isSoundOn = () => isSoundOn;
});
