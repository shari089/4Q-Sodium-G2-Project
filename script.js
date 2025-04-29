// HOME PAGE
// handles form submission
function onLoginSubmit() {
  let username = document.getElementById("username").value;

  // validates username so that only letters and numbers are allowed
  if (!/^[a-zA-Z0-9]+$/.test(username)) {
    alert("Username can only contain letters and numbers.");
    return false;
  }

  // store username and show welcome
  localStorage.setItem("username", username);
  document.getElementById("welcome-message").innerText = `Welcome, ${username}!`;

  // change button text to "Change Username"
  const loginBtn = document.getElementById("login-btn");
  loginBtn.innerText = "Change Username";

  // always keep play button visible
  document.getElementById("play-btn").style.display = "inline-block";

  closePopup('overlay');
  return false;
}

// popups
function showLoginForm() {
  document.getElementById("overlay").style.display = "flex";
}
function showDifficultyOverlay() {
  document.getElementById("difficulty-overlay").style.display = "flex";
}
function howToPlay() {
  document.getElementById("how-to-play-overlay").style.display = "flex";
}
function closePopup(popupId) {
  document.getElementById(popupId).style.display = "none";
}

// on load, check login state & wire up nav active toggle
window.onload = function () {
  let savedUsername = localStorage.getItem("username");
  if (savedUsername) {
    document.getElementById("welcome-message").innerText = `Welcome, ${savedUsername}!`;
    document.getElementById("login-btn").innerText = "Change Username";
    document.getElementById("play-btn").style.display = "inline-block";
  }
};

//active nav bars
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-list a').forEach(link => {
    link.addEventListener('click', function () {
      document.querySelectorAll('.nav-list a').forEach(el => el.classList.remove('active'));
      this.classList.add('active');
    });
  });
});

function startGame(difficulty) {
  localStorage.setItem("level", difficulty);
  window.location.href = "game.html";
}
