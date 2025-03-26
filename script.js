   // Function to handle form submission
    function onLoginSubmit() {
        let username = document.getElementById("username").value;

        // Validate username (only letters and numbers allowed)
        if (!/^[a-zA-Z0-9]+$/.test(username)) {
            alert("Username can only contain letters and numbers.");
            return false;
        }

        // Store username and display the welcome message
        localStorage.setItem("username", username);
        document.getElementById("welcome-message").innerText = `Welcome, ${username}!`;

        // Hide the login form (overlay) and show play button
        closePopup('overlay');
        document.getElementById("play-btn").style.display = "inline-block";
        document.getElementById("login-btn").style.display = "none";

        return false; // Prevent form from reloading the page
    }

    // Function to show the login form when the "Log in" button is clicked
    function showLoginForm() {
        document.getElementById("overlay").style.display = "flex";
    }

    // Function to show the difficulty level overlay when the "Play" button is clicked
    function showDifficultyOverlay() {
        document.getElementById("difficulty-overlay").style.display = "flex";
    }

    // Function to close any popup
    function closePopup(popupId) {
        document.getElementById(popupId).style.display = "none";
    }

    // Check if the user is already logged in and display the "Play" button
    window.onload = function() {
        let savedUsername = localStorage.getItem("username");

        if (savedUsername) {
            document.getElementById("welcome-message").innerText = `Welcome, ${savedUsername}!`;
            document.getElementById("play-btn").style.display = "inline-block";
            document.getElementById("login-btn").style.display = "none";
        }
    };
