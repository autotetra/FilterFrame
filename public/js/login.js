const loginError = localStorage.getItem("loginError");
if (loginError) {
  document.getElementById("message").innerText = loginError;
  localStorage.removeItem("loginError");
}

document
  .getElementById("login-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.status === "success") {
        const token = data.data.token;
        const role = data.data.role;
        localStorage.setItem("token", token);
        console.log("Token Saved", token);

        if (role === "admin") {
          window.location.href = "adminDashboard.html";
        } else {
          window.location.href = "userDashboard.html";
        }
      } else {
        document.getElementById("message").innerText =
          data.message || "Login failed";
      }
    } catch (err) {
      console.error("Error connecting to server:", err);
      document.getElementById("message").innerText =
        err.message || "Network error";
    }
  });
