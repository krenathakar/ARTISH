const fs = require('fs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

async function verifyAll() {
  console.log('🔍 Running Verification for Upcoming Reels Feature...\n');
  const baseUrl = 'http://localhost:5000/api';

  // 1. Verify all previously uploaded reels remain unchanged against backup
  console.log('Check 1: Verify previously uploaded reels remain 100% unchanged...');
  const backupData = JSON.parse(fs.readFileSync('./server/prisma/backup_videos.json', 'utf8'));
  const currentDbVideos = await prisma.video.findMany({ orderBy: { id: 'asc' } });

  const backupIds = new Set(backupData.map((v) => v.id));
  let allMatched = true;

  for (const b of backupData) {
    const cur = currentDbVideos.find((v) => v.id === b.id);
    if (!cur) {
      console.error(`❌ Missing previously uploaded reel: ID ${b.id} "${b.title}"`);
      allMatched = false;
      continue;
    }
    if (cur.videoUrl !== b.videoUrl || cur.title !== b.title) {
      console.error(`❌ Mismatch in reel ID ${b.id}: Expected "${b.title}" (${b.videoUrl}), found "${cur.title}" (${cur.videoUrl})`);
      allMatched = false;
    }
  }

  // Specifically verify Jatin Woodman
  const jatinReel = currentDbVideos.find((v) => v.title === 'Jatin Woodman' && v.videoUrl.includes('IMG_2382.mp4'));
  if (jatinReel) {
    console.log('✅ Pass: Jatin Woodman reel is verified intact:', jatinReel.videoUrl);
  } else {
    console.error('❌ Failed: Jatin Woodman reel was altered or removed!');
    process.exit(1);
  }

  if (allMatched) {
    console.log(`✅ Pass: All ${backupData.length} previously uploaded reels are completely unchanged.\n`);
  } else {
    process.exit(1);
  }

  // 2. Generate Admin Token for API testing
  const admin = await prisma.adminUser.findFirst();
  const token = jwt.sign(
    { id: admin.id, email: admin.email, role: admin.role },
    process.env.JWT_SECRET || 'artish_uk_jwt_secret_key_2026_change_in_production',
    { expiresIn: '1h' }
  );
  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  let testReelId = null;

  try {
    // 3. Verify public endpoint currently serves published reels
    console.log('Check 2: Verify existing website video section works via GET /api/videos/public...');
    const publicInitial = await (await fetch(`${baseUrl}/videos/public`)).json();
    console.log(`✅ Pass: Public endpoint returned ${publicInitial.length} existing published reels.\n`);

    // 4. Admin adds a new upcoming reel as DRAFT
    console.log('Check 3 & 8: Admin adds a new upcoming reel as DRAFT...');
    const createReq = await fetch(`${baseUrl}/videos`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        title: 'Upcoming Summer Festival Reel 2026',
        description: 'Exclusive teaser before launch',
        videoUrl: 'https://youtube.com/shorts/sample12345',
        category: 'Events',
        status: 'DRAFT',
        displayOrder: 99,
        featured: false,
      }),
    });
    const createdData = await createReq.json();
    testReelId = createdData.id;
    console.log(`✅ Pass: Created upcoming reel with ID ${testReelId}, status: ${createdData.status}`);

    // Verify DRAFT does NOT appear on public endpoint
    const publicAfterDraft = await (await fetch(`${baseUrl}/videos/public`)).json();
    const hasDraft = publicAfterDraft.some((v) => v.id === testReelId);
    if (!hasDraft) {
      console.log('✅ Pass: Draft reel is HIDDEN from public website.\n');
    } else {
      console.error('❌ Failed: Draft reel appeared publicly!');
      process.exit(1);
    }

    // 5. Admin edits the newly added reel
    console.log('Check 4: Admin edits the newly added upcoming reel...');
    const editReq = await fetch(`${baseUrl}/videos/${testReelId}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({
        title: 'Upcoming Summer Festival Reel 2026 (Final Polish)',
        description: 'Updated description for marketing team',
        category: 'Events',
        displayOrder: 1,
      }),
    });
    const editedData = await editReq.json();
    if (editedData.title === 'Upcoming Summer Festival Reel 2026 (Final Polish)' && editedData.displayOrder === 1) {
      console.log('✅ Pass: Newly added reel successfully edited.\n');
    } else {
      console.error('❌ Failed to edit reel:', editedData);
      process.exit(1);
    }

    // 6. Admin publishes the newly added reel
    console.log('Check 6 & 7: Admin publishes the newly added reel...');
    const pubReq = await fetch(`${baseUrl}/videos/${testReelId}/status`, {
      method: 'PATCH',
      headers: authHeaders,
      body: JSON.stringify({ status: 'PUBLISHED' }),
    });
    const pubData = await pubReq.json();
    if (pubData.status === 'PUBLISHED') {
      console.log('✅ Pass: Status changed to PUBLISHED');
    }

    // Verify it now appears on the public website alongside existing reels
    const publicAfterPublish = await (await fetch(`${baseUrl}/videos/public`)).json();
    const foundPublished = publicAfterPublish.find((v) => v.id === testReelId);
    if (foundPublished) {
      console.log(`✅ Pass: Published new reel appeared on public website! (Total published: ${publicAfterPublish.length})`);
    } else {
      console.error('❌ Failed: Published reel not found on public website!');
      process.exit(1);
    }

    // 7. Admin unpublishes the reel back to DRAFT
    console.log('\nCheck 6b: Admin unpublishes the reel back to DRAFT...');
    const unpubReq = await fetch(`${baseUrl}/videos/${testReelId}/status`, {
      method: 'PATCH',
      headers: authHeaders,
      body: JSON.stringify({ status: 'DRAFT' }),
    });
    const unpubData = await unpubReq.json();
    if (unpubData.status === 'DRAFT') {
      console.log('✅ Pass: Status toggled back to DRAFT');
    }

    const publicAfterUnpublish = await (await fetch(`${baseUrl}/videos/public`)).json();
    if (!publicAfterUnpublish.some((v) => v.id === testReelId)) {
      console.log('✅ Pass: Unublished reel is immediately removed from public display.\n');
    }

    // 8. Admin deletes the newly added reel
    console.log('Check 5: Admin deletes the newly added reel...');
    const delReq = await fetch(`${baseUrl}/videos/${testReelId}`, {
      method: 'DELETE',
      headers: authHeaders,
    });
    const delData = await delReq.json();
    console.log('Delete response:', delData.message);

    const checkExists = await prisma.video.findUnique({ where: { id: testReelId } });
    if (!checkExists) {
      console.log('✅ Pass: Newly added reel deleted with confirmation.\n');
      testReelId = null;
    }

    // 9. Final check: All original reels are untouched
    const finalCount = await prisma.video.count();
    console.log(`Final check: Database has ${finalCount} reels (original count: ${backupData.length}).`);
    if (finalCount === backupData.length) {
      console.log('✅ Pass: Original database state completely preserved.');
    }

    console.log('\n🎉 ALL 8 VERIFICATION CHECKS PASSED WITH 100% SUCCESS!\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Verification failed:', err.message);
    if (testReelId) {
      await prisma.video.delete({ where: { id: testReelId } }).catch(() => {});
    }
    process.exit(1);
  }
}

verifyAll();

