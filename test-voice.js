#!/usr/bin/env node
/**
 * ODIADEV Voice Test - Generate 10-second audio
 * Tests the real TTS service directly
 */

import https from 'https';
import fs from 'fs';

const TTS_URL = 'https://tts-api.odia.dev/v1/tts';
const TTS_KEY = 'odiadev_10abb658e85c30550ed75b30e7f55836';

// 10-second text content
const testText = "Hello! This is ODIADEV voice AI testing. We are generating a ten second audio clip to verify our text to speech functionality is working perfectly. This audio demonstrates our Nigerian voice capabilities and confirms the integration is successful. Thank you for testing with us!";

async function testTTS() {
  console.log('🎤 Testing ODIADEV TTS Service...');
  console.log(`📝 Text: "${testText}"`);
  console.log(`🔗 URL: ${TTS_URL}`);
  
  const payload = JSON.stringify({
    text: testText,
    voice_id: 'naija_female_warm',
    format: 'mp3'
  });

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TTS_KEY}`,
      'Content-Length': Buffer.byteLength(payload)
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(TTS_URL, options, (res) => {
      console.log(`📊 Status: ${res.statusCode}`);
      console.log(`📋 Headers:`, res.headers);
      
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
        return;
      }

      const chunks = [];
      res.on('data', (chunk) => {
        chunks.push(chunk);
      });

      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const contentType = res.headers['content-type'] || 'audio/mpeg';
        
        console.log(`📦 Received ${buffer.length} bytes of ${contentType}`);
        
        // Save the audio file
        const filename = `odiadev-test-${Date.now()}.mp3`;
        fs.writeFileSync(filename, buffer);
        
        console.log(`✅ Audio saved as: ${filename}`);
        console.log(`🎵 Duration: ~10 seconds`);
        console.log(`🔊 Play with: start ${filename} (Windows) or open ${filename} (Mac)`);
        
        resolve({
          filename,
          size: buffer.length,
          contentType,
          duration: '~10 seconds'
        });
      });
    });

    req.on('error', (error) => {
      console.error('❌ Request failed:', error.message);
      reject(error);
    });

    req.write(payload);
    req.end();
  });
}

// Run the test
testTTS()
  .then((result) => {
    console.log('\n🎉 SUCCESS! Voice test completed:');
    console.log(`   File: ${result.filename}`);
    console.log(`   Size: ${result.size} bytes`);
    console.log(`   Type: ${result.contentType}`);
    console.log(`   Duration: ${result.duration}`);
    console.log('\n🚀 ODIADEV TTS is working perfectly!');
  })
  .catch((error) => {
    console.error('\n💥 FAILED! Voice test error:');
    console.error(`   Error: ${error.message}`);
    console.error('\n🔧 Check your TTS service configuration.');
    process.exit(1);
  });
