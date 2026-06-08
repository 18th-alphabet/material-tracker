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

const TRANSACTION_EXPORT_COLUMNS = [
    { header: 'No', width: 5, align: 'center', value: (record, index) => index + 1 },
    { header: 'Material Name', width: 24, align: 'left', value: record => record.materialName || '' },
    { header: 'Qty', width: 8, align: 'center', value: record => record.qty || 0 },
    { header: 'Serial No', width: 16, align: 'center', value: record => record.serialNo || '' },
    { header: 'Amount', width: 12, align: 'right', value: record => record.amount || 0 },
    { header: 'Date', width: 16, align: 'center', value: record => formatExportDate(record.date) },
    { header: 'Comments', width: 28, align: 'left', value: record => record.comments || '' }
];

const HANDOVER_EXPORT_COLUMNS = [
    { header: 'No', width: 5, align: 'center', value: (record, index) => index + 1 },
    { header: 'Material Name', width: 24, align: 'left', value: record => record.materialName || '' },
    { header: 'Qty', width: 8, align: 'center', value: record => record.qty || 0 },
    { header: 'Serial No', width: 16, align: 'center', value: record => record.serialNo || '' },
    { header: 'Handover Person', width: 20, align: 'left', value: record => record.handoverPerson || '' },
    { header: 'Handover By', width: 18, align: 'left', value: record => record.handoverBy || '' },
    { header: 'Handover Date', width: 16, align: 'center', value: record => formatExportDate(record.date) },
    { header: 'Handover Details', width: 28, align: 'left', value: record => record.handoverDetails || '' },
    { header: 'Comments', width: 28, align: 'left', value: record => record.comments || '' }
];

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
    const materialName = document.getElementById('incomeMaterialName').value;
    const qty = parseFloat(document.getElementById('incomeQty').value);
    const amount = parseFloat(document.getElementById('incomeAmount').value);
    const serialNo = document.getElementById('incomeSerialNo').value;
    const date = document.getElementById('incomeDate').value;
    const comments = document.getElementById('incomeComments').value;
    
    if (materialName && qty && amount && date) {
        if (editingId) {
            // Update existing record
            const index = trackerData.income.findIndex(r => r.id === editingId);
            if (index !== -1) {
                trackerData.income[index] = { 
                    id: editingId, 
                    materialName,
                    qty,
                    amount,
                    serialNo,
                    date,
                    comments
                };
                editingId = null;
                document.querySelector('#incomeForm button').textContent = 'Add Income';
            }
        } else {
            // Add new record
            const newRecord = {
                id: Date.now() + Math.random(),
                materialName,
                qty,
                amount,
                serialNo,
                date,
                comments
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
    const materialName = document.getElementById('outgoingMaterialName').value;
    const qty = parseFloat(document.getElementById('outgoingQty').value);
    const amount = parseFloat(document.getElementById('outgoingAmount').value);
    const serialNo = document.getElementById('outgoingSerialNo').value;
    const date = document.getElementById('outgoingDate').value;
    const comments = document.getElementById('outgoingComments').value;
    
    if (materialName && qty && amount && date) {
        if (editingId) {
            // Update existing record
            const index = trackerData.outgoing.findIndex(r => r.id === editingId);
            if (index !== -1) {
                trackerData.outgoing[index] = { 
                    id: editingId, 
                    materialName,
                    qty,
                    amount,
                    serialNo,
                    date,
                    comments
                };
                editingId = null;
                document.querySelector('#outgoingForm button').textContent = 'Add Outgoing';
            }
        } else {
            // Add new record
            const newRecord = {
                id: Date.now() + Math.random(),
                materialName,
                qty,
                amount,
                serialNo,
                date,
                comments
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
    const materialName = document.getElementById('handoverMaterialName').value;
    const qty = parseFloat(document.getElementById('handoverQty').value);
    const amount = parseFloat(document.getElementById('handoverAmount').value);
    const serialNo = document.getElementById('handoverSerialNo').value;
    const date = document.getElementById('handoverDate').value;
    const handoverPerson = document.getElementById('handoverPerson').value;
    const handoverBy = document.getElementById('handoverBy').value;
    const handoverDetails = document.getElementById('handoverDetails').value;
    const comments = document.getElementById('handoverComments').value;
    
    if (materialName && qty && amount && date && handoverPerson && handoverBy) {
        if (editingId) {
            // Update existing record
            const index = trackerData.handover.findIndex(r => r.id === editingId);
            if (index !== -1) {
                trackerData.handover[index] = { 
                    id: editingId,
                    materialName,
                    qty,
                    amount,
                    serialNo,
                    date,
                    handoverPerson,
                    handoverBy,
                    handoverDetails,
                    comments,
                    status: trackerData.handover[index].status
                };
                editingId = null;
                document.querySelector('#handoverForm button').textContent = 'Create Handover';
            }
        } else {
            // Add new record
            const newRecord = {
                id: Date.now() + Math.random(),
                materialName,
                qty,
                amount,
                serialNo,
                date,
                handoverPerson,
                handoverBy,
                handoverDetails,
                comments,
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
        tbody.innerHTML = '<tr><td colspan="6" class="text-muted text-center">No records yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = trackerData.income.map(record => `
        <tr>
            <td title="${record.materialName}">${record.materialName}</td>
            <td>${record.qty}</td>
            <td class="text-success fw-bold">$${record.amount.toFixed(2)}</td>
            <td>${record.serialNo || '-'}</td>
            <td>${new Date(record.date).toLocaleDateString()}</td>
            <td>
                <button class="btn btn-sm btn-warning me-1" onclick="editIncome(${record.id})">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteIncome(${record.id})">
                    <i class="bi bi-trash"></i>
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
        tbody.innerHTML = '<tr><td colspan="6" class="text-muted text-center">No records yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = trackerData.outgoing.map(record => `
        <tr>
            <td title="${record.materialName}">${record.materialName}</td>
            <td>${record.qty}</td>
            <td class="text-danger fw-bold">$${record.amount.toFixed(2)}</td>
            <td>${record.serialNo || '-'}</td>
            <td>${new Date(record.date).toLocaleDateString()}</td>
            <td>
                <button class="btn btn-sm btn-warning me-1" onclick="editOutgoing(${record.id})">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteOutgoing(${record.id})">
                    <i class="bi bi-trash"></i>
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
        tbody.innerHTML = '<tr><td colspan="8" class="text-muted text-center">No records yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = trackerData.handover.map(record => `
        <tr>
            <td title="${record.materialName}">${record.materialName}</td>
            <td>${record.qty}</td>
            <td class="text-primary fw-bold">$${record.amount.toFixed(2)}</td>
            <td>${record.handoverPerson}</td>
            <td>${record.handoverBy}</td>
            <td>${new Date(record.date).toLocaleDateString()}</td>
            <td><span class="badge bg-warning">${record.status}</span></td>
            <td>
                <button class="btn btn-sm btn-warning me-1" onclick="editHandover(${record.id})" title="Edit">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteHandover(${record.id})" title="Delete">
                    <i class="bi bi-trash"></i>
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
        document.getElementById('incomeMaterialName').value = record.materialName;
        document.getElementById('incomeQty').value = record.qty;
        document.getElementById('incomeAmount').value = record.amount;
        document.getElementById('incomeSerialNo').value = record.serialNo || '';
        document.getElementById('incomeDate').value = record.date;
        document.getElementById('incomeComments').value = record.comments || '';
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
        document.getElementById('outgoingMaterialName').value = record.materialName;
        document.getElementById('outgoingQty').value = record.qty;
        document.getElementById('outgoingAmount').value = record.amount;
        document.getElementById('outgoingSerialNo').value = record.serialNo || '';
        document.getElementById('outgoingDate').value = record.date;
        document.getElementById('outgoingComments').value = record.comments || '';
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
        document.getElementById('handoverMaterialName').value = record.materialName;
        document.getElementById('handoverQty').value = record.qty;
        document.getElementById('handoverAmount').value = record.amount;
        document.getElementById('handoverSerialNo').value = record.serialNo || '';
        document.getElementById('handoverDate').value = record.date;
        document.getElementById('handoverPerson').value = record.handoverPerson;
        document.getElementById('handoverBy').value = record.handoverBy;
        document.getElementById('handoverDetails').value = record.handoverDetails || '';
        document.getElementById('handoverComments').value = record.comments || '';
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

        getExportSections().forEach(section => {
            const rows = buildExportRows(section.records, section.columns);
            const worksheet = XLSX.utils.json_to_sheet(rows, {
                header: section.columns.map(column => column.header)
            });
            applyExcelLayout(worksheet, rows.length, section.columns);
            XLSX.utils.book_append_sheet(workbook, worksheet, section.name);
        });
        
        // ============================================
        // SUMMARY SHEET
        // ============================================
        const totalIncome = trackerData.income.reduce((sum, r) => sum + (r.amount || 0), 0);
        const totalOutgoing = trackerData.outgoing.reduce((sum, r) => sum + (r.amount || 0), 0);
        const balance = totalIncome - totalOutgoing;
        
        const summaryData = [
            { 'Metric': 'Total Income', 'Value': totalIncome },
            { 'Metric': 'Total Outgoing', 'Value': totalOutgoing },
            { 'Metric': 'Balance', 'Value': balance },
            { 'Metric': 'Income Records', 'Value': trackerData.income.length },
            { 'Metric': 'Outgoing Records', 'Value': trackerData.outgoing.length },
            { 'Metric': 'Handover Records', 'Value': trackerData.handover.length }
        ];
        
        const summaryWorksheet = XLSX.utils.json_to_sheet(summaryData);
        summaryWorksheet['!cols'] = [
            { wch: 20 },   // Metric
            { wch: 15 }    // Value
        ];
        styleExcelWorksheet(summaryWorksheet, summaryData.length + 1, 'Summary');
        XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Summary');
        
        // ============================================
        // EXPORT WORKBOOK
        // ============================================
        const filename = `material-tracker-${new Date().toISOString().slice(0, 10)}.xlsx`;
        XLSX.writeFile(workbook, filename);
        console.log('Excel file exported successfully:', filename);
    } catch (error) {
        console.error('Error exporting to Excel:', error);
        alert('Error exporting to Excel: ' + error.message);
    }
}

function getExportSections() {
    return [
        { name: 'Income', records: trackerData.income, columns: TRANSACTION_EXPORT_COLUMNS },
        { name: 'Outgoing', records: trackerData.outgoing, columns: TRANSACTION_EXPORT_COLUMNS },
        { name: 'Handover', records: trackerData.handover, columns: HANDOVER_EXPORT_COLUMNS }
    ];
}

function buildExportRows(records, columns) {
    if (!records.length) {
        return [columns.reduce((row, column, index) => {
            row[column.header] = index === 1 ? 'No records' : '';
            return row;
        }, {})];
    }

    return records.map((record, index) => columns.reduce((row, column) => {
        row[column.header] = column.value(record, index);
        return row;
    }, {}));
}

function formatExportDate(value) {
    if (!value) return '';

    const isoDateMatch = String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);
    const date = isoDateMatch
        ? new Date(Number(isoDateMatch[1]), Number(isoDateMatch[2]) - 1, Number(isoDateMatch[3]))
        : new Date(value);

    return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString();
}

function applyExcelLayout(worksheet, rowCount, columns) {
    const lastColumn = columns.length - 1;
    const lastRow = rowCount;

    worksheet['!cols'] = columns.map(column => ({ wch: column.width }));
    worksheet['!autofilter'] = {
        ref: XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: lastRow, c: lastColumn } })
    };

    styleExcelWorksheet(worksheet, rowCount + 1, columns);
}

// Helper function to style Excel worksheet
function styleExcelWorksheet(worksheet, rows, columns = []) {
    const worksheetColumns = Array.isArray(columns) ? columns : [];
    const columnCount = worksheetColumns.length || XLSX.utils.decode_range(worksheet['!ref']).e.c + 1;

    // Header row styling
    for (let col = 0; col < columnCount; col++) {
        const cellAddress = XLSX.utils.encode_col(col) + '1';
        if (worksheet[cellAddress]) {
            worksheet[cellAddress].s = {
                fill: { fgColor: { rgb: 'FF0056B3' } },
                font: { bold: true, color: { rgb: 'FFFFFFFF' }, size: 11 },
                alignment: { horizontal: 'center', vertical: 'center', wrapText: true }
            };
        }
    }
    
    // Data rows styling
    for (let row = 2; row <= rows; row++) {
        for (let col = 0; col < columnCount; col++) {
            const cellAddress = XLSX.utils.encode_col(col) + row;
            if (worksheet[cellAddress]) {
                worksheet[cellAddress].s = {
                    alignment: {
                        horizontal: worksheetColumns[col]?.align || (col === 0 ? 'center' : 'left'),
                        vertical: 'center',
                        wrapText: true
                    },
                    border: {
                        top: { style: 'thin', color: { rgb: 'FFD3D3D3' } },
                        bottom: { style: 'thin', color: { rgb: 'FFD3D3D3' } },
                        left: { style: 'thin', color: { rgb: 'FFD3D3D3' } },
                        right: { style: 'thin', color: { rgb: 'FFD3D3D3' } }
                    }
                };
            }
        }
    }
}

// Export to PDF
function exportToPdf() {
    try {
        if (typeof html2pdf === 'undefined') {
            alert('PDF export library not loaded. Please check your internet connection.');
            return;
        }

        const report = buildPdfReport();
        document.body.appendChild(report);

        const filename = `material-tracker-${new Date().toISOString().slice(0, 10)}.pdf`;
        const options = {
            margin: 8,
            filename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };

        html2pdf().set(options).from(report).save()
            .then(() => {
                report.remove();
            })
            .catch(error => {
                report.remove();
                console.error('Error exporting to PDF:', error);
                alert('Error exporting to PDF: ' + error.message);
            });
    } catch (error) {
        console.error('Error exporting to PDF:', error);
        alert('Error exporting to PDF: ' + error.message);
    }
}

// Export to CSV
function exportToCsv() {
    try {
        const csv = getExportSections().map(section => {
            const headerRow = section.columns.map(column => column.header);
            const dataRows = buildExportRows(section.records, section.columns).map(row => (
                section.columns.map(column => row[column.header])
            ));

            return [
                [section.name],
                headerRow,
                ...dataRows
            ].map(row => row.map(escapeCsvValue).join(',')).join('\r\n');
        }).join('\r\n\r\n');
        
        const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `material-tracker-${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        alert('CSV file exported successfully!');
    } catch (error) {
        console.error('Error exporting to CSV:', error);
        alert('Error exporting to CSV: ' + error.message);
    }
}

function escapeCsvValue(value) {
    const text = value === null || value === undefined ? '' : String(value);
    return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function buildPdfReport() {
    const report = document.createElement('div');
    report.className = 'export-pdf-report';
    report.innerHTML = `
        <style>
            .export-pdf-report {
                color: #1f2937;
                font-family: Arial, sans-serif;
                width: 1120px;
                padding: 16px;
                background: #ffffff;
            }
            .export-pdf-header {
                border-bottom: 2px solid #0056b3;
                margin-bottom: 16px;
                padding-bottom: 10px;
            }
            .export-pdf-header h1 {
                color: #0056b3;
                font-size: 22px;
                margin: 0 0 4px;
            }
            .export-pdf-header p {
                color: #4b5563;
                font-size: 11px;
                margin: 0;
            }
            .export-pdf-section {
                margin-bottom: 18px;
                page-break-inside: avoid;
            }
            .export-pdf-section h2 {
                color: #111827;
                font-size: 15px;
                margin: 0 0 8px;
            }
            .export-pdf-table {
                border-collapse: collapse;
                font-size: 9px;
                table-layout: fixed;
                width: 100%;
            }
            .export-pdf-table th {
                background: #0056b3;
                border: 1px solid #0f4f9c;
                color: #ffffff;
                font-weight: 700;
                padding: 6px 4px;
                text-align: center;
                vertical-align: middle;
            }
            .export-pdf-table td {
                border: 1px solid #d1d5db;
                padding: 5px 4px;
                vertical-align: top;
                word-break: break-word;
            }
            .export-pdf-table tbody tr:nth-child(even) td {
                background: #f8fafc;
            }
            .align-center { text-align: center; }
            .align-left { text-align: left; }
            .align-right { text-align: right; }
        </style>
        <div class="export-pdf-header">
            <h1>Material Tracker Export</h1>
            <p>Generated on ${escapeHtml(new Date().toLocaleString())}</p>
        </div>
        ${getExportSections().map(section => buildPdfSection(section)).join('')}
    `;

    return report;
}

function buildPdfSection(section) {
    const rows = buildExportRows(section.records, section.columns);
    const headerCells = section.columns.map(column => (
        `<th style="width:${column.width * 7}px">${escapeHtml(column.header)}</th>`
    )).join('');

    const bodyRows = rows.map(row => `
        <tr>
            ${section.columns.map(column => `
                <td class="align-${column.align}">${escapeHtml(row[column.header])}</td>
            `).join('')}
        </tr>
    `).join('');

    return `
        <section class="export-pdf-section">
            <h2>${escapeHtml(section.name)}</h2>
            <table class="export-pdf-table">
                <thead><tr>${headerCells}</tr></thead>
                <tbody>${bodyRows}</tbody>
            </table>
        </section>
    `;
}

function escapeHtml(value) {
    return String(value === null || value === undefined ? '' : value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
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
