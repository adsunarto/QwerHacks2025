// Elements
const loginBtn = document.getElementById('loginBtn');
const loginSection = document.getElementById('loginSection');
const mainContent = document.getElementById('mainContent');
const authenticatedSection = document.getElementById('authenticatedSection');
const itinerarySection = document.getElementById("itinerarySection");
const profileSection = document.getElementById("profileSection");
const logoutBtn = document.getElementById('logoutBtn');
const userName = document.getElementById('userName');
const fromField = document.getElementById('from');
const toField = document.getElementById('to');
const getLocationBtn = document.getElementById('getLocationBtn');
const searchBtn = document.getElementById('searchBtn');
const routeResults = document.getElementById('routeResults');
const sidebar = document.getElementById('sidebar');
const sidebarContent = document.getElementById('sidebarContent');
const closeSidebarBtn = document.createElement('button');
closeSidebarBtn.textContent = 'Close Sidebar';
closeSidebarBtn.id = 'closeSidebarBtn';
// Tab bar buttons
const navTab = document.getElementById("navTab");
const itineraryTab = document.getElementById("itineraryTab");
const profileTab = document.getElementById("profileTab");

// Check if the user is already logged in from localStorage
const storedUser = localStorage.getItem('user');
if (storedUser) {
    // If the user is already logged in (localStorage has user data), display authenticated section
    const user = JSON.parse(storedUser);
    loginSection.style.display = 'none';
    mainContent.style.display = 'block';
    authenticatedSection.style.display = 'block';
    userName.textContent = user.name;
}

// Login Button Event
loginBtn.addEventListener('click', async () => {


    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (data.success) {
        // Hide the login section and show main section
        loginSection.style.display = 'none';
        mainContent.style.display = 'block';
        authenticatedSection.style.display = "block";

        // Set user name
        userName.textContent = data.user.name;

        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
    } else {
        alert(`Authentication failed: ${data.message}`);
    }
});

// Logout Button Event
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('user'); // Clear the localStorage
    loginSection.style.display = 'block'; // Show the login section again
    authenticatedSection.style.display = "none";
    itinerarySection.style.display = "none";
    profileSection.style.display = "none";
    mainContent.style.display = 'none'; // Hide the authenticated section
});

navTab.addEventListener("click", function () {
    authenticatedSection.style.display = "block";
    itinerarySection.style.display = "none";
    profileSection.style.display = "none";
});

itineraryTab.addEventListener("click", function () {
    authenticatedSection.style.display = "none";
    itinerarySection.style.display = "block";
    profileSection.style.display = "none";
});

profileTab.addEventListener("click", function () {
    authenticatedSection.style.display = "none";
    itinerarySection.style.display = "none";
    profileSection.style.display = "block";
});

// Search Button Event
searchBtn.addEventListener('click', async () => {
    const to = toField.value;

    if (!to) {
        alert('Please enter a destination!');
        return;
    }

    // Send search request to the server to fetch matching routes
    const response = await fetch(`http://localhost:3000/search?to=${to}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();
    console.log(data);

    if (data.success) {
        // Display routes
        if (data.routes.length > 0) {
            let results = ''; // Initialize an empty string to accumulate the HTML
    
            for (let index = 0; index < data.routes.length; index++) {
                const route = data.routes[index];
    
                // Generate the preferences section
                let preferencesHTML = '';
                if (route.preferences && route.preferences.length > 0) {
                    for (let i = 0; i < route.preferences.length; i++) {
                        const pref = route.preferences[i];
                        // Check if preference is true or false and assign the appropriate class
                        preferencesHTML += `<span class="tag ${pref ? 'yes' : 'no'}">${pref}</span>`;
                    }
                }
    
                // Generate the route card HTML
                results += `
                    <div class="route-card">
                        <div class="route-header">
                            <i class="fas fa-car route-icon"></i>
                            <h3>Route #${index + 1}</h3>
                        </div>
                        <div class="route-info">
                            <p><strong>From:</strong> ${route.from}</p>
                            <p><strong>To:</strong> ${route.to}</p>
                        </div>
                        <div class="preferences">
                            <p><strong>Preferences:</strong></p>
                            <div class="preference-tags">
                                ${preferencesHTML || '<span>No preferences set</span>'}
                            </div>
                        </div>
                    </div>
                `;
            }
    
            routeResults.innerHTML = results; // Insert the generated HTML into the page
        } else {
            routeResults.innerHTML = 'No routes found for the given destination.';
        }
    } else {
        alert('Failed to search routes.');
    }
    
});

// Sidebar close functionality
closeSidebarBtn.addEventListener('click', () => {
    sidebar.classList.remove('open');
    sidebarContent.innerHTML = '';  // Clear sidebar content when closed
});

sidebar.appendChild(closeSidebarBtn);

// Function to render route cards dynamically
function displayRoutes(routes) {
    routeResults.innerHTML = ''; // Clear previous results
    routes.forEach(route => {
        const routeCard = document.createElement('div');
        routeCard.classList.add('route');
        routeCard.innerHTML = `
            <p><Driver: ${route.username}/p>
            <p>From: ${route.from}</p>
            <p>To: ${route.to}</p>
        `;

        // Add click event to open the sidebar with additional details
        routeCard.addEventListener('click', () => {
            sidebar.classList.add('open');
            sidebarContent.innerHTML = `
                <h3>Route Details:</h3>
                <p><strong>From:</strong> ${route.from}</p>
                <p><strong>To:</strong> ${route.to}</p>
                <button id="bookRideBtn">Book Ride</button>
            `;
            document.getElementById('bookRideBtn').addEventListener('click', () => {
                alert('Ride booked successfully!');
            });
        });

        routeResults.appendChild(routeCard);
    });
}