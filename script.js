// Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Check for saved theme preference or use default
if (localStorage.getItem('theme') === 'dark') {
    htmlElement.setAttribute('data-bs-theme', 'dark');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
} else {
    htmlElement.setAttribute('data-bs-theme', 'light');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
}

// Toggle theme when button is clicked
themeToggle.addEventListener('click', () => {
    if (htmlElement.getAttribute('data-bs-theme') === 'light') {
        htmlElement.setAttribute('data-bs-theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('theme', 'dark');
    } else {
        htmlElement.setAttribute('data-bs-theme', 'light');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', 'light');
    }
});

// DOM Elements
const employeeForm = document.getElementById('employeeForm');
const saveEmployeeBtn = document.getElementById('saveEmployeeBtn');
const employeeTableBody = document.getElementById('employeeTableBody');
const attendanceForm = document.getElementById('attendanceForm');
const saveAttendanceBtn = document.getElementById('saveAttendanceBtn');
const attendanceTableBody = document.getElementById('attendanceTableBody');
const employeeCheckboxes = document.getElementById('employeeCheckboxes');
const salaryForm = document.getElementById('salaryForm');
const saveSalaryBtn = document.getElementById('saveSalaryBtn');
const salaryTableBody = document.getElementById('salaryTableBody');
const salaryEmployeeSelect = document.getElementById('salaryEmployee');
const totalEmployeesEl = document.getElementById('totalEmployees');
const presentTodayEl = document.getElementById('presentToday');
const totalDueAmountEl = document.getElementById('totalDueAmount');
const searchInput = document.getElementById('searchInput');

// Bootstrap Modals
const employeeModal = new bootstrap.Modal(document.getElementById('addEmployeeModal'));
const attendanceModal = new bootstrap.Modal(document.getElementById('attendanceModal'));
const salaryModal = new bootstrap.Modal(document.getElementById('salaryModal'));

// Constants
const dailyRate = 1000; // 1000 Taka per day

// Data Storage
let employees = getEmployees();
let attendanceRecords = getAttendanceRecords();
let salaryRecords = getSalaryRecords();

// Initialize the application
function initApp() {
    renderEmployeeTable();
    renderAttendanceTable();
    renderSalaryTable();
    populateEmployeeCheckboxes();
    populateEmployeeSelectors();
    updateDashboardStats();
    initializeChart();
    
    // Set today's date as default for attendance and salary forms
    const today = new Date().toISOString().split('T')[0];
    if (document.getElementById('attendanceDate')) {
        document.getElementById('attendanceDate').value = today;
    }
    if (document.getElementById('salaryDate')) {
        document.getElementById('salaryDate').value = today;
    }
}

// --- Data Management Functions ---

// Get employees from localStorage or initialize empty array
function getEmployees() {
    const storedEmployees = localStorage.getItem('employees');
    return storedEmployees ? JSON.parse(storedEmployees) : [];
}

// Save employees to localStorage
function saveEmployees() {
    localStorage.setItem('employees', JSON.stringify(employees));
}

// Get attendance records from localStorage or initialize empty array
function getAttendanceRecords() {
    const storedRecords = localStorage.getItem('attendanceRecords');
    return storedRecords ? JSON.parse(storedRecords) : [];
}

// Save attendance records to localStorage
function saveAttendanceRecords() {
    localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));
}

// Get salary records from localStorage or initialize empty array
function getSalaryRecords() {
    const storedRecords = localStorage.getItem('salaryRecords');
    return storedRecords ? JSON.parse(storedRecords) : [];
}

// Save salary records to localStorage
function saveSalaryRecords() {
    localStorage.setItem('salaryRecords', JSON.stringify(salaryRecords));
}

// --- Employee Management ---

// Add event listener to save employee button
if (saveEmployeeBtn) {
    saveEmployeeBtn.addEventListener('click', saveEmployee);
}

// Save employee data
function saveEmployee() {
    const name = document.getElementById('employeeName').value;
    const mobile = document.getElementById('employeeMobile').value;
    const address = document.getElementById('employeeAddress').value;
    const joinDate = document.getElementById('employeeJoinDate').value;
    const salaryPerDay = parseFloat(document.getElementById('employeeSalary').value) || dailyRate;

    if (!name || !mobile || !joinDate) {
        alert('অনুগ্রহ করে সকল প্রয়োজনীয় তথ্য পূরণ করুন।');
        return;
    }

    const newEmployee = {
        id: 'EMP' + Date.now(),
        name,
        mobile,
        address,
        joinDate,
        salaryPerDay,
        totalAttendance: 0,
        totalPaid: 0
    };

    employees.push(newEmployee);
    saveEmployees();
    renderEmployeeTable();
    populateEmployeeCheckboxes();
    populateEmployeeSelectors();
    updateDashboardStats();
    employeeForm.reset();
    employeeModal.hide();
}

// Render employee table
function renderEmployeeTable(filteredEmployees = null) {
    const displayEmployees = filteredEmployees || employees;
    employeeTableBody.innerHTML = '';
    
    if (displayEmployees.length === 0) {
        employeeTableBody.innerHTML = '<tr><td colspan="10" class="text-center">কোন কর্মচারী যোগ করা হয়নি</td></tr>';
        return;
    }

    displayEmployees.forEach(emp => {
        const totalSalaryEarned = emp.totalAttendance * emp.salaryPerDay;
        const dueAmount = totalSalaryEarned - emp.totalPaid;
        
        const row = `
            <tr>
                <td>${emp.id}</td>
                <td>${emp.name}</td>
                <td>${emp.mobile}</td>
                <td>${new Date(emp.joinDate).toLocaleDateString('bn-BD')}</td>
                <td>${emp.salaryPerDay.toFixed(2)} টাকা</td>
                <td>${emp.totalAttendance}</td>
                <td>${totalSalaryEarned.toFixed(2)} টাকা</td>
                <td>${emp.totalPaid.toFixed(2)} টাকা</td>
                <td>${dueAmount.toFixed(2)} টাকা</td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="viewEmployeeDetails('${emp.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteEmployee('${emp.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        employeeTableBody.insertAdjacentHTML('beforeend', row);
    });
}

// Delete employee
// --- Backup and Restoration System ---

// Data structure to track deleted items with timestamps
let deletedItems = getDeletedItems();

// Get deleted items from localStorage
function getDeletedItems() {
    const storedItems = localStorage.getItem('deletedItems');
    return storedItems ? JSON.parse(storedItems) : {
        employees: [],
        attendanceRecords: [],
        salaryRecords: []
    };
}

// Save deleted items to localStorage
function saveDeletedItems() {
    localStorage.setItem('deletedItems', JSON.stringify(deletedItems));
}

// Create a backup of all data
function createBackup() {
    const backup = {
        timestamp: new Date().toISOString(),
        employees: JSON.parse(JSON.stringify(employees)),
        attendanceRecords: JSON.parse(JSON.stringify(attendanceRecords)),
        salaryRecords: JSON.parse(JSON.stringify(salaryRecords)),
        deletedItems: JSON.parse(JSON.stringify(deletedItems))
    };
    
    // Store backup in localStorage
    const backups = getBackups();
    backups.push(backup);
    
    // Keep only the last 10 backups to save space
    if (backups.length > 10) {
        backups.shift(); // Remove oldest backup
    }
    
    localStorage.setItem('backups', JSON.stringify(backups));
    
    return backup;
}

// Get all backups
function getBackups() {
    const storedBackups = localStorage.getItem('backups');
    return storedBackups ? JSON.parse(storedBackups) : [];
}

// Restore from a specific backup
function restoreFromBackup(backupIndex) {
    const backups = getBackups();
    if (backupIndex >= 0 && backupIndex < backups.length) {
        const backup = backups[backupIndex];
        
        // Restore data
        employees = backup.employees;
        attendanceRecords = backup.attendanceRecords;
        salaryRecords = backup.salaryRecords;
        
        // Save restored data
        saveEmployees();
        saveAttendanceRecords();
        saveSalaryRecords();
        
        // Refresh UI
        renderEmployeeTable();
        renderAttendanceTable();
        renderSalaryTable();
        populateEmployeeCheckboxes();
        populateEmployeeSelectors();
        updateDashboardStats();
        
        return true;
    }
    return false;
}

// Clean up deleted items older than 15 days
function cleanupDeletedItems() {
    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
    
    // Filter out items older than 15 days
    ['employees', 'attendanceRecords', 'salaryRecords'].forEach(type => {
        deletedItems[type] = deletedItems[type].filter(item => {
            return new Date(item.deletedAt) > fifteenDaysAgo;
        });
    });
    
    saveDeletedItems();
}

// Modify the delete employee function to use soft delete
function deleteEmployee(id) {
    if (confirm('আপনি কি নিশ্চিত যে আপনি এই কর্মচারীকে মুছতে চান?')) {
        // Find the employee to be deleted
        const employeeToDelete = employees.find(emp => emp.id === id);
        
        if (employeeToDelete) {
            // Add deletion timestamp and move to deletedItems
            employeeToDelete.deletedAt = new Date().toISOString();
            deletedItems.employees.push(employeeToDelete);
            saveDeletedItems();
            
            // Remove from active employees
            employees = employees.filter(emp => emp.id !== id);
            saveEmployees();
            
            renderEmployeeTable();
            populateEmployeeCheckboxes();
            populateEmployeeSelectors();
            updateDashboardStats();
            
            // Run cleanup to remove items older than 15 days
            cleanupDeletedItems();
        }
    }
}

// Add automatic backup on application start
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
    
    // Create a backup when the app starts
    createBackup();
    
    // Clean up deleted items older than 15 days
    cleanupDeletedItems();
    
    // Schedule automatic backups every 30 minutes
    setInterval(createBackup, 30 * 60 * 1000);
});

// --- Attendance Management ---

// Add event listener to save attendance button
if (saveAttendanceBtn) {
    saveAttendanceBtn.addEventListener('click', saveAttendance);
}

// Save attendance data
function saveAttendance(event) {
    event.preventDefault();
    const date = document.getElementById('attendanceDate').value;
    
    if (!date) {
        alert('অনুগ্রহ করে তারিখ নির্বাচন করুন।');
        return;
    }

    const checkboxes = document.querySelectorAll('#employeeCheckboxes input[type="checkbox"]:checked');
    if (checkboxes.length === 0) {
        alert('অনুগ্রহ করে কমপক্ষে একজন কর্মচারী নির্বাচন করুন।');
        return;
    }

    // Remove existing attendance records for the selected date
    attendanceRecords = attendanceRecords.filter(record => record.date !== date);

    // Add new attendance records
    const time = new Date().toLocaleTimeString('bn-BD');
    checkboxes.forEach(checkbox => {
        const employeeId = checkbox.value;
        attendanceRecords.push({
            id: 'ATT' + Date.now() + Math.floor(Math.random() * 1000),
            employeeId,
            date,
            time,
            status: 'উপস্থিত'
        });

        // Update employee's total attendance
        const employee = employees.find(emp => emp.id === employeeId);
        if (employee) {
            employee.totalAttendance += 1;
        }
    });

    saveAttendanceRecords();
    saveEmployees(); // Since totalAttendance is updated
    renderAttendanceTable();
    renderEmployeeTable(); // To reflect updated attendance
    updateDashboardStats();
    attendanceForm.reset();
    attendanceModal.hide();
}

// Render attendance table
function renderAttendanceTable(searchTerm = '') {
    attendanceTableBody.innerHTML = '';
    
    if (attendanceRecords.length === 0) {
        attendanceTableBody.innerHTML = '<tr><td colspan="5" class="text-center">কোন হাজিরা রেকর্ড নেই</td></tr>';
        return;
    }

    // Sort by date descending
    const sortedAttendanceRecords = [...attendanceRecords].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Filter by search term if provided
    let filteredRecords = sortedAttendanceRecords;
    if (searchTerm) {
        filteredRecords = sortedAttendanceRecords.filter(record => {
            const employee = employees.find(emp => emp.id === record.employeeId);
            return employee && employee.name.toLowerCase().includes(searchTerm.toLowerCase());
        });
    }

    filteredRecords.forEach(record => {
        const employee = employees.find(emp => emp.id === record.employeeId);
        const row = `
            <tr>
                <td>${record.employeeId}</td>
                <td>${employee ? employee.name : 'N/A'}</td>
                <td>${new Date(record.date).toLocaleDateString('bn-BD')}</td>
                <td>${record.time}</td>
                <td>${record.status}</td>
            </tr>
        `;
        attendanceTableBody.insertAdjacentHTML('beforeend', row);
    });
}

// --- Salary Management ---

// Add event listener to save salary button
if (saveSalaryBtn) {
    saveSalaryBtn.addEventListener('click', paySalary);
}

// Pay salary
function paySalary(event) {
    event.preventDefault();
    const employeeId = document.getElementById('salaryEmployee').value;
    const date = document.getElementById('salaryDate').value;
    const amount = parseFloat(document.getElementById('salaryAmount').value);
    const note = document.getElementById('salaryNote').value;

    if (!employeeId || !date || isNaN(amount) || amount <= 0) {
        alert('অনুগ্রহ করে সকল প্রয়োজনীয় তথ্য সঠিকভাবে পূরণ করুন।');
        return;
    }

    salaryRecords.push({
        id: 'SAL' + Date.now(),
        employeeId,
        date,
        amount,
        note
    });

    const employee = employees.find(e => e.id === employeeId);
    if (employee) {
        employee.totalPaid += amount;
    }

    saveSalaryRecords();
    saveEmployees(); // Since totalPaid is updated
    renderSalaryTable();
    renderEmployeeTable(); // To reflect updated due amount
    updateDashboardStats();
    salaryForm.reset();
    salaryModal.hide();
}

// Render salary table
function renderSalaryTable(searchTerm = '') {
    salaryTableBody.innerHTML = '';
    
    if (salaryRecords.length === 0) {
        salaryTableBody.innerHTML = '<tr><td colspan="5" class="text-center">কোন বেতন প্রদানের রেকর্ড নেই</td></tr>';
        return;
    }
    
    // Sort by date descending
    const sortedSalaryRecords = [...salaryRecords].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Filter by search term if provided
    let filteredRecords = sortedSalaryRecords;
    if (searchTerm) {
        filteredRecords = sortedSalaryRecords.filter(record => {
            const employee = employees.find(emp => emp.id === record.employeeId);
            return employee && employee.name.toLowerCase().includes(searchTerm.toLowerCase());
        });
    }

    filteredRecords.forEach(rec => {
        const employee = employees.find(emp => emp.id === rec.employeeId);
        const row = `
            <tr>
                <td>${rec.employeeId}</td>
                <td>${employee ? employee.name : 'N/A'}</td>
                <td>${new Date(rec.date).toLocaleDateString('bn-BD')}</td>
                <td>${rec.amount.toFixed(2)} টাকা</td>
                <td>${rec.note || '-'}</td>
            </tr>
        `;
        salaryTableBody.insertAdjacentHTML('beforeend', row);
    });
}

// --- Dashboard & UI Updates ---
function updateDashboardStats() {
    totalEmployeesEl.textContent = employees.length;

    const today = new Date().toISOString().split('T')[0];
    const presentTodayCount = attendanceRecords.filter(rec => rec.date === today).length;
    presentTodayEl.textContent = presentTodayCount;

    let totalDue = 0;
    employees.forEach(emp => {
        const totalSalaryEarned = emp.totalAttendance * emp.salaryPerDay;
        totalDue += (totalSalaryEarned - emp.totalPaid);
    });
    totalDueAmountEl.textContent = `${totalDue.toFixed(2)} টাকা`;
}

function populateEmployeeCheckboxes() {
    employeeCheckboxes.innerHTML = '';
    if (employees.length === 0) {
        employeeCheckboxes.innerHTML = '<p class="text-muted">কোন কর্মচারী যোগ করা হয়নি।</p>';
        return;
    }
    employees.forEach(emp => {
        const checkbox = `
            <div class="col">
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="${emp.id}" id="att_${emp.id}">
                    <label class="form-check-label" for="att_${emp.id}">
                        ${emp.name} (${emp.id})
                    </label>
                </div>
            </div>
        `;
        employeeCheckboxes.insertAdjacentHTML('beforeend', checkbox);
    });
}

function populateEmployeeSelectors() {
    salaryEmployeeSelect.innerHTML = '<option value="">কর্মচারী নির্বাচন করুন</option>';
    if (employees.length === 0) return;

    employees.forEach(emp => {
        const totalSalaryEarned = emp.totalAttendance * emp.salaryPerDay;
        const dueAmount = totalSalaryEarned - emp.totalPaid;
        const option = `<option value="${emp.id}">${emp.name} (${emp.id}) - বকেয়া: ${dueAmount.toFixed(2)} টাকা</option>`;
        salaryEmployeeSelect.insertAdjacentHTML('beforeend', option);
    });
}

// --- Report Generation ---
function generateReport() {
    let reportContent = `
        <h1>আলামিন এন্টারপ্রাইজ - কর্মচারী রিপোর্ট</h1>
        <h2>কর্মচারী তালিকা</h2>
        <table border="1" cellpadding="5" cellspacing="0" style="width:100%; border-collapse: collapse;">
            <thead>
                <tr>
                    <th>আইডি</th><th>নাম</th><th>মোবাইল</th><th>যোগদানের তারিখ</th>
                    <th>মোট হাজিরা</th><th>দৈনিক বেতন</th><th>মোট অর্জিত</th><th>মোট পরিশোধিত</th><th>বকেয়া</th>
                </tr>
            </thead>
            <tbody>
    `;
    employees.forEach(emp => {
        const totalSalaryEarned = emp.totalAttendance * emp.salaryPerDay;
        const dueAmount = totalSalaryEarned - emp.totalPaid;
        reportContent += `
            <tr>
                <td>${emp.id}</td><td>${emp.name}</td><td>${emp.mobile}</td>
                <td>${new Date(emp.joinDate).toLocaleDateString('bn-BD')}</td>
                <td>${emp.totalAttendance}</td><td>${emp.salaryPerDay.toFixed(2)}</td>
                <td>${totalSalaryEarned.toFixed(2)}</td><td>${emp.totalPaid.toFixed(2)}</td>
                <td>${dueAmount.toFixed(2)}</td>
            </tr>
        `;
    });
    reportContent += '</tbody></table>';

    reportContent += `
        <h2>আজকের হাজিরা (${new Date().toLocaleDateString('bn-BD')})</h2>
        <table border="1" cellpadding="5" cellspacing="0" style="width:100%; border-collapse: collapse;">
            <thead><tr><th>আইডি</th><th>নাম</th><th>সময়</th><th>স্ট্যাটাস</th></tr></thead>
            <tbody>
    `;
    const today = new Date().toISOString().split('T')[0];
    const todaysAttendance = attendanceRecords.filter(rec => rec.date === today);
    if (todaysAttendance.length > 0) {
        todaysAttendance.forEach(rec => {
            const employee = employees.find(emp => emp.id === rec.employeeId);
            reportContent += `<tr><td>${rec.employeeId}</td><td>${employee ? employee.name : 'N/A'}</td><td>${rec.time}</td><td>উপস্থিত</td></tr>`;
        });
    } else {
        reportContent += '<tr><td colspan="4">আজকের কোন হাজিরা রেকর্ড নেই</td></tr>';
    }
    reportContent += '</tbody></table>';

    // Open in new window and print
    const reportWindow = window.open('', '_blank');
    reportWindow.document.write('<html><head><title>রিপোর্ট</title>');
    reportWindow.document.write('<style>body{font-family: Arial, sans-serif;} table{width:100%;border-collapse:collapse;} th,td{border:1px solid #ccc;padding:8px;text-align:left;} h1,h2{text-align:center;}</style>');
    reportWindow.document.write('</head><body>');
    reportWindow.document.write(reportContent);
    reportWindow.document.write('</body></html>');
    reportWindow.document.close(); // Important for some browsers
    reportWindow.print();
}

function viewEmployeeDetails(employeeId) {
    const emp = employees.find(e => e.id === employeeId);
    if (!emp) {
        alert('কর্মচারী পাওয়া যায়নি!');
        return;
    }

    const empAttendance = attendanceRecords.filter(rec => rec.employeeId === employeeId);
    const empSalaries = salaryRecords.filter(rec => rec.employeeId === employeeId);
    const totalSalaryEarned = emp.totalAttendance * emp.salaryPerDay;
    const dueAmount = totalSalaryEarned - emp.totalPaid;

    let detailsContent = `
        <h2>কর্মচারীর বিবরণ: ${emp.name} (${emp.id})</h2>
        <p><strong>মোবাইল:</strong> ${emp.mobile}</p>
        <p><strong>ঠিকানা:</strong> ${emp.address}</p>
        <p><strong>যোগদানের তারিখ:</strong> ${new Date(emp.joinDate).toLocaleDateString('bn-BD')}</p>
        <p><strong>দৈনিক বেতন:</strong> ${emp.salaryPerDay.toFixed(2)} টাকা</p>
        <p><strong>মোট হাজিরা:</strong> ${emp.totalAttendance} দিন</p>
        <p><strong>মোট অর্জিত বেতন:</strong> ${totalSalaryEarned.toFixed(2)} টাকা</p>
        <p><strong>মোট পরিশোধিত বেতন:</strong> ${emp.totalPaid.toFixed(2)} টাকা</p>
        <p><strong>বকেয়া:</strong> ${dueAmount.toFixed(2)} টাকা</p>

        <h3>হাজিরা রেকর্ড</h3>
    `;
    if (empAttendance.length > 0) {
        detailsContent += '<table border="1" cellpadding="5" cellspacing="0" style="width:100%; border-collapse: collapse;"><thead><tr><th>তারিখ</th><th>সময়</th><th>স্ট্যাটাস</th></tr></thead><tbody>';
        empAttendance.sort((a,b) => new Date(b.date) - new Date(a.date)).forEach(att => {
            detailsContent += `<tr><td>${new Date(att.date).toLocaleDateString('bn-BD')}</td><td>${att.time}</td><td>${att.status}</td></tr>`;
        });
        detailsContent += '</tbody></table>';
    } else {
        detailsContent += '<p>কোন হাজিরা রেকর্ড নেই।</p>';
    }

    detailsContent += `
        <h3>বেতন প্রদানের রেকর্ড</h3>
    `;
    if (empSalaries.length > 0) {
        detailsContent += '<table border="1" cellpadding="5" cellspacing="0" style="width:100%; border-collapse: collapse;"><thead><tr><th>তারিখ</th><th>পরিমাণ</th><th>মন্তব্য</th></tr></thead><tbody>';
        empSalaries.sort((a,b) => new Date(b.date) - new Date(a.date)).forEach(sal => {
            detailsContent += `<tr><td>${new Date(sal.date).toLocaleDateString('bn-BD')}</td><td>${sal.amount.toFixed(2)} টাকা</td><td>${sal.note || '-'}</td></tr>`;
        });
        detailsContent += '</tbody></table>';
    } else {
        detailsContent += '<p>কোন বেতন প্রদানের রেকর্ড নেই।</p>';
    }

    const detailWindow = window.open('', '_blank');
    detailWindow.document.write('<html><head><title>কর্মচারীর বিবরণ</title>');
    detailWindow.document.write('<style>body{font-family: Arial, sans-serif;} table{width:100%;border-collapse:collapse;} th,td{border:1px solid #ccc;padding:8px;text-align:left;} h2,h3{text-align:center;}</style>');
    detailWindow.document.write('</head><body>');
    detailWindow.document.write(detailsContent);
    detailWindow.document.write('<script>window.onload = function() { window.print(); } </script>'); // Auto print
    detailWindow.document.write('</body></html>');
    detailWindow.document.close();
}

// --- Search Functionality ---
if (searchInput) {
    searchInput.addEventListener('input', handleSearch);
}

function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    
    // Filter employees
    const filteredEmployees = employees.filter(employee => 
        employee.name.toLowerCase().includes(searchTerm) ||
        employee.id.toLowerCase().includes(searchTerm) ||
        employee.mobile.toLowerCase().includes(searchTerm)
    );
    
    // Update all tables with the search term
    renderEmployeeTable(filteredEmployees);
    renderAttendanceTable(searchTerm);
    renderSalaryTable(searchTerm);
}

// --- Chart Initialization ---
function initializeChart() {
    const ctx = document.getElementById('attendanceChart');
    if (!ctx) return;

    // Get attendance data for the last 7 days
    const dates = [];
    const attendanceCounts = [];
    const salaryPayments = [];

    // Generate last 7 days
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        dates.push(date.toLocaleDateString('bn-BD', { month: 'short', day: 'numeric' }));
        
        // Count attendance for this date
        const count = attendanceRecords.filter(rec => rec.date === dateString).length;
        attendanceCounts.push(count);
        
        // Sum salary payments for this date
        const payments = salaryRecords
            .filter(rec => rec.date === dateString)
            .reduce((sum, rec) => sum + rec.amount, 0);
        salaryPayments.push(payments);
    }

    // Create chart
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'দৈনিক হাজিরা',
                    data: attendanceCounts,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                },
                {
                    label: 'দৈনিক বেতন প্রদান (টাকা)',
                    data: salaryPayments,
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1,
                    type: 'line'
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeOutQuart'
            }
        }
    });
}

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initApp);

// --- Backup UI Functions ---

// Add event listener to create backup button
const createBackupBtn = document.getElementById('createBackupBtn');
if (createBackupBtn) {
    createBackupBtn.addEventListener('click', function() {
        const backup = createBackup();
        renderBackupTable();
        alert('ব্যাকআপ সফলভাবে তৈরি করা হয়েছে।');
    });
}

// Render the backup table
function renderBackupTable() {
    const backupTableBody = document.getElementById('backupTableBody');
    if (!backupTableBody) return;
    
    backupTableBody.innerHTML = '';
    
    const backups = getBackups();
    if (backups.length === 0) {
        backupTableBody.innerHTML = '<tr><td colspan="6" class="text-center">কোন ব্যাকআপ নেই</td></tr>';
        return;
    }
    
    backups.forEach((backup, index) => {
        const date = new Date(backup.timestamp);
        const formattedDate = date.toLocaleDateString('bn-BD') + ' ' + date.toLocaleTimeString('bn-BD');
        
        const row = `
            <tr>
                <td>${backups.length - index}</td>
                <td>${formattedDate}</td>
                <td>${backup.employees.length}</td>
                <td>${backup.attendanceRecords.length}</td>
                <td>${backup.salaryRecords.length}</td>
                <td>
                    <button class="btn btn-sm btn-success" onclick="restoreBackup(${index})">
                        <i class="fas fa-undo"></i> পুনরুদ্ধার
                    </button>
                </td>
            </tr>
        `;
        backupTableBody.insertAdjacentHTML('beforeend', row);
    });
}

// Restore from a backup
function restoreBackup(index) {
    if (confirm('আপনি কি নিশ্চিত যে আপনি এই ব্যাকআপ থেকে পুনরুদ্ধার করতে চান? বর্তমান সমস্ত ডেটা প্রতিস্থাপিত হবে।')) {
        if (restoreFromBackup(index)) {
            alert('ডেটা সফলভাবে পুনরুদ্ধার করা হয়েছে।');
            // Close the modal
            const backupModal = bootstrap.Modal.getInstance(document.getElementById('backupModal'));
            if (backupModal) {
                backupModal.hide();
            }
        } else {
            alert('পুনরুদ্ধার করতে ব্যর্থ হয়েছে।');
        }
    }
}

// Render deleted items tables
function renderDeletedItemsTables() {
    renderDeletedEmployeesTable();
    renderDeletedAttendanceTable();
    renderDeletedSalaryTable();
}

// Render deleted employees table
function renderDeletedEmployeesTable() {
    const tableBody = document.getElementById('deletedEmployeesTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    if (deletedItems.employees.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center">কোন মুছে ফেলা কর্মচারী নেই</td></tr>';
        return;
    }
    
    deletedItems.employees.forEach(emp => {
        const deletedDate = new Date(emp.deletedAt);
        const formattedDeletedDate = deletedDate.toLocaleDateString('bn-BD');
        
        // Calculate days remaining before permanent deletion
        const fifteenDaysLater = new Date(deletedDate);
        fifteenDaysLater.setDate(fifteenDaysLater.getDate() + 15);
        const daysRemaining = Math.ceil((fifteenDaysLater - new Date()) / (1000 * 60 * 60 * 24));
        
        const row = `
            <tr>
                <td>${emp.id}</td>
                <td>${emp.name}</td>
                <td>${formattedDeletedDate}</td>
                <td>${daysRemaining} দিন</td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="restoreEmployee('${emp.id}')">
                        <i class="fas fa-undo"></i> পুনরুদ্ধার
                    </button>
                </td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', row);
    });
}

// Restore a deleted employee
function restoreEmployee(id) {
    const empIndex = deletedItems.employees.findIndex(emp => emp.id === id);
    if (empIndex !== -1) {
        // Remove the deletedAt property
        const empToRestore = deletedItems.employees[empIndex];
        delete empToRestore.deletedAt;
        
        // Add back to active employees
        employees.push(empToRestore);
        saveEmployees();
        
        // Remove from deleted items
        deletedItems.employees.splice(empIndex, 1);
        saveDeletedItems();
        
        // Update UI
        renderDeletedEmployeesTable();
        renderEmployeeTable();
        populateEmployeeCheckboxes();
        populateEmployeeSelectors();
        updateDashboardStats();
        
        alert('কর্মচারী সফলভাবে পুনরুদ্ধার করা হয়েছে।');
    }
}

// Similar functions for attendance and salary records
function renderDeletedAttendanceTable() {
    // Implementation similar to renderDeletedEmployeesTable
    const tableBody = document.getElementById('deletedAttendanceTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    if (deletedItems.attendanceRecords.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center">কোন মুছে ফেলা হাজিরা রেকর্ড নেই</td></tr>';
        return;
    }
    
    // Implementation details...
}

function renderDeletedSalaryTable() {
    // Implementation similar to renderDeletedEmployeesTable
    const tableBody = document.getElementById('deletedSalaryTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    if (deletedItems.salaryRecords.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center">কোন মুছে ফেলা বেতন রেকর্ড নেই</td></tr>';
        return;
    }
    
    // Implementation details...
}

// Add event listener to show backup modal
document.getElementById('backupModal')?.addEventListener('show.bs.modal', function() {
    renderBackupTable();
    renderDeletedItemsTables();
});

// --- Offline Backup System ---

// Function to create an offline backup file
function createOfflineBackup() {
    // Gather all data
    const backupData = {
        timestamp: new Date().toISOString(),
        employees: JSON.parse(JSON.stringify(employees)),
        attendanceRecords: JSON.parse(JSON.stringify(attendanceRecords)),
        salaryRecords: JSON.parse(JSON.stringify(salaryRecords)),
        deletedItems: JSON.parse(JSON.stringify(deletedItems))
    };
    
    // Convert to JSON string
    const backupJSON = JSON.stringify(backupData, null, 2);
    
    // Create a Blob with the JSON data
    const blob = new Blob([backupJSON], { type: 'application/json' });
    
    // Create a date string for the filename
    const dateStr = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `alamin_backup_${dateStr}.json`;
    
    // Create a download link and trigger it
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    return fileName;
}

// Function to restore from an offline backup file
function restoreFromOfflineBackup(fileInput) {
    return new Promise((resolve, reject) => {
        if (!fileInput.files || fileInput.files.length === 0) {
            reject('কোন ফাইল নির্বাচন করা হয়নি।');
            return;
        }
        
        const file = fileInput.files[0];
        if (!file.name.endsWith('.json')) {
            reject('অনুগ্রহ করে একটি বৈধ JSON ব্যাকআপ ফাইল নির্বাচন করুন।');
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = function(event) {
            try {
                const backupData = JSON.parse(event.target.result);
                
                // Validate backup data structure
                if (!backupData.employees || !backupData.attendanceRecords || 
                    !backupData.salaryRecords || !backupData.timestamp) {
                    reject('অবৈধ ব্যাকআপ ফাইল ফরম্যাট।');
                    return;
                }
                
                // Restore data
                employees = backupData.employees;
                attendanceRecords = backupData.attendanceRecords;
                salaryRecords = backupData.salaryRecords;
                
                // Restore deleted items if available
                if (backupData.deletedItems) {
                    deletedItems = backupData.deletedItems;
                    saveDeletedItems();
                }
                
                // Save restored data
                saveEmployees();
                saveAttendanceRecords();
                saveSalaryRecords();
                
                // Refresh UI
                renderEmployeeTable();
                renderAttendanceTable();
                renderSalaryTable();
                populateEmployeeCheckboxes();
                populateEmployeeSelectors();
                updateDashboardStats();
                
                resolve('ডেটা সফলভাবে পুনরুদ্ধার করা হয়েছে।');
            } catch (error) {
                reject('ব্যাকআপ ফাইল পার্স করতে ব্যর্থ: ' + error.message);
            }
        };
        
        reader.onerror = function() {
            reject('ফাইল পড়তে ব্যর্থ হয়েছে।');
        };
        
        reader.readAsText(file);
    });
}

// Add event listeners for offline backup functionality
document.getElementById('createOfflineBackupBtn')?.addEventListener('click', function() {
    const fileName = createOfflineBackup();
    alert(`ব্যাকআপ সফলভাবে তৈরি করা হয়েছে: ${fileName}`);
});

document.getElementById('uploadBackupBtn')?.addEventListener('click', function() {
    const uploadForm = document.getElementById('uploadBackupForm');
    uploadForm.classList.remove('d-none');
});

document.getElementById('cancelUploadBtn')?.addEventListener('click', function() {
    const uploadForm = document.getElementById('uploadBackupForm');
    uploadForm.classList.add('d-none');
    document.getElementById('backupFileInput').value = '';
});

document.getElementById('confirmUploadBtn')?.addEventListener('click', function() {
    const fileInput = document.getElementById('backupFileInput');
    restoreFromOfflineBackup(fileInput)
        .then(message => {
            alert(message);
            document.getElementById('uploadBackupForm').classList.add('d-none');
            fileInput.value = '';
            // Close the modal
            const backupModal = bootstrap.Modal.getInstance(document.getElementById('backupModal'));
            if (backupModal) {
                backupModal.hide();
            }
        })
        .catch(error => {
            alert(error);
        });
});

// Function to export data as CSV
function exportDataAsCSV(dataType) {
    let csvContent = '';
    let fileName = '';
    
    if (dataType === 'employees') {
        // Headers
        csvContent = 'আইডি,নাম,মোবাইল,ঠিকানা,যোগদানের তারিখ,দৈনিক বেতন,মোট হাজিরা,মোট পরিশোধিত\n';
        
        // Data rows
        employees.forEach(emp => {
            csvContent += `"${emp.id}","${emp.name}","${emp.mobile}","${emp.address || ''}","${emp.joinDate}",${emp.salaryPerDay},${emp.totalAttendance},${emp.totalPaid}\n`;
        });
        
        fileName = 'কর্মচারী_তালিকা.csv';
    } 
    else if (dataType === 'attendance') {
        // Headers
        csvContent = 'আইডি,কর্মচারী আইডি,কর্মচারীর নাম,তারিখ,সময়,স্ট্যাটাস\n';
        
        // Data rows
        attendanceRecords.forEach(record => {
            const employee = employees.find(emp => emp.id === record.employeeId);
            csvContent += `"${record.id}","${record.employeeId}","${employee ? employee.name : 'N/A'}","${record.date}","${record.time}","${record.status}"\n`;
        });
        
        fileName = 'হাজিরা_রেকর্ড.csv';
    }
    else if (dataType === 'salary') {
        // Headers
        csvContent = 'আইডি,কর্মচারী আইডি,কর্মচারীর নাম,তারিখ,পরিমাণ,মন্তব্য\n';
        
        // Data rows
        salaryRecords.forEach(record => {
            const employee = employees.find(emp => emp.id === record.employeeId);
            csvContent += `"${record.id}","${record.employeeId}","${employee ? employee.name : 'N/A'}","${record.date}",${record.amount},"${record.note || ''}"\n`;
        });
        
        fileName = 'বেতন_রেকর্ড.csv';
    }
    
    // Create a Blob with the CSV data
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Create a download link and trigger it
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}