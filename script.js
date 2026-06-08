// Material Tracker Application

// Data storage with unique IDs
let trackerData = {
    income: [],
    outgoing: [],
    handover: []
};

let editingId = null;
let editingType = null;
let currentTheme = localStorage.getItem('theme') || 'light';

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Material Tracker loaded');
    console.log('SheetJS available:', typeof XLSX !== 'undefined');
    console.log('Chart.js available:', typeof Chart !== 'undefined');
    
    initializeTheme();
    loadData();
    setupEventListeners();
    initializeCharts();
    renderAllTables();
});

// ============================================
// THEME TOGGLE FUNCTIONALITY
// ============================================

// Initialize theme on page load
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
}

// Apply theme to the document
function applyTheme(theme) {
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');
    
    if (theme === 'dark') {
        body.classList.add('dark-theme');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="bi bi-sun-fill"></i>';
            themeToggle.title = 'Switch to Light Theme';
        }
    } else {
        body.classList.remove('dark-theme');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="bi bi-moon-stars-fill"></i>';
            themeToggle.title = 'Switch to Dark Theme';
        }
    }
    
    currentTheme = theme;
    localStorage.setItem('theme', theme);
    console.log('Theme changed to:', theme);
}

// Toggle between themes
function toggleTheme() {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
}

// Setup event listeners for forms and buttons
function setupEventListeners() {
    // Theme toggle button
    document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);
    
    // Income form
    document.getElementById('incomeForm')?.addEventListener('submit', handleIncomeSubmit);
    
    // Outgoing form
    document.getElementById('outgoingForm')?.addEventListener('submit', handleOutgoingSubmit);
    
    // Handover form
    document.getElementById('handoverForm')?.addEventListener('submit', handleHandoverSubmit);
    
    // Export buttons
    document.getElementById('exportExcel')?.addEventListener('click', exportToExcel);
    document.getElementById('exportPdf')?.addEventListener('click', exportToPdf);
    document.getElementById('exportCsv')?.addEventListener('click', exportToCsv);
}

// Handle income form submission
function handleIncomeSubmit(e) {
    e.preventDefault();
    const date = document.getElementById('incomeDate').value;
    const amount = parseFloat(document.getElementById('incomeAmount').value);
    const description = document.getElementById('incomeDescription').value;
    
    if (date && amount) {
        if (editingId) {
            // Update existing record
            const index = trackerData.income.findIndex(r => r.id === editingId);
            if (index !== -1) {
                trackerData.income[index] = { 
                    id: editingId, 
                    date, 
                    amount, 
                    description 
                };
                editingId = null;
                document.querySelector('#incomeForm button').textContent = 'Add Income';
            }
        } else {
            // Add new record
            const newRecord = {
                id: Date.now() + Math.random(),
                date,
                amount,
                description
            };
            trackerData.income.push(newRecord);
        }
        
        document.getElementById('incomeForm').reset();
        updateIncomeTable();
        updateDashboard();
        saveData();
        alert(editingId ? 'Income record updated!' : 'Income record added successfully!');
    }
}

// Handle outgoing form submission
function handleOutgoingSubmit(e) {
    e.preventDefault();
    const date = document.getElementById('outgoingDate').value;
    const amount = parseFloat(document.getElementById('outgoingAmount').value);
    const description = document.getElementById('outgoingDescription').value;
    
    if (date && amount) {
        if (editingId) {
            // Update existing record
            const index = trackerData.outgoing.findIndex(r => r.id === editingId);
            if (index !== -1) {
                trackerData.outgoing[index] = { 
                    id: editingId, 
                    date, 
                    amount, 
                    description 
                };
                editingId = null;
                document.querySelector('#outgoingForm button').textContent = 'Add Outgoing';
            }
        } else {
            // Add new record
            const newRecord = {
                id: Date.now() + Math.random(),
                date,
                amount,
                description
            };
            trackerData.outgoing.push(newRecord);
        }
        
        document.getElementById('outgoingForm').reset();
        updateOutgoingTable();
        updateDashboard();
        saveData();
        alert(editingId ? 'Outgoing record updated!' : 'Outgoing record added successfully!');
    }
}

// Handle handover form submission
function handleHandoverSubmit(e) {
    e.preventDefault();
    const date = document.getElementById('handoverDate').value;
    const amount = parseFloat(document.getElementById('handoverAmount').value);
    const recipient = document.getElementById('handoverRecipient').value;
    const notes = document.getElementById('handoverNotes').value;
    
    if (date && amount && recipient) {
        if (editingId) {
            // Update existing record
            const index = trackerData.handover.findIndex(r => r.id === editingId);
            if (index !== -1) {
                trackerData.handover[index] = { 
                    id: editingId, 
                    date, 
                    amount, 
                    recipient, 
                    notes, 
                    status: trackerData.handover[index].status 
                };
                editingId = null;
                document.querySelector('#handoverForm button').textContent = 'Create Handover';
            }
        } else {
            // Add new record
            const newRecord = {
                id: Date.now() + Math.random(),
                date,
                amount,
                recipient,
                notes,
                status: 'Pending'
            };
            trackerData.handover.push(newRecord);
        }
        
        document.getElementById('handoverForm').reset();
        updateHandoverTable();
        updateDashboard();
        saveData();
        alert(editingId ? 'Handover record updated!' : 'Handover record created successfully!');
    }
}

// Update income table with delete/edit buttons
function updateIncomeTable() {
    const tbody = document.querySelector('#income tbody');
    if (!tbody) return;
    
    if (trackerData.income.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-muted text-center">No records yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = trackerData.income.map(record => `
        <tr>
            <td>${new Date(record.date).toLocaleDateString()}</td>
            <td class="text-success fw-bold">+$${record.amount.toFixed(2)}</td>
            <td>${record.description || '-'}</td>
            <td>
                <button class="btn btn-sm btn-warning me-1" onclick="editIncome(${record.id})">
                    <i class="bi bi-pencil"></i> Edit
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteIncome(${record.id})">
                    <i class="bi bi-trash"></i> Delete
                </button>
            </td>
        </tr>
    `).join('');
}

// Update outgoing table with delete/edit buttons
function updateOutgoingTable() {
    const tbody = document.querySelector('#outgoing tbody');
    if (!tbody) return;
    
    if (trackerData.outgoing.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-muted text-center">No records yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = trackerData.outgoing.map(record => `
        <tr>
            <td>${new Date(record.date).toLocaleDateString()}</td>
            <td class="text-danger fw-bold">-$${record.amount.toFixed(2)}</td>
            <td>${record.description || '-'}</td>
            <td>
                <button class="btn btn-sm btn-warning me-1" onclick="editOutgoing(${record.id})">
                    <i class="bi bi-pencil"></i> Edit
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteOutgoing(${record.id})">
                    <i class="bi bi-trash"></i> Delete
                </button>
            </td>
        </tr>
    `).join('');
}

// Update handover table with delete/edit buttons
function updateHandoverTable() {
    const tbody = document.querySelector('#handover tbody');
    if (!tbody) return;
    
    if (trackerData.handover.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-muted text-center">No records yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = trackerData.handover.map(record => `
        <tr>
            <td>${new Date(record.date).toLocaleDateString()}</td>
            <td class="text-primary fw-bold">$${record.amount.toFixed(2)}</td>
            <td>${record.recipient}</td>
            <td><span class="badge bg-warning">${record.status}</span></td>
            <td>
                <button class="btn btn-sm btn-warning me-1" onclick="editHandover(${record.id})">
                    <i class="bi bi-pencil"></i> Edit
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteHandover(${record.id})">
                    <i class="bi bi-trash"></i> Delete
                </button>
            </td>
        </tr>
    `).join('');
}

// ============================================
// DELETE FUNCTIONS
// ============================================

// Delete income record
function deleteIncome(id) {
    if (confirm('Are you sure you want to delete this income record?')) {
        trackerData.income = trackerData.income.filter(r => r.id !== id);
        updateIncomeTable();
        updateDashboard();
        saveData();
        alert('Income record deleted successfully!');
    }
}

// Delete outgoing record
function deleteOutgoing(id) {
    if (confirm('Are you sure you want to delete this outgoing record?')) {
        trackerData.outgoing = trackerData.outgoing.filter(r => r.id !== id);
        updateOutgoingTable();
        updateDashboard();
        saveData();
        alert('Outgoing record deleted successfully!');
    }
}

// Delete handover record
function deleteHandover(id) {
    if (confirm('Are you sure you want to delete this handover record?')) {
        trackerData.handover = trackerData.handover.filter(r => r.id !== id);
        updateHandoverTable();
        updateDashboard();
        saveData();
        alert('Handover record deleted successfully!');
    }
}

// ============================================
// EDIT FUNCTIONS
// ============================================

// Edit income record
function editIncome(id) {
    const record = trackerData.income.find(r => r.id === id);
    if (record) {
        document.getElementById('incomeDate').value = record.date;
        document.getElementById('incomeAmount').value = record.amount;
        document.getElementById('incomeDescription').value = record.description;
        document.querySelector('#incomeForm button').textContent = 'Update Income';
        editingId = id;
        editingType = 'income';
        document.getElementById('incomeForm').scrollIntoView({ behavior: 'smooth' });
    }
}

// Edit outgoing record
function editOutgoing(id) {
    const record = trackerData.outgoing.find(r => r.id === id);
    if (record) {
        document.getElementById('outgoingDate').value = record.date;
        document.getElementById('outgoingAmount').value = record.amount;
        document.getElementById('outgoingDescription').value = record.description;
        document.querySelector('#outgoingForm button').textContent = 'Update Outgoing';
        editingId = id;
        editingType = 'outgoing';
        document.getElementById('outgoingForm').scrollIntoView({ behavior: 'smooth' });
    }
}

// Edit handover record
function editHandover(id) {
    const record = trackerData.handover.find(r => r.id === id);
    if (record) {
        document.getElementById('handoverDate').value = record.date;
        document.getElementById('handoverAmount').value = record.amount;
        document.getElementById('handoverRecipient').value = record.recipient;
        document.getElementById('handoverNotes').value = record.notes;
        document.querySelector('#handoverForm button').textContent = 'Update Handover';
        editingId = id;
        editingType = 'handover';
        document.getElementById('handoverForm').scrollIntoView({ behavior: 'smooth' });
    }
}
function updateDashboard() {
    const totalIncome = trackerData.income.reduce((sum, r) => sum + r.amount, 0);
    const totalOutgoing = trackerData.outgoing.reduce((sum, r) => sum + r.amount, 0);
    const balance = totalIncome - totalOutgoing;
    const pendingHandover = trackerData.handover.filter(h => h.status === 'Pending').length;
    
    // Update dashboard cards
    document.querySelectorAll('.card-text.display-6')[0].textContent = '$' + totalIncome.toFixed(2);
    document.querySelectorAll('.card-text.display-6')[1].textContent = '$' + totalOutgoing.toFixed(2);
    document.querySelectorAll('.card-text.display-6')[2].textContent = '$' + balance.toFixed(2);
    document.querySelectorAll('.card-text.display-6')[3].textContent = pendingHandover;
    
    updateCharts();
}

// Initialize charts
function initializeCharts() {
    const incomeCtx = document.getElementById('incomeChart');
    const outgoingCtx = document.getElementById('outgoingChart');
    
    if (!incomeCtx || !outgoingCtx) return;
    
    // ============================================
    // COMPARISON BAR CHART
    // ============================================
    window.comparisonChart = new Chart(incomeCtx, {
        type: 'bar',
        data: {
            labels: ['Income vs Outgoing', 'Totals'],
            datasets: [
                {
                    label: 'Total Income',
                    data: [0, 0],
                    backgroundColor: '#28a745',
                    borderColor: '#20c997',
                    borderWidth: 2,
                    borderRadius: 4
                },
                {
                    label: 'Total Outgoing',
                    data: [0, 0],
                    backgroundColor: '#dc3545',
                    borderColor: '#e74c3c',
                    borderWidth: 2,
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            indexAxis: 'y',
            scales: {
                x: {
                    beginAtZero: true,
                    stacked: false,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toFixed(0);
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 15
                    }
                },
                title: {
                    display: true,
                    text: 'Income vs Outgoing Comparison',
                    font: { size: 14, weight: 'bold' }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': $' + context.parsed.x.toFixed(2);
                        }
                    }
                }
            }
        }
    });
    
    // ============================================
    // BALANCE BREAKDOWN PIE CHART
    // ============================================
    window.balanceChart = new Chart(outgoingCtx, {
        type: 'doughnut',
        data: {
            labels: ['Income', 'Outgoing'],
            datasets: [{
                data: [0, 0],
                backgroundColor: ['#28a745', '#dc3545'],
                borderColor: ['#fff', '#fff'],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 15,
                        font: { size: 12 }
                    }
                },
                title: {
                    display: true,
                    text: 'Income vs Outgoing Breakdown',
                    font: { size: 14, weight: 'bold' }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return label + ': $' + value.toFixed(2) + ' (' + percentage + '%)';
                        }
                    }
                }
            }
        }
    });
}

// Update charts with data
function updateCharts() {
    const totalIncome = trackerData.income.reduce((sum, r) => sum + r.amount, 0);
    const totalOutgoing = trackerData.outgoing.reduce((sum, r) => sum + r.amount, 0);
    const balance = totalIncome - totalOutgoing;
    
    // ============================================
    // UPDATE COMPARISON BAR CHART
    // ============================================
    if (window.comparisonChart) {
        window.comparisonChart.data.datasets[0].data = [totalIncome, totalIncome];
        window.comparisonChart.data.datasets[1].data = [totalOutgoing, totalOutgoing];
        window.comparisonChart.update();
    }
    
    // ============================================
    // UPDATE BALANCE BREAKDOWN PIE CHART
    // ============================================
    if (window.balanceChart) {
        window.balanceChart.data.datasets[0].data = [totalIncome, totalOutgoing];
        
        // Update tooltip to show balance info
        window.balanceChart.options.plugins.tooltip = {
            callbacks: {
                label: function(context) {
                    const label = context.label || '';
                    const value = context.parsed || 0;
                    const total = totalIncome + totalOutgoing;
                    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                    return label + ': $' + value.toFixed(2) + ' (' + percentage + '%)';
                },
                afterLabel: function(context) {
                    if (context.dataIndex === 0) {
                        return 'Available Funds';
                    } else if (context.dataIndex === 1) {
                        return 'Expenses';
                    }
                }
            }
        };
        
        window.balanceChart.update();
    }
    
    // ============================================
    // LOG DASHBOARD TOTALS
    // ============================================
    console.log('Dashboard Update:', {
        totalIncome: totalIncome.toFixed(2),
        totalOutgoing: totalOutgoing.toFixed(2),
        balance: balance.toFixed(2),
        incomeRecords: trackerData.income.length,
        outgoingRecords: trackerData.outgoing.length
    });
}

// Export to Excel
function exportToExcel() {
    try {
        if (typeof XLSX === 'undefined') {
            alert('SheetJS library not loaded. Please check your internet connection.');
            return;
        }
        
        const workbook = XLSX.utils.book_new();
        
        // ============================================
        // INCOME SHEET
        // ============================================
        const incomeData = trackerData.income.map(record => ({
            'Date': new Date(record.date).toLocaleDateString(),
            'Amount': record.amount,
            'Description': record.description || ''
        }));
        
        if (incomeData.length === 0) {
            incomeData.push({
                'Date': '',
                'Amount': 0,
                'Description': 'No records'
            });
        }
        
        const incomeWorksheet = XLSX.utils.json_to_sheet(incomeData);
        incomeWorksheet['!cols'] = [
            { wch: 15 },  // Date width
            { wch: 12 },  // Amount width
            { wch: 30 }   // Description width
        ];
        XLSX.utils.book_append_sheet(workbook, incomeWorksheet, 'Income');
        
        // ============================================
        // OUTGOING SHEET
        // ============================================
        const outgoingData = trackerData.outgoing.map(record => ({
            'Date': new Date(record.date).toLocaleDateString(),
            'Amount': record.amount,
            'Description': record.description || ''
        }));
        
        if (outgoingData.length === 0) {
            outgoingData.push({
                'Date': '',
                'Amount': 0,
                'Description': 'No records'
            });
        }
        
        const outgoingWorksheet = XLSX.utils.json_to_sheet(outgoingData);
        outgoingWorksheet['!cols'] = [
            { wch: 15 },  // Date width
            { wch: 12 },  // Amount width
            { wch: 30 }   // Description width
        ];
        XLSX.utils.book_append_sheet(workbook, outgoingWorksheet, 'Outgoing');
        
        // ============================================
        // HANDOVER SHEET
        // ============================================
        const handoverData = trackerData.handover.map(record => ({
            'Date': new Date(record.date).toLocaleDateString(),
            'Amount': record.amount,
            'Recipient': record.recipient,
            'Notes': record.notes || '',
            'Status': record.status
        }));
        
        if (handoverData.length === 0) {
            handoverData.push({
                'Date': '',
                'Amount': 0,
                'Recipient': '',
                'Notes': 'No records',
                'Status': ''
            });
        }
        
        const handoverWorksheet = XLSX.utils.json_to_sheet(handoverData);
        handoverWorksheet['!cols'] = [
            { wch: 15 },  // Date width
            { wch: 12 },  // Amount width
            { wch: 20 },  // Recipient width
            { wch: 30 },  // Notes width
            { wch: 12 }   // Status width
        ];
        XLSX.utils.book_append_sheet(workbook, handoverWorksheet, 'Handover');
        
        // ============================================
        // SUMMARY SHEET
        // ============================================
        const totalIncome = trackerData.income.reduce((sum, r) => sum + r.amount, 0);
        const totalOutgoing = trackerData.outgoing.reduce((sum, r) => sum + r.amount, 0);
        const balance = totalIncome - totalOutgoing;
        const pendingHandover = trackerData.handover.filter(h => h.status === 'Pending').length;
        
        const summaryData = [
            { 'Metric': 'Total Income', 'Value': totalIncome },
            { 'Metric': 'Total Outgoing', 'Value': totalOutgoing },
            { 'Metric': 'Balance', 'Value': balance },
            { 'Metric': 'Pending Handovers', 'Value': pendingHandover },
            { 'Metric': 'Total Records', 'Value': trackerData.income.length + trackerData.outgoing.length + trackerData.handover.length }
        ];
        
        const summaryWorksheet = XLSX.utils.json_to_sheet(summaryData);
        summaryWorksheet['!cols'] = [
            { wch: 20 },  // Metric width
            { wch: 15 }   // Value width
        ];
        XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Summary');
        
        // ============================================
        // EXPORT WORKBOOK
        // ============================================
        const filename = `material-tracker-${new Date().toISOString().slice(0, 10)}.xlsx`;
        XLSX.writeFile(workbook, filename);
        alert('Excel file exported successfully: ' + filename);
    } catch (error) {
        console.error('Error exporting to Excel:', error);
        alert('Error exporting to Excel: ' + error.message);
    }
}

// Export to PDF (basic implementation)
function exportToPdf() {
    alert('PDF export feature requires an additional library like jsPDF. Coming soon!');
}

// Export to CSV
function exportToCsv() {
    try {
        let csv = 'INCOME\nDate,Amount,Description\n';
        trackerData.income.forEach(r => {
            csv += `${r.date},${r.amount},"${r.description}"\n`;
        });
        
        csv += '\n\nOUTGOING\nDate,Amount,Description\n';
        trackerData.outgoing.forEach(r => {
            csv += `${r.date},${r.amount},"${r.description}"\n`;
        });
        
        csv += '\n\nHANDOVER\nDate,Amount,Recipient,Notes,Status\n';
        trackerData.handover.forEach(r => {
            csv += `${r.date},${r.amount},"${r.recipient}","${r.notes}",${r.status}\n`;
        });
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'material-tracker.csv';
        a.click();
        alert('CSV file exported successfully!');
    } catch (error) {
        alert('Error exporting to CSV: ' + error.message);
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('trackerData', JSON.stringify(trackerData));
}

// Load data from localStorage
function loadData() {
    const saved = localStorage.getItem('trackerData');
    if (saved) {
        try {
            trackerData = JSON.parse(saved);
            // Validate structure
            if (!trackerData.income) trackerData.income = [];
            if (!trackerData.outgoing) trackerData.outgoing = [];
            if (!trackerData.handover) trackerData.handover = [];
        } catch (e) {
            console.error('Error loading data from localStorage:', e);
            trackerData = { income: [], outgoing: [], handover: [] };
        }
    }
}

// Render all tables dynamically from stored data
function renderAllTables() {
    updateIncomeTable();
    updateOutgoingTable();
    updateHandoverTable();
    updateDashboard();
}
