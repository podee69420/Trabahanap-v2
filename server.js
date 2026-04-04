// Import required packages
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allow requests from frontend
app.use(express.json()); // Parse JSON data
app.use(express.static(path.join(__dirname, 'public')));

// Database file path
const DB_FILE = path.join(__dirname, 'workers-database.json');

// Initialize database
function initializeDatabase() {
    // Check if database file exists
    if (!fs.existsSync(DB_FILE)) {
        console.log('Creating new database file...');
        
        // Create initial data with sample workers
        const initialData = {
            workers: [
                {
                    id: 1,
                    full_name: "Juan Dela Cruz",
                    contact_number: "0912-345-6789",
                    barangay: "poblacion",
                    job_category: "construction",
                    years_experience: 10,
                    specialty: "Carpentry, Masonry, Painting",
                    additional_info: "Available weekdays and weekends",
                    status: "approved",
                    created_at: new Date().toISOString()
                },
                {
                    id: 2,
                    full_name: "Maria Santos",
                    contact_number: "0923-456-7890",
                    barangay: "sabang",
                    job_category: "farmer",
                    years_experience: 15,
                    specialty: "Rice farming, vegetable gardening",
                    additional_info: "Expert in organic farming",
                    status: "approved",
                    created_at: new Date().toISOString()
                },
                {
                    id: 3,
                    full_name: "Pedro Reyes",
                    contact_number: "0934-567-8901",
                    barangay: "tangos",
                    job_category: "repair",
                    years_experience: 8,
                    specialty: "Aircon, appliances, plumbing",
                    additional_info: "Fast and reliable service",
                    status: "approved",
                    created_at: new Date().toISOString()
                },
                {
                    id: 4,
                    full_name: "Jose Garcia",
                    contact_number: "0945-678-9012",
                    barangay: "conception",
                    job_category: "bakal",
                    years_experience: 5,
                    specialty: "Bakal, bote, scrap collection",
                    additional_info: "Best prices in town",
                    status: "approved",
                    created_at: new Date().toISOString()
                },
                {
                    id: 5,
                    full_name: "Roberto Cruz",
                    contact_number: "0956-789-0123",
                    barangay: "bagong-nayon",
                    job_category: "construction",
                    years_experience: 12,
                    specialty: "Welding, metal works, roofing",
                    additional_info: "Licensed welder",
                    status: "approved",
                    created_at: new Date().toISOString()
                },
                {
                    id: 6,
                    full_name: "Ana Lopez",
                    contact_number: "0967-890-1234",
                    barangay: "barangca",
                    job_category: "farmer",
                    years_experience: 8,
                    specialty: "Livestock farming, poultry",
                    additional_info: "Can help with farm setup",
                    status: "approved",
                    created_at: new Date().toISOString()
                },
                {
                    id: 7,
                    full_name: "Miguel Torres",
                    contact_number: "0978-901-2345",
                    barangay: "calantipay",
                    job_category: "repair",
                    years_experience: 6,
                    specialty: "Electrical works, wiring, installation",
                    additional_info: "Licensed electrician",
                    status: "approved",
                    created_at: new Date().toISOString()
                },
                {
                    id: 8,
                    full_name: "Carmen Flores",
                    contact_number: "0989-012-3456",
                    barangay: "makinabang",
                    job_category: "other",
                    years_experience: 4,
                    specialty: "House cleaning, laundry service",
                    additional_info: "Trusted and thorough",
                    status: "approved",
                    created_at: new Date().toISOString()
                }
            ],
            nextId: 9
        };
        
        // Write to file
        fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
        console.log('Database created with sample workers!');
    } else {
        console.log('Database file found!');
    }
}

// Read database
function readDatabase() {
    try {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading database:', error);
        return { workers: [], nextId: 1 };
    }
}

// Write database
function writeDatabase(data) {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing database:', error);
        return false;
    }
}

// Initialize database on startup
initializeDatabase();

// =====================
// API ENDPOINTS
// =====================

// 1. GET all workers (with optional filters)
app.get('/api/workers', (req, res) => {
    try {
        const { category, barangay } = req.query;
        const db = readDatabase();
        
        let workers = db.workers.filter(w => w.status === 'approved');

        // Add category filter if provided
        if (category && category !== '') {
            workers = workers.filter(w => w.job_category === category);
        }

        // Add barangay filter if provided
        if (barangay && barangay !== '') {
            workers = workers.filter(w => w.barangay === barangay);
        }

        // Sort by newest first
        workers.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        res.json({
            success: true,
            count: workers.length,
            workers: workers
        });
    } catch (error) {
        console.error('Error fetching workers:', error);
        res.status(500).json({
            success: false,
            message: 'Error loading workers'
        });
    }
});

// 2. GET single worker contact info
app.get('/api/worker-contact/:id', (req, res) => {
    try {
        const { id } = req.params;
        const db = readDatabase();
        
        const worker = db.workers.find(w => w.id === parseInt(id) && w.status === 'approved');
        
        if (!worker) {
            return res.status(404).json({
                success: false,
                message: 'Worker not found'
            });
        }

        res.json({
            success: true,
            worker: {
                id: worker.id,
                name: worker.full_name,
                contactNumber: worker.contact_number,
                barangay: worker.barangay,
                category: worker.job_category,
                experience: worker.years_experience,
                specialty: worker.specialty
            }
        });
    } catch (error) {
        console.error('Error fetching worker contact:', error);
        res.status(500).json({
            success: false,
            message: 'Error loading contact info'
        });
    }
});

// 3. POST register new worker
app.post('/api/register-worker', (req, res) => {
    try {
        const { fullName, contactNumber, barangay, jobCategory, experience, specialty, additionalInfo } = req.body;

        // Validate required fields
        if (!fullName || !contactNumber || !barangay || !jobCategory || !experience || !specialty) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in all required fields'
            });
        }

        // Read current database
        const db = readDatabase();

        // Create new worker
        const newWorker = {
            id: db.nextId,
            full_name: fullName,
            contact_number: contactNumber,
            barangay: barangay,
            job_category: jobCategory,
            years_experience: parseInt(experience),
            specialty: specialty,
            additional_info: additionalInfo || '',
            status: 'approved',
            created_at: new Date().toISOString()
        };

        // Add to workers array
        db.workers.push(newWorker);
        db.nextId++;

        // Save to database
        if (writeDatabase(db)) {
            res.json({
                success: true,
                message: 'Registration successful!',
                workerId: newWorker.id
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to save registration'
            });
        }
    } catch (error) {
        console.error('Error registering worker:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed. Please try again.'
        });
    }
});

// 4. GET statistics (for admin dashboard later)
app.get('/api/stats', (req, res) => {
    try {
        const db = readDatabase();
        const workers = db.workers.filter(w => w.status === 'approved');

        // Count by category
        const byCategory = {};
        workers.forEach(w => {
            byCategory[w.job_category] = (byCategory[w.job_category] || 0) + 1;
        });

        // Count by barangay
        const byBarangay = {};
        workers.forEach(w => {
            byBarangay[w.barangay] = (byBarangay[w.barangay] || 0) + 1;
        });

        res.json({
            success: true,
            stats: {
                totalWorkers: workers.length,
                byCategory: Object.entries(byCategory).map(([job_category, count]) => ({ job_category, count })),
                byBarangay: Object.entries(byBarangay).map(([barangay, count]) => ({ barangay, count }))
            }
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error loading statistics'
        });
    }
});

// Serve the frontend HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check endpoint for Render
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Trabahanap server is running!' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log('=================================');
    console.log('🚀 Trabahanap Server is running!');
    console.log(`📡 Port: ${PORT}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log('=================================');
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully...');
    process.exit(0);
});
