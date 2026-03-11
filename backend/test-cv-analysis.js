// backend/test-cv-analysis.js
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

(async () => {
  try {
    // TODO: set these values for your environment
    const BASE_URL = process.env.TEST_API_BASE_URL || 'http://localhost:5000';
    const TOKEN = process.env.TEST_TOKEN || 'PASTE_YOUR_JWT_TOKEN_HERE';
    const JOB_ID = process.env.TEST_JOB_ID || 'PASTE_AN_EXISTING_JOB_ID_HERE';
    const CV_PATH = process.env.TEST_CV_PATH || path.join(__dirname, 'sample-cv.pdf');

    if (!fs.existsSync(CV_PATH)) {
      console.error('CV file not found at:', CV_PATH);
      process.exit(1);
    }

    console.log('Using CV file:', CV_PATH);
    console.log('Job ID:', JOB_ID);

    // 1) Upload CV
    const form = new FormData();
    form.append('file', fs.createReadStream(CV_PATH));
    form.append('jobID', JOB_ID);

    console.log('Uploading CV to /upload/cv...');
    const uploadRes = await axios.post(`${BASE_URL}/upload/cv`, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${TOKEN}`,
      },
      withCredentials: true,
    });

    console.log('Upload response status:', uploadRes.status);
    console.log('Upload response data:', uploadRes.data);

    const { newCandidate } = uploadRes.data || {};
    const candidateID = newCandidate?.id || newCandidate?._id;

    if (!candidateID) {
      console.error('No candidateID returned from /upload/cv');
      process.exit(1);
    }

    // 2) Analyze candidate vs job
    console.log('Calling /ai/analyize...');
    const analyzeRes = await axios.post(
      `${BASE_URL}/ai/analyize`,
      { jobID: JOB_ID, candidateID },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${TOKEN}`,
        },
        withCredentials: true,
      }
    );

    console.log('Analyze response status:', analyzeRes.status);
    console.dir(analyzeRes.data, { depth: null });

    console.log('\n✅ Test completed.');
  } catch (err) {
    if (err.response) {
      console.error('❌ HTTP error:', err.response.status, err.response.data);
    } else {
      console.error('❌ Error:', err.message || err);
    }
    process.exit(1);
  }
})();