// handles form submission
function onLoginSubmit() {
  let username = document.getElementById("username").value;

  // validates username so that only letters and numbers are allowed
  if (!/^[a-zA-Z0-9]+$/.test(username)) {
    alert("Username can only contain letters and numbers.");
    return false;
  }

  // stores username and displays the welcome message; 
  // notes: use session storage for username, localstorage for score
  localStorage.setItem("username", username);
  document.getElementById("welcome-message").innerText = `Welcome, ${username}!`;

  // hides the login form (overlay) and shows play button
  closePopup('overlay');
  document.getElementById("play-btn").style.display = "inline-block";
  document.getElementById("login-btn").style.display = "none";

  return false; // prevents form from reloading the page
}

// shows the login form when the "log in" button is clicked
function showLoginForm() {
  document.getElementById("overlay").style.display = "flex";
}

function howToPlay() {
  document.getElementById("how-to-play-overlay").style.display = "flex";
}

// shows the difficulty level overlay when the "play" button is clicked
function showDifficultyOverlay() {
  document.getElementById("difficulty-overlay").style.display = "flex";
}

// closes pop ups
function closePopup(popupId) {
  document.getElementById(popupId).style.display = "none";
}

// checks if the user is already logged in and displays the "play" button
window.onload = function () {
  let savedUsername = localStorage.getItem("username");

  if (savedUsername) {
    document.getElementById("welcome-message").innerText = `Welcome, ${savedUsername}!`;
    document.getElementById("play-btn").style.display = "inline-block";
    document.getElementById("login-btn").style.display = "none";
  }
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.nav-list a').forEach(link => {
        link.addEventListener('click', function () {
            document.querySelectorAll('.nav-list a').forEach(el => el.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

