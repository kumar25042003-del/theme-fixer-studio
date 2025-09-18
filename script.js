// Anna University CGPA Calculator - JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the calculator
    initializeCalculator();
    initializeTheme();
});

function initializeCalculator() {
    // Event listeners for calculation type switching
    const calcTypeInputs = document.querySelectorAll('input[name="calcType"]');
    calcTypeInputs.forEach(input => {
        input.addEventListener('change', switchCalculator);
    });

    // Event listeners for buttons
    document.getElementById('add-subject').addEventListener('click', addSubjectRow);
    document.getElementById('add-semester').addEventListener('click', addSemesterRow);
    document.getElementById('calculate-gpa').addEventListener('click', calculateGPA);
    document.getElementById('calculate-cgpa').addEventListener('click', calculateCGPA);

    // Event delegation for remove buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-subject')) {
            removeSubjectRow(e.target);
        } else if (e.target.classList.contains('remove-semester')) {
            removeSemesterRow(e.target);
        }
    });

    // Auto-calculate credits based on course type
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('course-type')) {
            autoFillCredits(e.target);
        }
    });
}

function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');
    
    // Load saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

function applyTheme(theme) {
    const themeIcon = document.querySelector('.theme-icon');
    document.documentElement.setAttribute('data-theme', theme);
    
    if (theme === 'dark') {
        themeIcon.textContent = '☀️';
    } else {
        themeIcon.textContent = '🌙';
    }
}

function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

function switchCalculator() {
    const selectedType = document.querySelector('input[name="calcType"]:checked').value;
    const gpaCalculator = document.getElementById('gpa-calculator');
    const cgpaCalculator = document.getElementById('cgpa-calculator');

    if (selectedType === 'gpa') {
        gpaCalculator.classList.add('active');
        cgpaCalculator.classList.remove('active');
    } else {
        gpaCalculator.classList.remove('active');
        cgpaCalculator.classList.add('active');
    }

    // Clear previous results
    document.getElementById('gpa-result').classList.remove('show');
    document.getElementById('cgpa-result').classList.remove('show');
}

function addSubjectRow() {
    const subjectsList = document.getElementById('subjects-list');
    const newRow = document.createElement('div');
    newRow.className = 'subject-row';
    newRow.innerHTML = `
        <select class="course-type">
            <option value="theory">Theory (3 credits)</option>
            <option value="practical">Practical (4 credits)</option>
            <option value="project">Project (1 credit)</option>
            <option value="manual">Manual Credit Entry</option>
        </select>
        <input type="number" placeholder="Credits" class="credits" min="1" max="10" step="1" value="3">
        <select class="grade">
            <option value="">Select Grade</option>
            <option value="10">O (10)</option>
            <option value="9">A+ (9)</option>
            <option value="8">A (8)</option>
            <option value="7">B+ (7)</option>
            <option value="6">B (6)</option>
            <option value="5">C (5)</option>
            <option value="0">RA (0)</option>
            <option value="0">SA (0)</option>
            <option value="0">W (0)</option>
        </select>
        <button type="button" class="remove-subject">×</button>
    `;
    
    // Add animation
    newRow.style.opacity = '0';
    newRow.style.transform = 'translateY(-20px)';
    subjectsList.appendChild(newRow);
    
    // Trigger animation
    setTimeout(() => {
        newRow.style.transition = 'all 0.3s ease';
        newRow.style.opacity = '1';
        newRow.style.transform = 'translateY(0)';
    }, 10);
    
    showNotification('Course added successfully!', 'success');
}

function removeSubjectRow(button) {
    const subjectsList = document.getElementById('subjects-list');
    if (subjectsList.children.length > 1) {
        const row = button.parentElement;
        row.style.transition = 'all 0.3s ease';
        row.style.opacity = '0';
        row.style.transform = 'translateX(-100%)';
        
        setTimeout(() => {
            row.remove();
        }, 300);
        
        showNotification('Course removed!', 'warning');
    } else {
        showNotification('At least one course is required!', 'error');
    }
}

function addSemesterRow() {
    const semestersList = document.getElementById('semesters-list');
    const newRow = document.createElement('div');
    newRow.className = 'semester-row';
    newRow.innerHTML = `
        <input type="text" placeholder="Semester Name" class="semester-name-input">
        <input type="number" placeholder="Total Credits" class="semester-credits" min="1" step="1">
        <input type="number" placeholder="GPA" class="semester-gpa" min="0" max="10" step="0.01">
        <button type="button" class="remove-semester">×</button>
    `;
    
    // Add animation
    newRow.style.opacity = '0';
    newRow.style.transform = 'translateY(-20px)';
    semestersList.appendChild(newRow);
    
    // Trigger animation
    setTimeout(() => {
        newRow.style.transition = 'all 0.3s ease';
        newRow.style.opacity = '1';
        newRow.style.transform = 'translateY(0)';
    }, 10);
    
    showNotification('Semester added successfully!', 'success');
}

function removeSemesterRow(button) {
    const semestersList = document.getElementById('semesters-list');
    if (semestersList.children.length > 1) {
        const row = button.parentElement;
        row.style.transition = 'all 0.3s ease';
        row.style.opacity = '0';
        row.style.transform = 'translateX(-100%)';
        
        setTimeout(() => {
            row.remove();
        }, 300);
        
        showNotification('Semester removed!', 'warning');
    } else {
        showNotification('At least one semester is required!', 'error');
    }
}

function autoFillCredits(courseTypeSelect) {
    const creditsInput = courseTypeSelect.parentElement.querySelector('.credits');
    const courseType = courseTypeSelect.value;
    
    // Set default credits based on course type
    switch (courseType) {
        case 'theory':
            creditsInput.value = 3;
            creditsInput.disabled = true;
            creditsInput.style.opacity = '0.7';
            break;
        case 'practical':
            creditsInput.value = 4;
            creditsInput.disabled = true;
            creditsInput.style.opacity = '0.7';
            break;
        case 'project':
            creditsInput.value = 1;
            creditsInput.disabled = true;
            creditsInput.style.opacity = '0.7';
            break;
        case 'manual':
            creditsInput.value = '';
            creditsInput.disabled = false;
            creditsInput.style.opacity = '1';
            creditsInput.placeholder = "Enter credits";
            creditsInput.focus();
            break;
        default:
            creditsInput.value = '';
            creditsInput.disabled = false;
            creditsInput.style.opacity = '1';
    }
}

function calculateGPA() {
    const subjectRows = document.querySelectorAll('.subject-row');
    let totalCredits = 0;
    let totalGradePoints = 0;
    let courses = [];
    let gradeDistribution = {
        'O': 0, 'A+': 0, 'A': 0, 'B+': 0, 'B': 0, 'C': 0, 'RA/SA/W': 0
    };

    let hasErrors = false;

    // Validate and collect data
    subjectRows.forEach((row, index) => {
        const courseType = row.querySelector('.course-type');
        const courseTypeText = courseType.options[courseType.selectedIndex].text;
        const credits = parseFloat(row.querySelector('.credits').value);
        const gradeValue = parseFloat(row.querySelector('.grade').value);
        const gradeText = row.querySelector('.grade').selectedOptions[0]?.textContent || '';

        if (!credits || isNaN(gradeValue) || gradeText === 'Select Grade' || gradeText === '') {
            showNotification(`Please fill all fields for Course ${index + 1}`, 'error');
            hasErrors = true;
            return;
        }

        if (credits < 1 || credits > 10) {
            showNotification(`Credits for Course ${index + 1} should be between 1 and 10`, 'error');
            hasErrors = true;
            return;
        }

        const gradePoints = credits * gradeValue;
        totalCredits += credits;
        totalGradePoints += gradePoints;

        courses.push({
            type: courseTypeText,
            credits: credits,
            grade: gradeText.split(' ')[0], // Extract grade letter
            gradeValue: gradeValue,
            gradePoints: gradePoints
        });

        // Count grade distribution
        const gradeLetter = gradeText.split(' ')[0];
        if (gradeLetter === 'RA' || gradeLetter === 'SA' || gradeLetter === 'W') {
            gradeDistribution['RA/SA/W']++;
        } else {
            gradeDistribution[gradeLetter]++;
        }
    });

    if (hasErrors) return;

    const gpa = totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : 0;
    const semesterName = document.getElementById('semester-name').value.trim() || 'Current Semester';

    displayGPAResult(semesterName, courses, totalCredits, gpa, gradeDistribution);
    showNotification(`GPA calculated successfully: ${gpa}/10`, 'success');
}

function displayGPAResult(semesterName, courses, totalCredits, gpa, gradeDistribution) {
    const resultSection = document.getElementById('gpa-result');
    
    // Determine performance level
    const performanceLevel = getPerformanceLevel(parseFloat(gpa));
    
    let coursesHTML = courses.map(course => `
        <div class="result-item">
            <span>${course.type}</span>
            <span>${course.credits} credits × ${course.grade} = ${course.gradePoints.toFixed(2)} points</span>
        </div>
    `).join('');

    let gradeDistHTML = Object.keys(gradeDistribution)
        .filter(grade => gradeDistribution[grade] > 0)
        .map(grade => `<span class="grade-count">${grade}: ${gradeDistribution[grade]}</span>`)
        .join('');

    resultSection.innerHTML = `
        <h4>${semesterName} - GPA Result</h4>
        <div class="result-item main">
            <span>GPA:</span>
            <span>${gpa}/10</span>
        </div>
        <div class="result-item main">
            <span>Total Credits:</span>
            <span>${totalCredits}</span>
        </div>
        <div class="performance-indicator">
            <div>Performance Level</div>
            <div class="performance-text">${performanceLevel.text}</div>
        </div>
        <div class="grade-distribution">
            <h4>Course Breakdown:</h4>
            ${coursesHTML}
        </div>
        <div class="grade-distribution">
            <h4>Grade Distribution:</h4>
            <div style="margin-top: 10px;">
                ${gradeDistHTML}
            </div>
        </div>
    `;

    resultSection.classList.add('show');
}

function calculateCGPA() {
    const semesterRows = document.querySelectorAll('.semester-row');
    let totalCredits = 0;
    let totalGradePoints = 0;
    let semesters = [];
    let hasErrors = false;

    // Validate and collect data
    semesterRows.forEach((row, index) => {
        const semesterName = row.querySelector('.semester-name-input').value.trim();
        const credits = parseFloat(row.querySelector('.semester-credits').value);
        const gpa = parseFloat(row.querySelector('.semester-gpa').value);

        if (!semesterName || !credits || isNaN(gpa)) {
            showNotification(`Please fill all fields for Semester ${index + 1}`, 'error');
            hasErrors = true;
            return;
        }

        if (gpa < 0 || gpa > 10) {
            showNotification(`GPA for Semester ${index + 1} should be between 0 and 10`, 'error');
            hasErrors = true;
            return;
        }

        if (credits < 1) {
            showNotification(`Credits for Semester ${index + 1} should be at least 1`, 'error');
            hasErrors = true;
            return;
        }

        const gradePoints = credits * gpa;
        totalCredits += credits;
        totalGradePoints += gradePoints;

        semesters.push({
            name: semesterName,
            credits: credits,
            gpa: gpa.toFixed(2),
            gradePoints: gradePoints
        });
    });

    if (hasErrors) return;

    const cgpa = totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : 0;

    displayCGPAResult(semesters, totalCredits, cgpa);
    showNotification(`CGPA calculated successfully: ${cgpa}/10`, 'success');
}

function displayCGPAResult(semesters, totalCredits, cgpa) {
    const resultSection = document.getElementById('cgpa-result');
    
    // Determine performance level
    const performanceLevel = getPerformanceLevel(parseFloat(cgpa));
    const academicStanding = getAcademicStanding(parseFloat(cgpa));
    
    let semestersHTML = semesters.map(semester => `
        <div class="result-item">
            <span>${semester.name}</span>
            <span>${semester.credits} credits × ${semester.gpa} = ${semester.gradePoints.toFixed(2)} points</span>
        </div>
    `).join('');

    resultSection.innerHTML = `
        <h4>Overall CGPA Result</h4>
        <div class="result-item main">
            <span>CGPA:</span>
            <span>${cgpa}/10</span>
        </div>
        <div class="result-item main">
            <span>Total Credits:</span>
            <span>${totalCredits}</span>
        </div>
        <div class="result-item main">
            <span>Semesters:</span>
            <span>${semesters.length}</span>
        </div>
        <div class="performance-indicator">
            <div>Overall Performance Level</div>
            <div class="performance-text">${performanceLevel.text}</div>
        </div>
        <div class="grade-distribution">
            <h4>Academic Standing:</h4>
            <div style="margin-top: 10px;">
                <span class="grade-count">${academicStanding}</span>
            </div>
        </div>
        <div class="grade-distribution">
            <h4>Semester Breakdown:</h4>
            ${semestersHTML}
        </div>
    `;

    resultSection.classList.add('show');
}

function getPerformanceLevel(score) {
    if (score >= 9.5) {
        return { text: "Outstanding Performance", color: "#4CAF50" };
    } else if (score >= 8.5) {
        return { text: "Excellent Performance", color: "#8BC34A" };
    } else if (score >= 7.5) {
        return { text: "Very Good Performance", color: "#CDDC39" };
    } else if (score >= 6.5) {
        return { text: "Good Performance", color: "#FFC107" };
    } else if (score >= 5.5) {
        return { text: "Average Performance", color: "#FF9800" };
    } else if (score >= 4.5) {
        return { text: "Below Average Performance", color: "#FF5722" };
    } else {
        return { text: "Poor Performance", color: "#F44336" };
    }
}

function getAcademicStanding(cgpa) {
    if (cgpa >= 9.0) return "First Class with Distinction";
    if (cgpa >= 7.5) return "First Class";
    if (cgpa >= 6.5) return "Second Class";
    if (cgpa >= 5.0) return "Third Class";
    return "Needs Improvement";
}