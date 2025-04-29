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

      const tableBody = document.getElementById("data");
      tableBody.innerHTML = ""; // Clear existing content

      data.forEach((item) => {
        const name = item.properties?.Name?.title?.[0]?.plain_text || "No Name";
        const status = item.properties?.Status?.status?.name || "No Status";

        const row = document.createElement("tr");

        // Name <input>
        const nameCell = document.createElement("td");
        const nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.value = name;
        nameCell.appendChild(nameInput);

        // Status <select>
        const statusCell = document.createElement("td");
        const statusSelect = document.createElement("select");
        ["Not Active", "In progress", "Active"].forEach((optionValue) => {
          const option = document.createElement("option");
          option.value = optionValue;
          option.text = optionValue;
          if (optionValue === status) option.selected = true;
          statusSelect.appendChild(option);
        });
        statusCell.appendChild(statusSelect);

        // Append to table
        row.appendChild(nameCell);
        row.appendChild(statusCell);
        tableBody.appendChild(row);
      });
    })
    .catch((err) => {
      console.error("Error fetching data:", err);
      // Maybe clear the token and redirect to login
      localStorage.removeItem("token");
      window.location.href = "login.html";
    });
}
