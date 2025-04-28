document
  .getElementById("login-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent form from submitting normally

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

      if (response.ok) {
        localStorage.setItem("token", data.token);
        console.log("Token Saved", data.token);
        // Redirect to dashboard
        window.location.href = "dashboard.html";
      } else {
        document.getElementById("message").innerText =
          data.message || "Login failed";
      }
    } catch (err) {
      console.error("Error:", err);
      document.getElementById("message").innerText =
        "Error connecting to server";
    }
  });
