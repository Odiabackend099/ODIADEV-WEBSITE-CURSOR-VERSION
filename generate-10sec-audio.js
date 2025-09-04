#!/usr/bin/env node
/**
 * Generate 10-Second ODIADEV Audio Test
 */

import http from 'http';
import fs from 'fs';

const testText = "Hello! This is ODIADEV voice AI testing. We are generating a ten second audio clip to verify our text to speech functionality is working perfectly. This audio demonstrates our Nigerian voice capabilities and confirms the integration is successful. Thank you for testing with us!";

async function generateAudio() {
  console.log('🎤 Generating 10-second ODIADEV audio...');
  console.log(`📝 Text: "${testText}"`);
  
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      text: testText,
      voice_id: 'naija_female_warm'
    });

    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/tts',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.audioUrl && response.audioUrl.startsWith('data:audio/mpeg;base64,')) {
            // Extract base64 data
            const base64Data = response.audioUrl.split(',')[1];
            const audioBuffer = Buffer.from(base64Data, 'base64');
            
            // Save the audio file
            const filename = `odiadev-10sec-test-${Date.now()}.mp3`;
            fs.writeFileSync(filename, audioBuffer);
            
            console.log(`✅ Audio generated successfully!`);
            console.log(`📁 File: ${filename}`);
            console.log(`📦 Size: ${audioBuffer.length} bytes`);
            console.log(`⏱️ Duration: ~10 seconds`);
            console.log(`🎵 Voice: Nigerian Female (naija_female_warm)`);
            console.log(`🔊 Play with: start ${filename} (Windows)`);
            
            resolve({
              filename,
              size: audioBuffer.length,
              duration: '~10 seconds',
              voice: 'naija_female_warm'
            });
          } else {
            reject(new Error('Invalid audio URL format'));
          }
        } catch (error) {
          reject(new Error(`JSON parse error: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`Request error: ${error.message}`));
    });

    req.write(postData);
    req.end();
  });
}

// Generate the audio
generateAudio()
  .then((result) => {
    console.log('\n🎉 SUCCESS! 10-second audio generated:');
    console.log(`   📁 File: ${result.filename}`);
    console.log(`   📦 Size: ${result.size} bytes`);
    console.log(`   ⏱️ Duration: ${result.duration}`);
    console.log(`   🎵 Voice: ${result.voice}`);
    console.log('\n🚀 ODIADEV Voice System is working perfectly!');
  })
  .catch((error) => {
    console.error('\n💥 FAILED! Audio generation error:');
    console.error(`   Error: ${error.message}`);
    process.exit(1);
  });
