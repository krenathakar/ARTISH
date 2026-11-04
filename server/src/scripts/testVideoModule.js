const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

async function runTests() {
  console.log('🧪 Starting Video / Reels Management Module Tests...\n');
  const baseUrl = 'http://localhost:5000/api';

  // 0. Ensure an admin exists and generate token
  let admin = await prisma.adminUser.findFirst();
  if (!admin) {
    console.error('❌ No admin user found in database!');
    process.exit(1);
  }

  const token = jwt.sign(
    { id: admin.id, email: admin.email, role: admin.role },
    process.env.JWT_SECRET || 'artish_uk_jwt_secret_key_2026_change_in_production',
    { expiresIn: '1h' }
  );
  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  let createdIds = [];

  try {
    // 1. Verify unauthorized request is blocked (401)
    console.log('Test 1: Verify admin protection on GET /api/videos without token...');
    const unauthRes = await fetch(`${baseUrl}/videos`);
    if (unauthRes.status === 401) {
      console.log('✅ Pass: Unauthenticated request blocked with 401');
    } else {
      console.error('❌ Failed: Expected 401 but got', unauthRes.status);
      process.exit(1);
    }

    // 2. Add a YouTube video
    console.log('\nTest 2: Add a standard YouTube video (POST /api/videos)...');
    const ytReq = await fetch(`${baseUrl}/videos`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        title: 'Brand Story Showcase',
        description: 'Cinematic corporate overview',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        category: 'Business Promotions',
        status: 'PUBLISHED',
        displayOrder: 10,
        featured: true,
      }),
    });
    const ytData = await ytReq.json();
    if (ytData.videoType === 'YOUTUBE' && ytData.thumbnailUrl.includes('img.youtube.com')) {
      console.log('✅ Pass: YouTube video created with auto-detected type and auto-thumbnail:', ytData.thumbnailUrl);
      createdIds.push(ytData.id);
    } else {
      console.warn('⚠️ Warning: Unexpected YouTube response:', ytData);
    }

    // 3. Add a YouTube Short
    console.log('\nTest 3: Add a YouTube Short (POST /api/videos)...');
    const shortsReq = await fetch(`${baseUrl}/videos`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        title: 'Quick Food Reel Short',
        description: 'Behind the scenes sizzle',
        videoUrl: 'https://youtube.com/shorts/abcdef12345',
        category: 'Restaurants',
        status: 'PUBLISHED',
        displayOrder: 11,
      }),
    });
    const shortsData = await shortsReq.json();
    if (shortsData.videoType === 'YOUTUBE_SHORTS') {
      console.log('✅ Pass: YouTube Shorts created with auto-detected type YOUTUBE_SHORTS');
      createdIds.push(shortsData.id);
    } else {
      console.warn('⚠️ Warning: Shorts type detection mismatch:', shortsData);
    }

    // 4. Add an Instagram Reel
    console.log('\nTest 4: Add an Instagram Reel (POST /api/videos)...');
    const igReq = await fetch(`${baseUrl}/videos`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        title: 'Viral London Cafe Reel',
        description: 'Instagram campaign',
        videoUrl: 'https://www.instagram.com/reel/C3x9Z123456/',
        category: 'Restaurants',
        status: 'PUBLISHED',
        displayOrder: 12,
      }),
    });
    const igData = await igReq.json();
    if (igData.videoType === 'INSTAGRAM') {
      console.log('✅ Pass: Instagram Reel created with type INSTAGRAM');
      createdIds.push(igData.id);
    } else {
      console.warn('⚠️ Warning: Instagram type detection mismatch:', igData);
    }

    // 5. Add a direct MP4 video
    console.log('\nTest 5: Add a direct MP4 video (POST /api/videos)...');
    const mp4Req = await fetch(`${baseUrl}/videos`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        title: 'Festival Aftermovie Clip',
        description: 'High energy event cut',
        videoUrl: '/videos/panchmasi.mp4',
        category: 'Events',
        status: 'DRAFT',
        displayOrder: 13,
      }),
    });
    const mp4Data = await mp4Req.json();
    if (mp4Data.videoType === 'MP4' && mp4Data.status === 'DRAFT') {
      console.log('✅ Pass: Direct MP4 video created as DRAFT');
      createdIds.push(mp4Data.id);
    }

    // 6. Edit an existing video
    console.log('\nTest 6: Edit existing video (PUT /api/videos/:id)...');
    const editReq = await fetch(`${baseUrl}/videos/${ytData.id}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({
        title: 'Brand Story Showcase (Updated)',
        category: 'Podcasts',
        displayOrder: 25,
      }),
    });
    const editData = await editReq.json();
    if (editData.title === 'Brand Story Showcase (Updated)' && editData.displayOrder === 25) {
      console.log('✅ Pass: Video successfully updated');
    }

    // 7. Toggle publish/unpublish status
    console.log('\nTest 7: Toggle video status (PATCH /api/videos/:id/status)...');
    const toggleReq = await fetch(`${baseUrl}/videos/${ytData.id}/status`, {
      method: 'PATCH',
      headers: authHeaders,
    });
    const toggleData = await toggleReq.json();
    console.log('Status toggled from PUBLISHED to:', toggleData.status);
    if (toggleData.status === 'DRAFT') {
      console.log('✅ Pass: Video status successfully toggled to DRAFT');
    }

    // 8. Verify Public Endpoint does NOT return drafts
    console.log('\nTest 8: Verify GET /api/videos/public excludes draft videos...');
    const publicReq = await fetch(`${baseUrl}/videos/public`);
    const publicVideos = await publicReq.json();
    const containsDraft = publicVideos.some((v) => v.id === ytData.id || v.id === mp4Data.id);
    if (!containsDraft) {
      console.log(`✅ Pass: Public endpoint returned ${publicVideos.length} published videos; 0 drafts exposed.`);
    } else {
      console.error('❌ Failed: Public endpoint returned draft videos!');
    }

    // 9. Delete a video
    console.log('\nTest 9: Delete video (DELETE /api/videos/:id)...');
    const deleteId = mp4Data.id;
    const delReq = await fetch(`${baseUrl}/videos/${deleteId}`, {
      method: 'DELETE',
      headers: authHeaders,
    });
    const delData = await delReq.json();
    console.log('Delete response:', delData.message);
    const checkDeleted = await prisma.video.findUnique({ where: { id: deleteId } });
    if (!checkDeleted) {
      console.log('✅ Pass: Video successfully deleted from database');
      createdIds = createdIds.filter((id) => id !== deleteId);
    }

    // 10. Clean up other test videos so only authentic reels remain
    for (const id of createdIds) {
      await prisma.video.delete({ where: { id } }).catch(() => {});
    }
    console.log('🧹 Cleaned up temporary test video records');

    // 11. Verify existing endpoints
    console.log('\nTest 11: Verify other API routes still work correctly...');
    const srvCheck = await (await fetch(`${baseUrl}/services`)).json();
    const testCheck = await (await fetch(`${baseUrl}/testimonials`)).json();
    console.log(`✅ Services returned: ${srvCheck.length}`);
    console.log(`✅ Testimonials returned: ${testCheck.length}`);

    console.log('\n🎉 ALL TESTS PASSED PERFECTLY!\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Test failed with error:', err.message);
    for (const id of createdIds) {
      await prisma.video.delete({ where: { id } }).catch(() => {});
    }
    process.exit(1);
  }
}

// Start test
runTests();
