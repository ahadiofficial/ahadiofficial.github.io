// Load saved settings
window.addEventListener("DOMContentLoaded", () => {
  const musicToggle = document.getElementById("musicToggle");
  const soundToggle = document.getElementById("soundToggle");
  const themeSelect = document.getElementById("themeSelect");

  musicToggle.value = localStorage.getItem("ttt_music") || "on";
  soundToggle.value = localStorage.getItem("ttt_sound") || "on";
  themeSelect.value = localStorage.getItem("ttt_theme") || "dark";
});

// Save settings
function saveSettings() {
  const music = document.getElementById("musicToggle").value;
  const sound = document.getElementById("soundToggle").value;
  const theme = document.getElementById("themeSelect").value;

  localStorage.setItem("ttt_music", music);
  localStorage.setItem("ttt_sound", sound);
  localStorage.setItem("ttt_theme", theme);

  alert("✅ Settings saved!");
}
