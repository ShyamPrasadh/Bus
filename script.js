// Organized Bus Schedules
// Times are in 24-hour HH:MM format for easy comparison
const thammampattiToSalem = [
    { time: "03:20", label: "Government bus" },
    { time: "04:27", label: "Balagi" },
    { time: "05:10", label: "Balagi" },
    { time: "05:30", label: "Government bus Banglore" },
    { time: "05:40", label: "Government bus" },
    { time: "05:50", label: "Parameswara" },
    { time: "06:30", label: "Srinivasa" },
    { time: "06:43", label: "Palaniyappa" },
    { time: "07:25", label: "Government bus" },
    { time: "08:10", label: "Government bus" },
    { time: "08:25", label: "Government bus" },
    { time: "08:40", label: "Amman" },
    { time: "09:15", label: "Government bus" },
    { time: "09:37", label: "Balagi" },
    { time: "10:00", label: "Government bus" },
    { time: "10:30", label: "Government bus" },
    { time: "11:00", label: "Government bus" },
    { time: "11:42", label: "Balagi" },
    { time: "12:12", label: "Srinivasa" },
    { time: "12:35", label: "Government bus" },
    { time: "13:05", label: "Government bus" },
    { time: "13:15", label: "Amman" },
    { time: "13:50", label: "Government bus" },
    { time: "14:08", label: "Government bus" },
    { time: "14:27", label: "Balagi" },
    { time: "14:50", label: "Government bus" },
    { time: "15:20", label: "Government bus" },
    { time: "15:37", label: "Parameswara" },
    { time: "15:50", label: "Government bus" },
    { time: "16:05", label: "Government bus" },
    { time: "16:40", label: "Balagi" },
    { time: "17:25", label: "Government bus" },
    { time: "17:45", label: "Srinivasa" },
    { time: "18:20", label: "Amman" },
    { time: "18:35", label: "Government bus" },
    { time: "18:50", label: "Neela" },
    { time: "19:50", label: "Government bus" },
    { time: "20:50", label: "Government bus" }
];

const salemToThammampatti = [
    { time: "05:15", label: "Government bus" },
    { time: "07:00", label: "vengateswara" },
    { time: "07:28", label: "Balagi" },
    { time: "08:01", label: "Balagi" },
    { time: "08:36", label: "Srinivasa" },
    { time: "08:50", label: "Government bus" },
    { time: "09:20", label: "Government bus" },
    { time: "09:50", label: "Parameswara" },
    { time: "10:00", label: "Government bus" },
    { time: "10:21", label: "Government bus" },
    { time: "11:05", label: "Amman" },
    { time: "11:15", label: "Government bus" },
    { time: "11:46", label: "Balagi" },
    { time: "12:40", label: "Government bus" },
    { time: "13:10", label: "Neela" },
    { time: "13:55", label: "Balagi" },
    { time: "14:25", label: "Srinivasa" },
    { time: "15:15", label: "Government bus" },
    { time: "15:45", label: "Amman" },
    { time: "16:20", label: "Government bus" },
    { time: "17:05", label: "Government bus" },
    { time: "17:35", label: "Government bus" },
    { time: "18:00", label: "Parameswara" },
    { time: "18:44", label: "Balagi" },
    { time: "19:20", label: "Balagi" },
    { time: "20:09", label: "Palaniyappa" },
    { time: "20:50", label: "Srinivasa" },
    { time: "21:25", label: "Amman" },
    { time: "22:10", label: "Government bus" }
];

// Formatting time from HH:MM (24h) to string AM/PM for display
function formatTime12h(time24) {
    const [hours24, minutes] = time24.split(':');
    let hoursStr = parseInt(hours24, 10);
    const suffix = hoursStr >= 12 ? 'PM' : 'AM';
    hoursStr = hoursStr % 12;
    hoursStr = hoursStr ? hoursStr : 12; // the hour '0' should be '12'
    return `${hoursStr}:${minutes} ${suffix}`;
}

// Convert "HH:MM" to Date object for today
function timeToDate(timeStr) {
    const now = new Date();
    const [hours, minutes] = timeStr.split(':');
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(hours), parseInt(minutes), 0);
}

// Format the countdown structure
function getCountdownString(targetDate, prefix="") {
    const now = new Date();
    const diffMs = targetDate - now;
    
    if (diffMs <= 0) return "Departing now...";

    const mInO = Math.floor(diffMs / 60000 % 60);
    const hInO = Math.floor(diffMs / 3600000);
    
    if (hInO > 0) {
        return `${prefix} in ${hInO}h ${mInO}m`;
    }
    return `${prefix} in ${mInO}m`;
}

// Identify the next bus and update the schedule lists
function processSchedules() {
    const now = new Date();
    
    // --- Salem to Thammampatti ---
    let nextStot = null;
    let nextStotDate = null;
    let stotListHTML = '';
    
    for (let i = 0; i < salemToThammampatti.length; i++) {
        const bus = salemToThammampatti[i];
        const busDate = timeToDate(bus.time);
        const timeFormatted = formatTime12h(bus.time);
        
        // Find the first bus today that is still in the future
        if (!nextStot && busDate > now) {
            nextStot = bus;
            nextStotDate = busDate;
            stotListHTML += `
                <li class="schedule-item next-bus">
                    <span class="item-time">${timeFormatted}</span>
                    <span class="item-name">${bus.label} (Next)</span>
                </li>
            `;
        } else if (busDate <= now) {
            // Past buses
            stotListHTML += `
                <li class="schedule-item past-bus">
                    <span class="item-time">${timeFormatted}</span>
                    <span class="item-name">${bus.label}</span>
                </li>
            `;
        } else {
            // Future buses
            stotListHTML += `
                <li class="schedule-item">
                    <span class="item-time">${timeFormatted}</span>
                    <span class="item-name">${bus.label}</span>
                </li>
            `;
        }
    }
    
    // If no buses left today, the next bus is the first one tomorrow
    if (!nextStot && salemToThammampatti.length > 0) {
        nextStot = salemToThammampatti[0];
        nextStotDate = timeToDate(nextStot.time);
        nextStotDate.setDate(nextStotDate.getDate() + 1); // Add 1 day for tomorrow
        
        // Also fix the first item in HTML to be "Next (Tomorrow)"
        stotListHTML = stotListHTML.replace('<li class="schedule-item past-bus">', '<li class="schedule-item next-bus">');
        stotListHTML = stotListHTML.replace('</span>', '</span> (Tomorrow)</span>'); 
    }

    // --- Thammampatti to Salem ---
    let nextTtos = null;
    let nextTtosDate = null;
    let ttosListHTML = '';
    
    for (let i = 0; i < thammampattiToSalem.length; i++) {
        const bus = thammampattiToSalem[i];
        const busDate = timeToDate(bus.time);
        const timeFormatted = formatTime12h(bus.time);
        
        if (!nextTtos && busDate > now) {
            nextTtos = bus;
            nextTtosDate = busDate;
            ttosListHTML += `
                <li class="schedule-item next-bus">
                    <span class="item-time">${timeFormatted}</span>
                    <span class="item-name">${bus.label} (Next)</span>
                </li>
            `;
        } else if (busDate <= now) {
            ttosListHTML += `
                <li class="schedule-item past-bus">
                    <span class="item-time">${timeFormatted}</span>
                    <span class="item-name">${bus.label}</span>
                </li>
            `;
        } else {
            ttosListHTML += `
                <li class="schedule-item">
                    <span class="item-time">${timeFormatted}</span>
                    <span class="item-name">${bus.label}</span>
                </li>
            `;
        }
    }
    
    if (!nextTtos && thammampattiToSalem.length > 0) {
        nextTtos = thammampattiToSalem[0];
        nextTtosDate = timeToDate(nextTtos.time);
        nextTtosDate.setDate(nextTtosDate.getDate() + 1);
        
        ttosListHTML = ttosListHTML.replace('<li class="schedule-item past-bus">', '<li class="schedule-item next-bus">');
        ttosListHTML = ttosListHTML.replace('</span>', '</span> (Tomorrow)</span>');
    }

    // --- Update the UI ---
    
    // Salem to Thottam UI update
    document.getElementById('list-s-to-t').innerHTML = stotListHTML;
    if (nextStot) {
        document.getElementById('next-s-to-t-time').textContent = formatTime12h(nextStot.time);
        document.getElementById('next-s-to-t-name').textContent = nextStot.label;
        const countdownEl = document.getElementById('countdown-s-to-t');
        countdownEl.textContent = getCountdownString(nextStotDate, "Departs");
        countdownEl.classList.add('active'); // Start pulsing
    }
    
    // Thottam to Salem UI update
    document.getElementById('list-t-to-s').innerHTML = ttosListHTML;
    if (nextTtos) {
        document.getElementById('next-t-to-s-time').textContent = formatTime12h(nextTtos.time);
        document.getElementById('next-t-to-s-name').textContent = nextTtos.label;
        const countdownEl = document.getElementById('countdown-t-to-s');
        countdownEl.textContent = getCountdownString(nextTtosDate, "Departs");
        countdownEl.classList.add('active'); // Start pulsing
    }

    // Scroll active items into view slightly if they are hidden
    // but only when manually running, doing it automatically skips page nicely
}

// Run immediately and then every minute to keep countdown and 'next' bus fresh
processSchedules();
setInterval(processSchedules, 60000);
