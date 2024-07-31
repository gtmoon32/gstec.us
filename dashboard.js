async function fetchDeadlines(username) {
    try {
        const response = await fetch(`/fetchdeadlines?username=${username}`);
        const responseText = await response.text();
        console.log('Response text:', responseText); // Log the raw response text
        
        try {
            const jsonResponse = JSON.parse(responseText);
            console.log('Parsed JSON response:', jsonResponse); // Log the parsed JSON response
            
            if (jsonResponse.results && Array.isArray(jsonResponse.results)) {
                console.log('Results array:', jsonResponse.results); // Log the results array
                updateDeadlines(jsonResponse.results);
            } else {
                console.error('No deadlines found for the user.');
                updateDeadlines([]); // Clear existing content if no deadlines are found
            }
        } catch (jsonError) {
            console.error('Error parsing JSON:', jsonError);
            console.error('Response text:', responseText);
        }
    } catch (error) {
        console.error('Error fetching deadlines:', error);
    }
}

function updateDeadlines(deadlines) {
    console.log('Updating deadlines with:', deadlines); // Log the deadlines being updated
    const deadlineContainer = document.querySelector('.yourdeadlines');
    deadlineContainer.innerHTML = ''; 

    const heading = document.createElement('h3');
    heading.textContent = 'YOUR DEADLINES';
    deadlineContainer.appendChild(heading);

    if (deadlines.length === 0) {
        const noDeadlinesMessage = document.createElement('div');
        noDeadlinesMessage.textContent = 'NO DEADLINES FOUND.'; // Change message to uppercase
        deadlineContainer.appendChild(noDeadlinesMessage);
        return;
    }

    // Helper function to parse month-day strings into Date objects
    function parseDate(dateStr) {
        const [month, day] = dateStr.split(' ');
        const monthIndex = new Date(Date.parse(month + " 1, 2023")).getMonth(); // Get month index
        return new Date(new Date().getFullYear(), monthIndex, parseInt(day));
    }

    // Sort deadlines by date
    deadlines.sort((a, b) => {
        const dateA = parseDate(a.user_deadline_date);
        const dateB = parseDate(b.user_deadline_date);
        return dateA - dateB;
    });

    deadlines.forEach(deadline => {
        const deadlineBlock = document.createElement('div');
        deadlineBlock.classList.add('deadlineblock');

        const deadlineDate = document.createElement('div');
        deadlineDate.classList.add('deadlinedate');
        deadlineDate.textContent = deadline.user_deadline_date.toUpperCase(); // Convert date to uppercase

        const deadlineInfo = document.createElement('div');
        deadlineInfo.classList.add('deadline');
        deadlineInfo.textContent = deadline.user_deadline_info.toUpperCase(); // Convert info to uppercase

        deadlineBlock.appendChild(deadlineDate);
        deadlineBlock.appendChild(deadlineInfo);
        deadlineContainer.appendChild(deadlineBlock);
    });
}



// Call the function after the content is loaded
document.addEventListener('DOMContentLoaded', adjustPaddingBottom);

// Call the function after the content is loaded
document.addEventListener('DOMContentLoaded', adjustPaddingBottom);

document.addEventListener('DOMContentLoaded', function () {
    const username = sessionStorage.getItem('username');
    if (username) {
        fetchDeadlines(username);
    } else {
        console.error('Username not found in sessionStorage');
    }
});

function startCountdown() {
    const countdownElement = document.getElementById('countdown-timer');
    if (!countdownElement) {
        console.error('Countdown element not found');
        return;
    }
    const targetDate = new Date('June 5, 2025 11:00:00').getTime();
    // console.log('Target date:', targetDate);

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;
        // console.log('Time remaining:', distance);

        if (distance < 0) {
            countdownElement.innerHTML = "EXPIRED";
            clearInterval(interval);
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        countdownElement.innerHTML = `${days}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    const interval = setInterval(updateCountdown, 1000);
    updateCountdown(); // Initial call to display the timer immediately
}

document.addEventListener('DOMContentLoaded', function () {
    const logoutButton = document.querySelector('.button');
    logoutButton.addEventListener('click', function () {
        sessionStorage.clear();
        window.location.href = 'index.html';
    });

    const navLinks = document.querySelectorAll('.maincontent nav a');
    const indicator = document.querySelector('.maincontent nav .indicator');
    const contentCards = document.querySelectorAll('.content-card');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const activeLink = document.querySelector('.maincontent nav a.active');
            if (activeLink) {
                activeLink.classList.remove('active');
            }
            this.classList.add('active');
            moveIndicator(this);
            showContent(this.getAttribute('data-content'));
        });
    });

    startCountdown();

    function moveIndicator(element) {
        const rect = element.getBoundingClientRect();
        const navRect = element.parentElement.getBoundingClientRect();
        indicator.style.width = `${rect.width}px`;
        indicator.style.left = `${rect.left - navRect.left}px`;
    }

    function showContent(contentId) {
        contentCards.forEach(card => {
            card.classList.remove('active');
        });
    
        setTimeout(() => {
            contentCards.forEach(card => {
                if (card.id === contentId) {
                    card.classList.add('active');
                }
            });
        }, 500); 
    }
    

    const activeLink = document.querySelector('.maincontent nav a.active') || navLinks[0];
    if (activeLink) {
        activeLink.classList.add('active');
        moveIndicator(activeLink);
        showContent(activeLink.getAttribute('data-content'));
    }
});

function adjustPaddingBottom() {
    console.log('adjustPaddingBottom function called'); // Log function call
    const deadlineBlocks = document.querySelectorAll('.deadlineblock');
    console.log('Found deadline blocks:', deadlineBlocks); // Log found elements

    deadlineBlocks.forEach(block => {
        const deadlinedates = block.querySelectorAll('.deadlinedate');
        const deadlines = block.querySelectorAll('.deadline');

        console.log('Found deadlinedates:', deadlinedates);
        console.log('Found deadlines:', deadlines); 
        
        let maxHeight = 0;
        
        deadlinedates.forEach(date => {
            const rect = date.getBoundingClientRect();
            maxHeight = Math.max(maxHeight, rect.height);
        });
        deadlines.forEach(deadline => {
            const rect = deadline.getBoundingClientRect();
            maxHeight = Math.max(maxHeight, rect.height);
        });
        
        console.log('Max height:', maxHeight); 
        
        deadlinedates.forEach(date => {
            const rect = date.getBoundingClientRect();
            const heightDifference = maxHeight - rect.height;
            date.style.paddingBottom = `${heightDifference + 5}px`; // Corrected variable name
        });
        deadlines.forEach(deadline => {
            const rect = deadline.getBoundingClientRect();
            const heightDifference = maxHeight - rect.height;
            deadline.style.paddingBottom = `${heightDifference + 5}px`;
            console.log('Adjusted padding for deadline:', deadline, 'Padding:', deadline.style.paddingBottom); // Corrected log statement
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    adjustPaddingBottom(); // Initial call after the content is loaded

    // Set up a MutationObserver to watch for changes in the DOM
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.addedNodes.length) {
                adjustPaddingBottom(); // Call the function when new nodes are added
            }
        });
    });

    // Start observing the document body for changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});