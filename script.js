// Handle custom input visibility
function setupCustomInputs() {
    const selects = [
        { select: 'numUsers', custom: 'customUsers' },
        { select: 'ramPerUser', custom: 'customRam' },
        { select: 'cpuCores', custom: 'customCpu' },
        { select: 'totalRam', custom: 'customTotalRam' },
        { select: 'totalStorage', custom: 'customStorage' },
        { select: 'storagePerUser', custom: 'customStoragePerUser' },
        { select: 'baseStorage', custom: 'customBaseStorage' },
        { select: 'baseRam', custom: 'customBaseRam' }
    ];

    selects.forEach(({ select, custom }) => {
        const selectEl = document.getElementById(select);
        const customEl = document.getElementById(custom);

        selectEl.addEventListener('change', () => {
            if (selectEl.value === 'custom') {
                customEl.classList.remove('hidden');
                customEl.focus();
            } else {
                customEl.classList.add('hidden');
            }
        });
    });

    // Auto-update appType based on ramPerUser
    document.getElementById('appType').addEventListener('change', (e) => {
        const ramSelect = document.getElementById('ramPerUser');
        const mapping = {
            'light': '5',
            'medium': '25',
            'heavy': '50',
            'veryHeavy': '100'
        };
        if (ramSelect.value !== 'custom') {
            ramSelect.value = mapping[e.target.value] || '25';
        }
    });
}

// Get value from select or custom input
function getValue(selectId, customId) {
    const select = document.getElementById(selectId);
    const customInput = document.getElementById(customId);

    if (select.value === 'custom') {
        return parseFloat(customInput.value) || 0;
    }
    return parseFloat(select.value) || 0;
}

// CPU intensity mapping
function getCpuMultiplier(intensity) {
    const multipliers = {
        'low': 0.3,
        'medium': 0.6,
        'high': 0.85,
        'veryHigh': 1.2
    };
    return multipliers[intensity] || 0.6;
}

// Calculate CPU usage based on users and intensity
function calculateCpuUsage(users, cores, intensity) {
    const cpuMultiplier = getCpuMultiplier(intensity);
    // Assume each user generates periodic requests
    // Base calculation: users * intensity / (cores * 100)
    const baseLoad = (users * cpuMultiplier) / cores;

    // Normalize to percentage (assuming 100 users at medium intensity = ~60% on 2 cores)
    const cpuPercentage = (baseLoad / 30) * 100;

    return Math.min(cpuPercentage, 150); // Cap at 150% to show overload
}

// Update progress bar with color coding
function updateProgressBar(elementId, percentage) {
    const progressBar = document.getElementById(elementId);
    progressBar.style.width = Math.min(percentage, 100) + '%';

    // Remove all color classes
    progressBar.classList.remove('progress-optimal', 'progress-good', 'progress-warning', 'progress-critical', 'progress-overload');

    // Add appropriate color class
    if (percentage < 50) {
        progressBar.classList.add('progress-optimal');
    } else if (percentage < 70) {
        progressBar.classList.add('progress-good');
    } else if (percentage < 85) {
        progressBar.classList.add('progress-warning');
    } else if (percentage < 100) {
        progressBar.classList.add('progress-critical');
    } else {
        progressBar.classList.add('progress-overload');
    }
}

// Update status message
function updateStatus(elementId, percentage) {
    const statusEl = document.getElementById(elementId);
    statusEl.classList.remove('status-optimal', 'status-warning', 'status-critical');

    if (percentage < 70) {
        statusEl.textContent = '✓ Optimal - System running smoothly';
        statusEl.classList.add('status-optimal');
    } else if (percentage < 85) {
        statusEl.textContent = '⚠ Warning - Consider monitoring closely';
        statusEl.classList.add('status-warning');
    } else if (percentage < 100) {
        statusEl.textContent = '⚠ Critical - Near capacity limits';
        statusEl.classList.add('status-critical');
    } else {
        statusEl.textContent = '✗ Overload - System will experience issues';
        statusEl.classList.add('status-critical');
    }
}

// Generate recommendations
function generateRecommendations(ramPerc, cpuPerc, storagePerc, users, cores, totalRam, totalStorage) {
    const recommendations = [];

    if (ramPerc > 85) {
        const recommendedRam = Math.ceil(totalRam * 1.5);
        recommendations.push(`RAM usage is critical. Consider upgrading to ${recommendedRam} GB RAM.`);
    } else if (ramPerc > 70) {
        recommendations.push('RAM usage is elevated. Monitor memory consumption and consider optimization.');
    }

    if (cpuPerc > 85) {
        const recommendedCores = Math.ceil(cores * 1.5);
        recommendations.push(`CPU usage is critical. Consider upgrading to ${recommendedCores} CPU cores.`);
    } else if (cpuPerc > 70) {
        recommendations.push('CPU usage is elevated. Consider implementing caching or load balancing.');
    }

    if (storagePerc > 85) {
        const recommendedStorage = Math.ceil(totalStorage * 1.5);
        recommendations.push(`Storage is nearly full. Upgrade to ${recommendedStorage} GB or implement data cleanup policies.`);
    } else if (storagePerc > 70) {
        recommendations.push('Storage usage is elevated. Monitor disk space and implement log rotation.');
    }

    if (users > 1000 && cores < 4) {
        recommendations.push('For high user counts, consider horizontal scaling with multiple VPS instances.');
    }

    if (users > 500 && ramPerc < 50) {
        recommendations.push('Good resource allocation. Consider adding a CDN for static content to further optimize.');
    }

    if (ramPerc < 50 && cpuPerc < 50 && storagePerc < 50) {
        recommendations.push('Excellent resource allocation. Your current configuration is well-suited for the load.');
        recommendations.push('Consider this configuration as a baseline for similar deployments.');
    }

    if (cpuPerc > 100) {
        recommendations.push('URGENT: CPU overload detected. Users will experience severe performance degradation.');
    }

    if (ramPerc > 100) {
        recommendations.push('URGENT: RAM overload detected. System may become unresponsive or crash.');
    }

    return recommendations;
}

// Calculate overall system status
function getOverallStatus(ramPerc, cpuPerc, storagePerc) {
    const maxPerc = Math.max(ramPerc, cpuPerc, storagePerc);

    if (maxPerc > 100) {
        return '🔴 SYSTEM OVERLOAD - Immediate action required';
    } else if (maxPerc > 85) {
        return '🟠 CRITICAL - System at risk';
    } else if (maxPerc > 70) {
        return '🟡 WARNING - Close monitoring recommended';
    } else {
        return '🟢 HEALTHY - System performing well';
    }
}

// Main calculation function
function calculateResources() {
    // Get all input values
    const numUsers = getValue('numUsers', 'customUsers');
    const ramPerUser = getValue('ramPerUser', 'customRam');
    const cpuCores = getValue('cpuCores', 'customCpu');
    const totalRamGB = getValue('totalRam', 'customTotalRam');
    const totalStorageGB = getValue('totalStorage', 'customStorage');
    const storagePerUserMB = getValue('storagePerUser', 'customStoragePerUser');
    const baseStorageGB = getValue('baseStorage', 'customBaseStorage');
    const baseRamMB = getValue('baseRam', 'customBaseRam');
    const cpuIntensity = document.getElementById('cpuIntensity').value;

    // Validate inputs
    if (numUsers <= 0 || cpuCores <= 0 || totalRamGB <= 0 || totalStorageGB <= 0) {
        alert('Please enter valid positive values for all fields.');
        return;
    }

    // Calculate RAM usage
    const totalRamMB = totalRamGB * 1024;
    const userRamMB = numUsers * ramPerUser;
    const totalUsedRamMB = baseRamMB + userRamMB;
    const ramPercentage = (totalUsedRamMB / totalRamMB) * 100;

    // Calculate CPU usage
    const cpuPercentage = calculateCpuUsage(numUsers, cpuCores, cpuIntensity);

    // Calculate Storage usage
    const userStorageGB = (numUsers * storagePerUserMB) / 1024;
    const totalUsedStorageGB = baseStorageGB + userStorageGB;
    const storagePercentage = (totalUsedStorageGB / totalStorageGB) * 100;

    // Update RAM display
    document.getElementById('ramUsed').textContent = totalUsedRamMB.toFixed(0) + ' MB';
    document.getElementById('ramTotal').textContent = totalRamMB.toFixed(0) + ' MB';
    document.getElementById('ramPercentage').textContent = ramPercentage.toFixed(1) + '%';
    updateProgressBar('ramProgress', ramPercentage);
    updateStatus('ramStatus', ramPercentage);

    // Update CPU display
    document.getElementById('cpuLoad').textContent = cpuPercentage.toFixed(1) + '%';
    document.getElementById('cpuCoresDisplay').textContent = cpuCores + ' cores';
    document.getElementById('cpuPercentage').textContent = cpuPercentage.toFixed(1) + '%';
    updateProgressBar('cpuProgress', cpuPercentage);
    updateStatus('cpuStatus', cpuPercentage);

    // Update Storage display
    document.getElementById('storageUsed').textContent = totalUsedStorageGB.toFixed(2) + ' GB';
    document.getElementById('storageTotal').textContent = totalStorageGB.toFixed(0) + ' GB';
    document.getElementById('storagePercentage').textContent = storagePercentage.toFixed(1) + '%';
    updateProgressBar('storageProgress', storagePercentage);
    updateStatus('storageStatus', storagePercentage);

    // Generate and display recommendations
    const recommendations = generateRecommendations(
        ramPercentage,
        cpuPercentage,
        storagePercentage,
        numUsers,
        cpuCores,
        totalRamGB,
        totalStorageGB
    );

    const recommendationsList = document.getElementById('recommendationsList');
    recommendationsList.innerHTML = '';
    recommendations.forEach(rec => {
        const li = document.createElement('li');
        li.textContent = rec;
        recommendationsList.appendChild(li);
    });

    // Update overall status
    const overallStatus = getOverallStatus(ramPercentage, cpuPercentage, storagePercentage);
    document.getElementById('overallStatus').textContent = overallStatus;
}

// Terminal typing effect
function typeText(element, text, speed = 30) {
    let i = 0;
    element.textContent = '';
    const interval = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(interval);
        }
    }, speed);
}

// Add terminal boot sequence
function bootSequence() {
    const header = document.querySelector('header h1');
    const subtitle = document.querySelector('.subtitle');

    setTimeout(() => {
        typeText(header, 'VPS-CALC v1.0.0', 50);
    }, 100);

    setTimeout(() => {
        typeText(subtitle, './vps-simulator --mode=interactive', 30);
    }, 1500);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupCustomInputs();

    // Add calculate button listener
    document.getElementById('calculateBtn').addEventListener('click', calculateResources);

    // Auto-calculate on enter key in custom inputs
    const customInputs = document.querySelectorAll('.custom-input');
    customInputs.forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                calculateResources();
            }
        });
    });

    // Run boot sequence
    bootSequence();

    // Run initial calculation after boot
    setTimeout(() => {
        calculateResources();
    }, 2500);
});
