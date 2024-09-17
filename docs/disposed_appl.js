document.addEventListener('DOMContentLoaded', async () => {
    const detailsTableBody = document.querySelector('#disposed-table tbody');
    const detailsTableHead = document.querySelector('#disposed-table thead tr');
    const username = localStorage.getItem('username'); // Retrieve username from local storage
    const role = localStorage.getItem('role'); // Retrieve role from local storage

    // Role-based column headers mapping
    const roleColumns = {
        'CCIT': ['CCIT', 'CIT', 'ADDCIT', 'ITO/DCIT'],
        'CIT': ['CIT', 'ADDCIT', 'ITO/DCIT'],
        'ADDCIT': ['ADDCIT', 'ITO/DCIT'],
        'ITO': ['ITO/DCIT'],
        'DCIT': ['ITO/DCIT']
    };

    // Function to simplify hierarchy names
    const simplifyHierarchyName = (name) => {
        if (name.startsWith('CCIT')) return 'CCIT';
        if (name.startsWith('ADDCIT')) return 'ADDCIT';
        if (name.startsWith('CIT')) return 'CIT';
        if (name.startsWith('ITO') || name.startsWith('DCIT')) return 'ITO/DCIT';
        return name; // Default case if no match is found
    };

    // Function to calculate days since the application
    const calculateDaysSince = (dateString) => {
        const today = new Date();
        const applicationDate = new Date(dateString);
        const differenceInTime = today - applicationDate;
        const differenceInDays = Math.floor(differenceInTime / (1000 * 60 * 60 * 24));
        return differenceInDays;
    };

    // Determine the columns based on the role
    const columns = roleColumns[role] || [];

    // Create table headers dynamically based on role
    detailsTableHead.innerHTML = `
        <th>PAN</th>
        <th>Application Type</th>
        <th>Application Date</th>
        <th>Disposal Date</th>
        <th>DISPOSAL TIME (DAYS)</th>
        <th>Date Of Query</th> <!-- Added DateOfQuery header -->
    `;
    columns.forEach(col => {
        const th = document.createElement('th');
        th.textContent = col; // Use the role-based column name
        detailsTableHead.appendChild(th);
    });

    try {
        // Fetch disposed applications
        const response = await fetch(`/disposed-applications?username=${username}`);
        const data = await response.json();

        // Populate the table with disposed application records
        data.forEach(record => {
            const tr = document.createElement('tr');
            const additionalUsers = Array.from(record.additional_users); // Convert Set to Array

            // Handle DateOfQuery and show "no queries" if empty
            const dateOfQuery = record.DateOfQuery ? record.DateOfQuery : 'no queries';

            // Add data cells for PAN, TypeOfApplication, DateOfApplication, DateOfDisposal, and DateOfQuery
            tr.innerHTML = `
                <td>${record.PAN}</td>
                <td>${record.TypeOfApplication}</td>
                <td>${record.DateOfApplication}</td>
                <td>${record.DateOfDisposal}</td>
                <td>${calculateDaysSince(record.DateOfApplication)}</td>
                <td>${dateOfQuery}</td> <!-- Added DateOfQuery -->
            `;

            // Add cells for each fixed hierarchy level based on the additional users array
            columns.forEach((col, index) => {
                const td = document.createElement('td');
                td.textContent = additionalUsers[index] || ''; // Use empty string if no user available
                tr.appendChild(td);
            });

            detailsTableBody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error:', error);
    }

    document.getElementById('back-to-home').addEventListener('click', () => {
        window.location.href = 'app.html'; // Adjust to your home page URL
    });
});
