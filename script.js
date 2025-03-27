   // handles form submission
    function onLoginSubmit() {
        let username = document.getElementById("username").value;

        // validates username so that only letters and numbers are allowed
        if (!/^[a-zA-Z0-9]+$/.test(username)) {
            alert("Username can only contain letters and numbers.");
            return false;
        }

        // stores username and displays the welcome message
        localStorage.setItem("username", username);
        document.getElementById("welcome-message").innerText = `Welcome, ${username}!`;

        // hides the login form (overlay) and show play button
        closePopup('overlay');
        document.getElementById("play-btn").style.display = "inline-block";
        document.getElementById("login-btn").style.display = "none";

        return false; // prevents form from reloading the page
    }

    // shows the login form when the "log in" button is clicked
    function showLoginForm() {
        document.getElementById("overlay").style.display = "flex";
    }

    // shows the difficulty level overlay when the "pklay" button is clicked
    function showDifficultyOverlay() {
        document.getElementById("difficulty-overlay").style.display = "flex";
    }

    // closes pop ups
    function closePopup(popupId) {
        document.getElementById(popupId).style.display = "none";
    }

    // checks if the user is already logged in and displays the "play" button
    window.onload = function() {
        let savedUsername = localStorage.getItem("username");

        if (savedUsername) {
            document.getElementById("welcome-message").innerText = `Welcome, ${savedUsername}!`;
            document.getElementById("play-btn").style.display = "inline-block";
            document.getElementById("login-btn").style.display = "none";
        }
    };
