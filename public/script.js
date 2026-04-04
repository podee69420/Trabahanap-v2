// Wait for the page to load
document.addEventListener('DOMContentLoaded', function() {
    
    // Get the registration form
    var registerForm = document.getElementById('registerForm');
    
    // Listen for form submission
    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Stop form from submitting normally
            
            // Get all the form values
            var fullName = document.getElementById('fullName').value;
            var contactNumber = document.getElementById('contactNumber').value;
            var barangay = document.getElementById('barangay').value;
            var jobCategory = document.getElementById('jobCategory').value;
            var experience = document.getElementById('experience').value;
            var specialty = document.getElementById('specialty').value;
            var additionalInfo = document.getElementById('additionalInfo').value;
            
            // Create an object with all the data
            var workerData = {
                fullName: fullName,
                contactNumber: contactNumber,
                barangay: barangay,
                jobCategory: jobCategory,
                experience: experience,
                specialty: specialty,
                additionalInfo: additionalInfo
            };
            
            // Show the data in console (for testing)
            console.log('Worker Registration Data:', workerData);
            
            // Show success message
            alert('Registration Successful! Salamat ' + fullName + '! Your profile will be reviewed.');
            
            // Reset the form
            registerForm.reset();
            
            // TODO: When you have backend, send data here
            // Example:
            // fetch('/api/register-worker', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(workerData)
            // })
            // .then(response => response.json())
            // .then(data => {
            //     alert('Success! Your profile is now live.');
            // })
            // .catch(error => {
            //     alert('Error: ' + error);
            // });
        });
    }
    
    // Get the filter elements
    var categoryFilter = document.getElementById('categoryFilter');
    var barangayFilter = document.getElementById('barangayFilter');
    
    // Listen for filter changes
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            filterWorkers();
        });
    }
    
    if (barangayFilter) {
        barangayFilter.addEventListener('change', function() {
            filterWorkers();
        });
    }
    
    // Function to filter workers
    function filterWorkers() {
        var selectedCategory = categoryFilter.value.toLowerCase();
        var selectedBarangay = barangayFilter.value.toLowerCase();
        
        console.log('Filtering by:', selectedCategory, selectedBarangay);
        
        // TODO: When you have backend, fetch filtered data here
        // Example:
        // fetch('/api/workers?category=' + selectedCategory + '&barangay=' + selectedBarangay)
        // .then(response => response.json())
        // .then(data => {
        //     displayWorkers(data);
        // });
        
        // For now, just show a message
        if (selectedCategory || selectedBarangay) {
            console.log('Filters applied! Connect to backend to show real results.');
        }
    }
    
    // Get all "View Contact" buttons
    var contactButtons = document.querySelectorAll('.worker-card .btn-primary');
    
    // Add click event to each button
    contactButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            // Get the worker name from the card
            var workerCard = this.closest('.worker-card');
            var workerName = workerCard.querySelector('.worker-name').textContent;
            
            // TODO: When you have backend, fetch real contact info
            // Example contact number (replace with real data from backend)
            var contactNumber = '0912-345-6789';
            
            // Show contact information
            alert('Contact Info for ' + workerName + '\n\nPhone: ' + contactNumber + '\n\nClick OK to call or message them!');
            
            // TODO: When backend is ready, fetch real contact:
            // fetch('/api/worker-contact/' + workerId)
            // .then(response => response.json())
            // .then(data => {
            //     alert('Contact: ' + data.contactNumber);
            // });
        });
    });
    
    // Smooth scroll for navigation links
    var navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(event) {
            var href = this.getAttribute('href');
            
            // Check if it's an anchor link
            if (href.startsWith('#')) {
                event.preventDefault();
                
                var targetId = href.substring(1);
                var targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Close mobile menu if open
                    var navbarCollapse = document.getElementById('navbarNav');
                    if (navbarCollapse.classList.contains('show')) {
                        var bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                            toggle: true
                        });
                    }
                }
            }
        });
    });
    
});

// Function to display workers (for backend integration)
function displayWorkers(workers) {
    var workersList = document.getElementById('workersList');
    
    // Clear current workers
    workersList.innerHTML = '';
    
    // Check if there are workers
    if (workers.length === 0) {
        workersList.innerHTML = '<div class="col-12"><p class="text-center">No workers found. Try different filters.</p></div>';
        return;
    }
    
    // Loop through each worker
    workers.forEach(function(worker) {
        // Create worker card HTML
        var workerCard = `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="worker-card">
                    <div class="worker-category">${worker.category}</div>
                    <h4 class="worker-name">${worker.name}</h4>
                    <p class="worker-location">📍 Barangay ${worker.barangay}</p>
                    <p class="worker-experience"><strong>Experience:</strong> ${worker.experience} years</p>
                    <p class="worker-specialty"><strong>Specialty:</strong> ${worker.specialty}</p>
                    <button class="btn btn-primary w-100" data-worker-id="${worker.id}">View Contact</button>
                </div>
            </div>
        `;
        
        // Add to page
        workersList.innerHTML += workerCard;
    });
    
    // Re-attach click events to new buttons
    attachContactButtons();
}

// Function to attach events to contact buttons
function attachContactButtons() {
    var contactButtons = document.querySelectorAll('.worker-card .btn-primary');
    
    contactButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            var workerId = this.getAttribute('data-worker-id');
            
            // TODO: Fetch real contact from backend
            // fetch('/api/worker-contact/' + workerId)
            // .then(response => response.json())
            // .then(data => {
            //     alert('Contact: ' + data.contactNumber);
            // });
            
            alert('Worker ID: ' + workerId + '\nConnect to backend to show real contact info.');
        });
    });
}

// Add loading animation when page loads
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    setTimeout(function() {
        document.body.style.transition = 'opacity 0.5s';
        document.body.style.opacity = '1';
    }, 100);
});
