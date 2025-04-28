// Check for token
const token = localStorage.getItem("token");

if (!token) {
  // No token? Send them back to login
  window.location.href = "login.html";
} else {
  // Token exists, fetch data
  fetch("http://localhost:8000/api/frontend/records", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Fetched data:", data);

      const dataDiv = document.getElementById("data");
      dataDiv.innerHTML = ""; // Clear existing content

      data.forEach((item) => {
        const name = item.properties?.Name?.title?.[0]?.plain_text || "No Name";
        const status = item.properties?.Status?.status?.name || "No Status";

        const div = document.createElement("div");
        div.innerHTML = `
              <strong>${name}</strong><br>
              Status: ${status}
              <hr>
          `;
        dataDiv.appendChild(div);
      });
    })
    .catch((err) => {
      console.error("Error fetching data:", err);
      // Maybe clear the token and redirect to login
      localStorage.removeItem("token");
      window.location.href = "login.html";
    });
}
