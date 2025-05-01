// HOME PAGE
// handles form submission
function onLoginSubmit() {
  let username = document.getElementById("username").value.trim();

  // Check for empty input
  if (!username) {
    alert("Username cannot be empty.");
    return false;
  }

  // Validate: letters and numbers only
  if (!/^[a-zA-Z0-9]+$/.test(username)) {
    alert("Username can only contain letters and numbers.");
    return false;
  }

  // Store username and update UI
  localStorage.setItem("username", username);
  document.getElementById("welcome-message").textContent = `Welcome, ${username}!`;
  document.getElementById("login-btn").textContent = "Change Username";
  document.getElementById("play-btn").style.display = "inline-block";

  closePopup('overlay');
  return false;
}

// popup controls
function closePopup(popupId) {
  document.getElementById(popupId).style.display = "none";
}

function showDifficultyOverlay() {
  document.getElementById("difficulty-overlay").style.display = "flex";
}

function howToPlay() {
  document.getElementById("how-to-play-overlay").style.display = "flex";
}

// on load, check login state & show UI
window.onload = function () {
  let savedUsername = localStorage.getItem("username");

  if (savedUsername && savedUsername.trim() !== "") {
    document.getElementById("welcome-message").textContent = `Welcome, ${savedUsername}!`;
    document.getElementById("login-btn").textContent = "Change Username";
    document.getElementById("play-btn").style.display = "inline-block";
  }
};

// navbar active link toggle
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-list a').forEach(link => {
    link.addEventListener('click', function () {
      document.querySelectorAll('.nav-list a').forEach(el => el.classList.remove('active'));
      this.classList.add('active');
    });
  });
});

// difficulty selector
function startGame(difficulty) {
  localStorage.setItem("level", difficulty);
  window.location.href = "game.html";
}
