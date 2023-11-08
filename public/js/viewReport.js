document.addEventListener("DOMContentLoaded", function () {
    fetch("../data/attendance.json")
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector("tbody");
            data.forEach(entry => {
                const row = document.createElement("tr");
                row.innerHTML = `
                        <td>${entry.id}</td>
                        <td>${entry.name}</td>
                        <td>${entry.depart}</td>
                        <td>${entry.dateTime}</td>
                        <td><button>View</button></td>
                    `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
});