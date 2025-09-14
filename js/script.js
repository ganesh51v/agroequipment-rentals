// Centralized equipment data
const equipmentData = {
    'Tractor': {
        image: 'images/tractor.jpg',
        description: 'High-power tractor for ploughing, tilling, and planting. Suitable for all types of farming operations with excellent fuel efficiency and powerful engine.',
        rate: 1876,
        features: ['4WD available', 'Power steering', 'Multiple attachments', 'GPS compatible']
    },
    'Combine Harvester': {
        image: 'images/combine harvester.jpg',
        description: 'Efficiently harvest a variety of grain crops including wheat, rice, and corn. Features advanced threshing system and large grain tank capacity.',
        rate: 2345,
        features: ['Self-propelled', 'Large grain tank', 'Adjustable cutting width', 'GPS guidance']
    },
    'Rotary Tiller': {
        image: 'images/rotatry triller.png',
        description: 'Perfect for preparing seedbeds for gardens and farms. Ideal for soil preparation, weed control, and mixing organic matter into soil.',
        rate: 499,
        features: ['Multiple blade options', 'PTO driven', 'Adjustable depth', 'Compact design']
    },
    'Seed Drill': {
        image: 'images/seeddriller.jpg',
        description: 'Automate your seeding process for precision and speed. Ensures uniform seed placement and optimal spacing for maximum yield.',
        rate: 599,
        features: ['Variable seed rate', 'Fertilizer attachment', 'Depth control', 'Metering system']
    },
    'Power Weeder': {
        image: 'images/powerweeder.jpg',
        description: 'Efficient weeding solution for row crops and vegetables. Saves time and labor while maintaining crop health.',
        rate: 399,
        features: ['Lightweight design', 'Easy maneuverability', 'Adjustable tines', 'Fuel efficient']
    },
    'Reaper Machine': {
        image: 'images/reapermachine.jpg',
        description: 'Perfect for harvesting cereals and pulses efficiently. Compact design suitable for small to medium farms.',
        rate: 899,
        features: ['Portable design', 'Easy operation', 'Sharp cutting blades', 'Low maintenance']
    },
    'Power Sprayer': {
        image: 'images/powersprayer.jpg',
        description: 'High-pressure spraying for pesticides and fertilizers. Ensures even coverage and effective pest control.',
        rate: 299,
        features: ['High pressure pump', 'Adjustable nozzle', 'Large tank capacity', 'Easy operation']
    },
    'Cultivator': {
        image: 'images/cultivator.jpg',
        description: 'Soil preparation and weed control between crop rows. Essential tool for maintaining healthy crop growth.',
        rate: 449,
        features: ['Multiple tine options', 'Adjustable width', 'Durable construction', 'Easy attachment']
    }
};

document.addEventListener('DOMContentLoaded', function() {
    // --- Navbar login/profile toggle ---
    const navMenu = document.querySelector('.nav-menu');
    const loginNavItem = navMenu ? navMenu.querySelector('li.nav-item a.nav-link.btn') : null;

    function showProfileInNavbar(user) {
        if (!loginNavItem) return;

        const profileLi = document.createElement('li');
        profileLi.classList.add('nav-item');
        profileLi.style.display = 'flex';
        profileLi.style.alignItems = 'center';

        const profileLink = document.createElement('a');
        profileLink.classList.add('nav-link');
        profileLink.href = 'profile.html'; // Assuming profile.html exists
        profileLink.style.display = 'flex';
        profileLink.style.alignItems = 'center';

        // Create profile image element
        const profileImg = document.createElement('img');
        profileImg.src = user.avatar ? '/uploads/' + user.avatar : 'images/profile-icon.png'; // Use uploaded avatar or default
        profileImg.alt = 'Profile';
        profileImg.style.width = '24px';
        profileImg.style.height = '24px';
        profileImg.style.borderRadius = '50%';
        profileImg.style.marginRight = '8px';

        // Create text node for user name
        const userNameSpan = document.createElement('span');
        userNameSpan.textContent = `Hello, ${user.name}`;

        profileLink.appendChild(profileImg);
        profileLink.appendChild(userNameSpan);

        // Create logout button
        const logoutBtn = document.createElement('button');
        logoutBtn.textContent = 'Logout';
        logoutBtn.classList.add('btn-logout');
        logoutBtn.style.marginLeft = '10px';
        logoutBtn.style.cursor = 'pointer';
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Redirect based on user role and provider selection
            if (user.role === 'provider' && user.isProviderSelected) {
                window.location.href = 'providers.html';
            } else {
                window.location.href = 'index.html';
            }
        });

        profileLi.appendChild(profileLink);
        profileLi.appendChild(logoutBtn);

        // Replace login nav item with profile
        loginNavItem.parentElement.replaceWith(profileLi);
    }

    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        try {
            const user = JSON.parse(storedUser);
            if (user && user.name) {
                showProfileInNavbar(user);
            } else {
                // Invalid user data, clear localStorage
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        } catch (e) {
            // Parsing error, clear localStorage
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        }
    }

    // --- Logic for Login Page (login.html) ---
    const userToggle = document.getElementById('user-toggle');
    const providerToggle = document.getElementById('provider-toggle');
    const loginForm = document.getElementById('login-form');
    const formTitle = document.getElementById('form-title');

    if (userToggle && providerToggle) {
        let currentLoginMode = 'user'; // 'user' or 'provider'

        userToggle.addEventListener('click', () => {
            if (currentLoginMode !== 'user') {
                userToggle.classList.add('active');
                providerToggle.classList.remove('active');
                formTitle.textContent = 'User Login';
                currentLoginMode = 'user';
            }
        });

        providerToggle.addEventListener('click', () => {
            if (currentLoginMode !== 'provider') {
                providerToggle.classList.add('active');
                userToggle.classList.remove('active');
                formTitle.textContent = 'Provider Login';
                currentLoginMode = 'provider';
            }
        });

        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            if (email === '' || password === '') {
                alert('Please fill in both email and password.');
                return;
            }

            try {
                const response = await fetch('http://localhost:5001/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    // Store JWT token in localStorage
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    alert(`Welcome ${data.user.name}! Login successful.`);
                    loginForm.reset();

                    // Redirect based on user role and provider selection
                    if (data.user.role === 'provider' && data.user.isProviderSelected) {
                        window.location.href = 'providers.html';
                    } else {
                        window.location.href = 'index.html';
                    }
                } else {
                    alert(data.message || 'Login failed');
                }
            } catch (error) {
                console.error('Login error:', error);
                alert('Login failed. Please try again.');
            }
        });
    }

    // --- Logic for Contact Page (contact.html) ---
    const contactForm = document.getElementById('contact-form');
    if(contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            if(name === '') {
                alert('Please fill out all fields.');
                return;
            }
            alert(`Thank you for your message, ${name}! We will get back to you soon.`);
            contactForm.reset();
        });
    }

    // --- Logic for Booking Page (booking.html) ---
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        let equipmentList = [];
        let equipmentMap = {};

        // Function to fetch equipment list from backend
        async function fetchEquipmentList() {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:5001/api/equipment?limit=1000', {
                    headers: {
                        'Authorization': token ? `Bearer ${token}` : ''
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    equipmentList = data.equipment;
                    // Create a map of equipment names to IDs
                    equipmentMap = {};
                    equipmentList.forEach(eq => {
                        equipmentMap[eq.name] = eq._id;
                    });
                }
            } catch (error) {
                console.error('Error fetching equipment list:', error);
            }
        }

        // Function to calculate total price
        function calculateTotalPrice(equipmentId, startDate, endDate) {
            const equipment = equipmentList.find(eq => eq._id === equipmentId);
            if (!equipment) return 0;

            const start = new Date(startDate);
            const end = new Date(endDate);
            const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1; // Include both start and end dates

            return equipment.price * days;
        }

        // 1. Get equipment name from URL and update the page
        const urlParams = new URLSearchParams(window.location.search);
        const equipmentName = urlParams.get('equipment');

        const equipmentNameSpan = document.getElementById('equipment-name');
        const equipmentTypeInput = document.getElementById('equipment-type');
        const equipmentImg = document.getElementById('equipment-img');
        const equipmentDescription = document.getElementById('equipment-description');

        function updateEquipmentDetails(name) {
            const equipment = equipmentList.find(eq => eq.name === name);
            if (equipment) {
                equipmentImg.src = equipment.images && equipment.images.length > 0 ? equipment.images[0] : 'images/no-image.jpg';
                equipmentImg.alt = equipment.name;
                equipmentDescription.textContent = equipment.description || 'No description available.';
                equipmentNameSpan.textContent = equipment.name;
                equipmentTypeInput.value = equipment.name;
            } else {
                equipmentImg.src = 'images/no-image.jpg';
                equipmentImg.alt = 'No equipment selected';
                equipmentDescription.textContent = 'No description available.';
                equipmentNameSpan.textContent = 'the selected equipment';
                equipmentTypeInput.value = '';
            }
        }

        if (equipmentName) {
            updateEquipmentDetails(equipmentName);
        } else {
            equipmentNameSpan.textContent = 'the selected equipment';
        }

        // Fetch equipment list on page load
        fetchEquipmentList().then(() => {
            if (equipmentName) {
                updateEquipmentDetails(equipmentName);
            }
        });

        // 2. Handle the form submission
        bookingForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Check if user is logged in
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Please login first to make a booking.');
                window.location.href = 'login.html';
                return;
            }

            const name = document.getElementById('booking-name').value;
            const phone = document.getElementById('booking-phone').value;
            const address = document.getElementById('booking-address').value;
            const startDate = document.getElementById('start-date').value;
            const endDate = document.getElementById('end-date').value;
            const equipmentName = equipmentTypeInput.value;

            if (!name || !phone || !address || !startDate || !endDate) {
                alert('Please fill in all booking details.');
                return;
            }

            if (new Date(endDate) < new Date(startDate)) {
                alert('The booking end date cannot be before the start date.');
                return;
            }

            // Get equipment ID from name
            const equipmentId = equipmentMap[equipmentName];
            if (!equipmentId) {
                alert('Equipment not found. Please try again.');
                return;
            }

            // Calculate total price
            const totalPrice = calculateTotalPrice(equipmentId, startDate, endDate);

            const bookingData = {
                equipment: equipmentId,
                startDate: startDate,
                endDate: endDate,
                totalPrice: totalPrice,
                address: address,
                phone: phone,
                notes: document.getElementById('booking-notes').value
            };

            try {
                const response = await fetch('http://localhost:5001/api/bookings', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(bookingData)
                });

                const data = await response.json();

                if (response.ok) {
                    alert(`Thank you, ${name}! Your booking request has been received. We will contact you at ${phone} to confirm.`);
                    bookingForm.reset();
                    window.location.href = 'services.html';
                } else {
                    alert(data.message || 'Booking failed. Please try again.');
                }
            } catch (error) {
                console.error('Booking error:', error);
                alert('Booking failed. Please try again.');
            }
        });
    }

});
