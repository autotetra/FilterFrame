const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "login.html";
} else {
  fetch("http://localhost:8000/api/admin/users", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status !== "success") throw data;

      const tableBody = document.getElementById("users");
      tableBody.innerHTML = "";

      data.users.forEach((user) => {
        const row = document.createElement("tr");

        // Email column
        const emailCell = document.createElement("td");
        emailCell.innerText = user.email;

        // Status dropdown
        const statusCell = document.createElement("td");
        const statusSelect = document.createElement("select");
        ["approved", "declined", "pending"].forEach((status) => {
          const option = document.createElement("option");
          option.value = status;
          option.text = status;
          if (user.status === status) option.selected = true;
          statusSelect.appendChild(option);
        });
        statusCell.appendChild(statusSelect);

        // Action button
        const actionCell = document.createElement("td");
        const updateButton = document.createElement("button");
        updateButton.innerText = "Update";
        updateButton.addEventListener("click", () => {
          const newStatus = statusSelect.value;

          fetch(`http://localhost:8000/api/admin/users/${user._id}/status`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ status: newStatus }),
          })
            .then((res) => res.json())
            .then((data) => {
              alert(data.message || "User status updated");
            })
            .catch((err) => {
              console.error("Update failed:", err);
              alert("Error updating user status");
            });
        });

        actionCell.appendChild(updateButton);

        row.appendChild(emailCell);
        row.appendChild(statusCell);
        row.appendChild(actionCell);
        tableBody.appendChild(row);
      });
    })
    .catch((err) => {
      console.error("Fetch users failed:", err);
      alert("Unauthorized or failed to fetch users");
      localStorage.removeItem("token");
      window.location.href = "login.html";
    });
}
