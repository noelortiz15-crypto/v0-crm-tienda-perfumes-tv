# MongoDB Setup Guide for Perfume CRM

This guide explains how to migrate your Perfume CRM from Supabase (PostgreSQL) to MongoDB.

## Prerequisites

- MongoDB installed locally OR MongoDB Atlas account
- Node.js and npm installed
- Access to your current Supabase data

## Option 1: Local MongoDB Installation

### Install MongoDB Community Edition

**macOS:**
\`\`\`bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
\`\`\`

**Ubuntu/Debian:**
\`\`\`bash
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
\`\`\`

**Windows:**
Download and install from [MongoDB Download Center](https://www.mongodb.com/try/download/community)

### Verify Installation
\`\`\`bash
mongosh
# Should connect to mongodb://localhost:27017
\`\`\`

## Option 2: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (Free tier available)
4. Click "Connect" and get your connection string
5. Format: `mongodb+srv://<username>:<password>@cluster.mongodb.net/<database>`

## Migration Steps

### Step 1: Export Schema from CRM

1. Go to Settings → Database Configuration
2. Click on "MongoDB" tab
3. Click "Export Schema to MongoDB Format"
4. Save the `mongodb-schema.js` file

### Step 2: Import Schema to MongoDB

**Local MongoDB:**
\`\`\`bash
mongosh < mongodb-schema.js
\`\`\`

**MongoDB Atlas:**
\`\`\`bash
mongosh "mongodb+srv://cluster.mongodb.net" --username <user> < mongodb-schema.js
\`\`\`

### Step 3: Export Data from Supabase

**Option A: Using Supabase Dashboard**
1. Go to your Supabase project
2. Click "Table Editor"
3. Export each table as CSV

**Option B: Using pg_dump**
\`\`\`bash
pg_dump -h your-project.supabase.co -U postgres -d postgres -t profiles,suppliers,products,customers,employees,sales,sales_items --data-only --column-inserts > supabase_data.sql
\`\`\`

### Step 4: Convert and Import Data to MongoDB

Create a data conversion script (`convert-data.js`):

\`\`\`javascript
const { MongoClient } = require('mongodb');
const fs = require('fs');

async function importData() {
  const client = new MongoClient('mongodb://localhost:27017');
  
  try {
    await client.connect();
    const db = client.db('perfume_crm');
    
    // Import suppliers
    const suppliersCSV = fs.readFileSync('suppliers.csv', 'utf8');
    const suppliers = parseCSV(suppliersCSV);
    await db.collection('suppliers').insertMany(suppliers);
    
    // Repeat for other collections...
    
    console.log('Data imported successfully!');
  } finally {
    await client.close();
  }
}

function parseCSV(csvText) {
  // Simple CSV parser - consider using a library like 'csv-parse' for production
  const lines = csvText.split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const obj = {};
    headers.forEach((header, index) => {
      obj[header.trim()] = values[index]?.trim();
    });
    return obj;
  });
}

importData();
\`\`\`

Run the conversion:
\`\`\`bash
npm install mongodb
node convert-data.js
\`\`\`

### Step 5: Configure CRM to Use MongoDB

1. Go to Settings → Database Configuration
2. Click "MongoDB" tab
3. Enter your connection details:
   - **URI**: `mongodb://localhost:27017` or your Atlas URI
   - **Database**: `perfume_crm`
   - **Username**: (if authentication enabled)
   - **Password**: (if authentication enabled)
4. Click "Test Connection"
5. Click "Save Configuration"

### Step 6: Update Application Code (Future Enhancement)

The current application uses Supabase. To fully switch to MongoDB, you would need to:

1. Install MongoDB driver: `npm install mongodb`
2. Create MongoDB client wrapper
3. Replace Supabase queries with MongoDB queries
4. Update authentication system

This would be a significant refactor and is planned for a future version.

## Current Limitations

The settings page allows you to:
- Configure MongoDB connection details
- Export schema structure
- Test MongoDB connection

However, the application still uses Supabase for data operations. Full MongoDB integration would require updating all data access layers.

## Troubleshooting

**Connection Failed:**
- Check MongoDB is running: `sudo systemctl status mongod`
- Verify firewall allows port 27017
- For Atlas: Check IP whitelist in Atlas dashboard

**Import Errors:**
- Ensure CSV files are properly formatted
- Check data types match schema validation rules
- Verify all required fields are present

**Performance Issues:**
- Ensure indexes are created (automatic via schema script)
- Consider sharding for large datasets
- Use MongoDB Compass to analyze query performance

## Next Steps

After successful migration:
1. Test all CRM features with new database
2. Monitor performance and optimize queries
3. Set up regular backups
4. Configure replica sets for high availability (production)

## Support

For issues or questions:
- MongoDB Documentation: https://docs.mongodb.com
- MongoDB University: https://university.mongodb.com (Free courses)
- Community Forums: https://www.mongodb.com/community/forums
