require('dotenv').config();
const { execSync } = require('child_process');

const db = process.env.DB_NAME;
const user = process.env.DB_USER;
const host = process.env.DB_HOST;

function run(cmd) {
  execSync(cmd, { stdio: 'inherit' });
}

console.log('Creating schema...');
run(`psql -h ${host} -U ${user} -d ${db} -f db/001_schema.sql`);

console.log('Seeding data...');
run(`psql -h ${host} -U ${user} -d ${db} -f db/002_seed.sql`);

console.log('Database ready.');
