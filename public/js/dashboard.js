// Check for token
const token = localStorage.getItem("token");

if (!token) {
  // No token? Redirect to login
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
      if (data.status !== "success") throw data;

      const tableBody = document.getElementById("data");
      tableBody.innerHTML = ""; // Clear existing content

      data.data.forEach((item) => {
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

        // Save button
        const actionCell = document.createElement("td");
        const saveButton = document.createElement("button");
        saveButton.innerText = "Save";

        saveButton.addEventListener("click", () => {
          const updatedName = nameInput.value;
          const updatedStatus = statusSelect.value;

          fetch(`http://localhost:8000/api/frontend/update/${item.id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              properties: {
                Name: {
                  title: [
                    {
                      text: {
                        content: updatedName,
                      },
                    },
                  ],
                },
                Status: {
                  status: {
                    name: updatedStatus,
                  },
                },
              },
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              alert(data.message || "Record updated successfully");
            })
            .catch(async (err) => {
              try {
                const data = await err.json();
                alert(data.message || "Update failed");
              } catch (e) {
                alert("Something went wrong.");
              }
            });
        });

        actionCell.appendChild(saveButton);
        row.appendChild(nameCell);
        row.appendChild(statusCell);
        row.appendChild(actionCell);
        tableBody.appendChild(row);
      });
    })
    .catch((err) => {
      console.error("Error fetching data:", err);
      localStorage.removeItem("token");
      window.location.href = "login.html";
    });
}
