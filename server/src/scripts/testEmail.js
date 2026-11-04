/**
 * Development-only Email Diagnostic & Verification Script for Artish UK
 * Tests Google Workspace / Gmail SMTP configuration on port 465 (SSL/TLS).
 *
 * Usage:
 *   cd server
 *   node src/scripts/testEmail.js
 */

const path = require('path');
const net = require('net');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const nodemailer = require('nodemailer');
const { getEmailConfig, testEmailDelivery } = require('../utils/mailer');

async function runDiagnostic() {
  console.log('======================================================================');
  console.log('🔍 ARTISH UK – EMAIL NOTIFICATION DIAGNOSTIC & VERIFICATION');
  console.log('======================================================================\n');

  const config = getEmailConfig();

  console.log('1. Checking Backend Environment Variables (server/.env):');
  console.log(`   - SMTP_HOST:          ${config.host}`);
  console.log(`   - SMTP_PORT:          ${config.port} (${config.secure ? 'SSL/TLS' : 'STARTTLS'})`);
  console.log(`   - EMAIL_USER:         ${config.user || '❌ MISSING'}`);
  console.log(`   - ENQUIRY_RECEIVER:   ${config.receiver || '❌ MISSING'}`);
  console.log(`   - EMAIL_APP_PASSWORD: ${config.pass ? `✅ Configured (${config.pass.length} characters)` : '❌ EMPTY / NOT SET'}\n`);

  console.log('2. Testing TCP Network Reachability to smtp.gmail.com:465...');
  await new Promise((resolve) => {
    const socket = net.createConnection(config.port, config.host, () => {
      console.log(`   ✅ Direct TCP connection to ${config.host}:${config.port} succeeded (port open, no firewall block).`);
      socket.end();
      resolve();
    });
    socket.on('error', (err) => {
      console.error(`   ❌ TCP connection to ${config.host}:${config.port} failed: ${err.message}`);
      console.log('   Check local outbound firewall or network proxy rules.');
      resolve();
    });
  });

  console.log('\n3. Testing Nodemailer Authentication with Google Workspace SMTP...');
  if (!config.isConfigured) {
    console.log('   Attempting verification without password to inspect Nodemailer & SMTP response...');
    try {
      const testTransporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth: {
          user: config.user,
          pass: '',
        },
      });
      await testTransporter.verify();
    } catch (authErr) {
      console.log(`   ❌ Exact Nodemailer Error: ${authErr.message} (Code: ${authErr.code})`);
    }

    console.log('\n----------------------------------------------------------------------');
    console.log('🎯 ACTUAL CAUSE OF THE ISSUE:');
    console.log('----------------------------------------------------------------------');
    console.log('The enquiries are saved to the database and visible in your Admin Panel');
    console.log('because your MySQL backend is fully operational.');
    console.log('');
    console.log('However, NO email arrives at info@artishmedia.com because EMAIL_APP_PASSWORD');
    console.log('is currently EMPTY in your backend configuration: server/.env');
    console.log('');
    console.log('Google Workspace strictly rejects unauthenticated SMTP connections.');
    console.log('Nodemailer threw: "Missing credentials for \'PLAIN\' (EAUTH)".');
    console.log('');
    console.log('📋 NEXT STEPS TO COMPLETE CONFIGURATION:');
    console.log('1. Go to your Google Account (for info@artishmedia.com):');
    console.log('   https://myaccount.google.com/apppasswords');
    console.log('2. Ensure 2-Step Verification is active on the account.');
    console.log('3. Under "App passwords", enter "Artish Website" and click Create.');
    console.log('4. Copy the 16-character generated password (e.g. abcd efgh ijkl mnop).');
    console.log('5. Open server/.env and add it to line 8:');
    console.log('   EMAIL_APP_PASSWORD="your-16-character-password"');
    console.log('6. Re-run this test script:');
    console.log('   npm run test:email');
    console.log('----------------------------------------------------------------------\n');
    process.exit(1);
  }

  console.log(`   Connecting to ${config.host}:${config.port} with user "${config.user}"...`);
  const result = await testEmailDelivery();

  if (result.success) {
    console.log('\n🎉 SUCCESS! SMTP TEST PASSED!');
    console.log(`   - Subject:              Artish UK - Email Delivery Test`);
    console.log(`   - Recipient:            ${config.receiver}`);
    console.log(`   - Message ID:           ${result.messageId}`);
    console.log(`   - Accepted by Google:   ${JSON.stringify(result.accepted)}`);
    console.log(`   - SMTP Server Response: ${result.response}`);
    console.log('\n----------------------------------------------------------------------');
    console.log('📬 IMPORTANT GOOGLE WORKSPACE INBOX DELIVERY NOTES:');
    console.log('----------------------------------------------------------------------');
    console.log('1. "Sent to self" in Gmail: Because the email is sent FROM info@artishmedia.com');
    console.log('   TO info@artishmedia.com, Gmail automatically places it in "Sent" and "All Mail".');
    console.log('   Search "in:anywhere Artish UK - Email Delivery Test" to see it.');
    console.log('2. Spam folder: Check "in:spam" in case Google Workspace flagged automated dispatch.');
    console.log('3. Google Workspace Email Log Search: If using an admin account, verify delivery in:');
    console.log('   Google Admin Console (admin.google.com) > Reports > Email Log Search.');
    console.log('----------------------------------------------------------------------\n');
    process.exit(0);
  } else {
    console.log('\n❌ SMTP DELIVERY TEST FAILED:');
    console.log(`   - Error:       ${result.error}`);
    if (result.code) console.log(`   - Error Code:  ${result.code}`);
    console.log(`   - Diagnosis:   ${result.explanation}\n`);
    process.exit(1);
  }
}

runDiagnostic().catch((err) => {
  console.error('Fatal diagnostic crash:', err);
  process.exit(1);
});
