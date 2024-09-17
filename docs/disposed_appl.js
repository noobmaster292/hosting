document.addEventListener('DOMContentLoaded', async () => {
    const detailsTableBody = document.querySelector('#disposed-table tbody');
    const username = localStorage.getItem('username'); // Retrieve username from local storage

    // Function to calculate days since the application
    const calculateDaysSince = (dateString) => {
        const today = new Date();
        const applicationDate = new Date(dateString);
        const differenceInTime = today - applicationDate;
        const differenceInDays = Math.floor(differenceInTime / (1000 * 60 * 60 * 24));
        return differenceInDays;
    };

    // Fetch disposed applications
    try {
        const response = await fetch(`/disposed-applications?username=${username}`);
        const data = await response.json();

        // Clear existing rows in the table body
        detailsTableBody.innerHTML = '';

        // Populate the table with disposed application records
        data.forEach(record => {
            console.log('Processing record:', record); // Log the entire record

            const tr = document.createElement('tr');
            const daysTaken = record.DateOfDisposal
                ? calculateDaysSince(record.DateOfApplication)
                : 'N/A'; // Handle calculation or display 'N/A' if DateOfDisposal is missing

            // Handle DateOfQuery and show "no queries" if empty
            const dateOfQuery = record.DateOfQuery ? record.DateOfQuery : 'no queries';

            // Add data cells for PAN, TypeOfApplication, DateOfApplication, DateOfDisposal, TIME TAKEN IN DISPOSING (DAYS), and DateOfQuery
            tr.innerHTML = `
                <td>${record.PAN}</td>
                <td>${record.TypeOfApplication}</td>
                <td>${record.DateOfApplication}</td>
                <td>${record.DateOfDisposal}</td>
                <td>${daysTaken}</td>
                <td>${dateOfQuery}</td>
            `;

            // Append the row to the table body
            detailsTableBody.appendChild(tr);
            console.log('Row added to table body'); // Log when a row is added
        });
    } catch (error) {
        console.error('Error:', error);
    }

    document.getElementById('back-to-home').addEventListener('click', () => {
        window.location.href = 'app.html'; // Adjust to your home page URL
    });
});
