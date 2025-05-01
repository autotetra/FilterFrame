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
        localStorage.setItem("token", data.data.token);
        console.log("Token Saved", data.data.token);
        window.location.href = "dashboard.html";
      } else {
        document.getElementById("message").innerText =
          data.message || "Login failed";
      }
    } catch (err) {
      console.error("Error connecting to server:", err);
      document.getElementById("message").innerText = "Network error";
    }
  });
