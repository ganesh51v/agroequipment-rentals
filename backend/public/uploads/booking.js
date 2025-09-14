// Equipment data - this would typically come from your backend
const equipmentData = {
    "Tractor": {
        name: "Tractor",
        description: "Heavy-duty tractor for all farming needs",
        rate: 500,
        image: "images/tractor.jpg",
        features: ["4WD", "GPS Navigation", "Power Steering"]
    },
    "Combine Harvester": {
        name: "Combine Harvester",
        description: "Efficient harvester for grain crops",
        rate: 800,
        image: "images/combine-harvester.jpg",
        features: ["Self-propelled", "GPS Tracking", "High Capacity"]
    },
    "Cultivator": {
        name: "Cultivator",
        description: "Soil preparation equipment",
        rate: 300,
        image: "images/cultivator.jpg",
        features: ["Adjustable Width", "Heavy Duty", "Easy Operation"]
    }
};

// Function to populate equipment details
function populateEquipmentDetails(equipmentName) {
    if (equipmentData[equipmentName]) {
        const details = equipmentData[equipmentName];
        
        document.getElementById('equipment-name').textContent = details.name;
        document.getElementById('equipment-title').textContent = details.name;
        document.getElementById('equipment-description').textContent = details.description;
        document.getElementById('equipment-rate').textContent = details.rate;
        document.getElementById('equipment-img').src = details.image;
        document.getElementById('equipment-img').alt = details.name;
    }
}

// Function to handle form submission
function handleBookingForm() {
    const form = document.getElementById('booking-form');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const bookingData = {
            equipment: document.getElementById('equipment-type').value,
            name: document.getElementById('booking-name').value,
            phone: document.getElementById('booking-phone').value,
            address: document.getElementById('booking-address').value,
            startDate: document.getElementById('start-date').value,
            endDate: document.getElementById('end-date').value,
            startTime: document.getElementById('start-time').value,
            endTime: document.getElementById('end-time').value,
            notes: document.getElementById('booking-notes')?.value || ''
        };
        
        try {
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(bookingData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                alert('Booking request submitted successfully!');
                form.reset();
                window.location.href = 'services.html';
            } else {
                alert('Error: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error submitting booking request. Please try again.');
        }
    });
}

// Function to set minimum date to today
function setMinDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('start-date').min = today;
    document.getElementById('end-date').min = today;
}

// Function to validate dates
function validateDates() {
    const startDate = document.getElementById('start-date');
    const endDate = document.getElementById('end-date');
    
    endDate.addEventListener('change', function() {
        if (this.value < startDate.value) {
            alert('End date must be after start date');
            this.value = startDate.value;
        }
    });
}

// Initialize booking page
document.addEventListener('DOMContentLoaded', function() {
    setMinDate();
    validateDates();
    handleBookingForm();
    
    // Populate equipment details if URL parameter exists
    const urlParams = new URLSearchParams(window.location.search);
    const equipment = urlParams.get('equipment');
    if (equipment && equipmentData[equipment]) {
        populateEquipmentDetails(equipment);
    }
});

