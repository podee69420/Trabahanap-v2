// Import required packages
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Database file path
const DB_FILE = path.join(__dirname, 'workers-database.json');

// Initialize database with sample data
function initializeDatabase() {
    if (!fs.existsSync(DB_FILE)) {
        console.log('📝 Creating new database file...');
        
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
                    additional_info: "Available weekdays and weekends. Can work on small to large projects.",
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
                    specialty: "Rice farming, vegetable gardening, organic methods",
                    additional_info: "Expert in organic farming. Can provide consultation for farm setup.",
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
                    specialty: "Aircon repair, appliance repair, basic plumbing",
                    additional_info: "Fast and reliable service. Same-day repair available for emergency cases.",
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
                    specialty: "Bakal, bote, dyaryo, scrap metal collection",
                    additional_info: "Best prices in town. Free pickup for large quantities.",
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
                    specialty: "Welding, metal works, roofing, steel fabrication",
                    additional_info: "Licensed welder. Can provide welding certification if needed.",
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
                    specialty: "Livestock farming, poultry, pig raising",
                    additional_info: "Can help with farm setup and livestock management. Affordable consultation rates.",
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
                    specialty: "Electrical works, house wiring, installation",
                    additional_info: "Licensed electrician. All work guaranteed and insured.",
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
                    specialty: "House cleaning, laundry service, general housekeeping",
                    additional_info: "Trusted and thorough. Can provide references from previous clients.",
                    status: "approved",
                    created_at: new Date().toISOString()
                }
            ],
            nextId: 9
        };
        
        writeDatabase(initialData);
        console.log('✅ Database created with 8 sample workers!');
    } else {
        console.log('✅ Database file found!');
        
        // Verify database structure
        try {
            const db = readDatabase();
            if (!db.workers || !Array.isArray(db.workers)) {
                console.log('⚠️ Invalid database structure, reinitializing...');
                fs.unlinkSync(DB_FILE);
                initializeDatabase();
            } else {
                console.log(`📊 Database loaded: ${db.workers.length} workers found`);
            }
        } catch (error) {
            console.log('⚠️ Database corrupted, reinitializing...');
            fs.unlinkSync(DB_FILE);
            initializeDatabase();
        }
    }
}

// Read database
function readDatabase() {
    try {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('❌ Error reading database:', error.message);
        return { workers: [], nextId: 1 };
    }
}

// Write database
function writeDatabase(data) {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('❌ Error writing database:', error.message);
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

        // Apply filters
        if (category && category !== '') {
            workers = workers.filter(w => w.job_category === category);
        }

        if (barangay && barangay !== '') {
            workers = workers.filter(w => w.barangay === barangay);
        }

        // Sort by newest first
        workers.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        console.log(`📋 Workers fetched: ${workers.length} workers (category: ${category || 'all'}, barangay: ${barangay || 'all'})`);

        res.json({
            success: true,
            count: workers.length,
            workers: workers
        });
    } catch (error) {
        console.error('❌ Error fetching workers:', error);
        res.status(500).json({
            success: false,
            message: 'Error loading workers'
        });
    }
});

// 2. GET single worker contact info (FULL PROFILE)
app.get('/api/worker-contact/:id', (req, res) => {
    try {
        const { id } = req.params;
        const db = readDatabase();
        
        const worker = db.workers.find(w => w.id === parseInt(id) && w.status === 'approved');
        
        if (!worker) {
            console.log(`⚠️ Worker not found: ID ${id}`);
            return res.status(404).json({
                success: false,
                message: 'Worker not found'
            });
        }

        console.log(`👤 Worker profile viewed: ${worker.full_name}`);

        // Return COMPLETE worker information
        res.json({
            success: true,
            worker: {
                id: worker.id,
                name: worker.full_name,
                contactNumber: worker.contact_number,
                barangay: worker.barangay,
                category: worker.job_category,
                experience: worker.years_experience,
                specialty: worker.specialty,
                additionalInfo: worker.additional_info || ''  // Include additional info!
            }
        });
    } catch (error) {
        console.error('❌ Error fetching worker contact:', error);
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
            console.log('⚠️ Registration failed: Missing required fields');
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
            full_name: fullName.trim(),
            contact_number: contactNumber.trim(),
            barangay: barangay,
            job_category: jobCategory,
            years_experience: parseInt(experience),
            specialty: specialty.trim(),
            additional_info: additionalInfo ? additionalInfo.trim() : '',
            status: 'approved',
            created_at: new Date().toISOString()
        };

        // Add to workers array
        db.workers.push(newWorker);
        db.nextId++;

        // Save to database
        if (writeDatabase(db)) {
            console.log(`✅ New worker registered: ${newWorker.full_name} (ID: ${newWorker.id})`);
            console.log(`📊 Total workers now: ${db.workers.length}`);
            
            res.json({
                success: true,
                message: 'Registration successful!',
                workerId: newWorker.id
            });
        } else {
            console.log('❌ Failed to save to database');
            res.status(500).json({
                success: false,
                message: 'Failed to save registration. Please try again.'
            });
        }
    } catch (error) {
        console.error('❌ Error registering worker:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed. Please try again.'
        });
    }
});

// 4. GET statistics
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
        console.error('❌ Error fetching stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error loading statistics'
        });
    }
});

// Serve the frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check
app.get('/health', (req, res) => {
    const db = readDatabase();
    res.json({ 
        status: 'ok', 
        message: 'Trabahanap server is running!',
        workers: db.workers.length,
        uptime: process.uptime()
    });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log('═══════════════════════════════════════');
    console.log('🚀 Trabahanap Server is LIVE!');
    console.log(`📡 Port: ${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('═══════════════════════════════════════');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('⏹️ SIGTERM received, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('⏹️ SIGINT received, shutting down gracefully...');
    process.exit(0);
});

// Log unhandled errors
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});
