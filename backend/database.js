const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const schemaPath = path.resolve(__dirname, 'schema.sql');

// Create or connect to the database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        
        // Initialize tables with schema if they don't exist yet
        db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'", (err, row) => {
            if (err) {
                console.error("Error checking tables", err.message);
                return;
            }
            if (!row) {
                console.log("Initializing database from schema.sql...");
                const schemaSql = fs.readFileSync(schemaPath, 'utf8');
                
                // execute schema sequentially
                db.exec(schemaSql, (err) => {
                    if (err) {
                        console.error('Error executing schema SQL', err.message);
                    } else {
                        console.log('Database initialized successfully with schema and mock data!');
                    }
                });
            } else {
                console.log('Database tables already exist. Ready to go.');
            }
        });
    }
});

module.exports = db;
