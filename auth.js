// SAVE during signup
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("signupUsername").value.trim();
    const password = document.getElementById("signupPassword").value;

    // Save account permanently
    localStorage.setItem("ttt_account_user", username);
    localStorage.setItem("ttt_account_pass", password);

    alert("Signup successful! Please login.");
    window.location.href = "login.html";
  });
}

// LOGIN
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value;

    const storedUser = localStorage.getItem("ttt_account_user");
    const storedPass = localStorage.getItem("ttt_account_pass");

    if (username === storedUser && password === storedPass) {
      // Save login session separately
      localStorage.setItem("ttt_session", "active");
      alert("Login successful!");
      window.location.href = "index.html";
    } else {
      alert("Incorrect username or password");
    }
  });
}
function togglePassword(inputId, toggleIcon) {
  const input = document.getElementById(inputId);
  if (input.type === "password") {
    input.type = "text";
    toggleIcon.textContent = "🙈"; // eye open
  } else {
    input.type = "password";
    toggleIcon.textContent = "👁️"; // eye closed
  }
}
