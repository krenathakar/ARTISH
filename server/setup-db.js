// Sync DB schema (and optionally seed once). Never fails the build/start.
const { execSync } = require('child_process');
const run = (cmd) => execSync(cmd, { stdio: 'inherit' });

try {
  run('npx prisma db push --skip-generate');
  if (process.env.SEED_ON_START === 'true') {
    console.log('SEED_ON_START=true -> seeding database (remove this variable afterwards)');
    run('node prisma/seed.js');
  }
} catch (err) {
  console.error('Database setup failed:', err.message);
}
