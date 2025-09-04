#!/usr/bin/env node
/**
 * ODIADEV Complete Voice Test
 * Tests all voice functionality end-to-end
 */

import https from 'https';
import http from 'http';
import fs from 'fs';

const TEST_RESULTS = {
  tts_api: false,
  stt_api: false,
  chat_api: false,
  voice_integration: false,
  audio_generation: false
};

function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const colors = {
    info: '\x1b[36m',
    success: '\x1b[32m',
    error: '\x1b[31m',
    warning: '\x1b[33m',
    reset: '\x1b[0m'
  };
  console.log(`${colors[type]}[${timestamp}] ${message}${colors.reset}`);
}

async function testTTSAPI() {
  log('🎤 Testing TTS API...', 'info');
  
  const testText = "Hello! This is ODIADEV voice AI testing. We are generating a ten second audio clip to verify our text to speech functionality is working perfectly.";
  
  return new Promise((resolve) => {
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
            log('✅ TTS API working - Audio URL generated', 'success');
            TEST_RESULTS.tts_api = true;
            TEST_RESULTS.audio_generation = true;
            resolve(true);
          } else {
            log('❌ TTS API failed - Invalid response format', 'error');
            resolve(false);
          }
        } catch (error) {
          log(`❌ TTS API failed - JSON parse error: ${error.message}`, 'error');
          resolve(false);
        }
      });
    });

    req.on('error', (error) => {
      log(`❌ TTS API failed - Request error: ${error.message}`, 'error');
      resolve(false);
    });

    req.write(postData);
    req.end();
  });
}

async function testSTTAPI() {
  log('🎙️ Testing STT API...', 'info');
  
  // Mock audio data (base64 encoded "test audio")
  const mockAudioBase64 = Buffer.from('test audio data').toString('base64');
  
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      audioBase64: mockAudioBase64,
      mimeType: 'audio/webm'
    });

    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/stt',
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
          if (response.text && typeof response.text === 'string') {
            log('✅ STT API working - Transcription returned', 'success');
            TEST_RESULTS.stt_api = true;
            resolve(true);
          } else {
            log('❌ STT API failed - Invalid response format', 'error');
            resolve(false);
          }
        } catch (error) {
          log(`❌ STT API failed - JSON parse error: ${error.message}`, 'error');
          resolve(false);
        }
      });
    });

    req.on('error', (error) => {
      log(`❌ STT API failed - Request error: ${error.message}`, 'error');
      resolve(false);
    });

    req.write(postData);
    req.end();
  });
}

async function testChatAPI() {
  log('💬 Testing Chat API...', 'info');
  
  const messages = [
    { role: 'user', content: 'Hello! Test the voice functionality.' }
  ];
  
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      messages: messages
    });

    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/chat',
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
          if (response.reply && typeof response.reply === 'string') {
            log('✅ Chat API working - Response generated', 'success');
            TEST_RESULTS.chat_api = true;
            resolve(true);
          } else {
            log('❌ Chat API failed - Invalid response format', 'error');
            resolve(false);
          }
        } catch (error) {
          log(`❌ Chat API failed - JSON parse error: ${error.message}`, 'error');
          resolve(false);
        }
      });
    });

    req.on('error', (error) => {
      log(`❌ Chat API failed - Request error: ${error.message}`, 'error');
      resolve(false);
    });

    req.write(postData);
    req.end();
  });
}

async function testVoiceIntegration() {
  log('🔗 Testing Voice Integration...', 'info');
  
  // Test the complete voice flow: Chat -> TTS
  const messages = [
    { role: 'user', content: 'Generate a 10-second audio test.' }
  ];
  
  return new Promise((resolve) => {
    // First, get chat response
    const chatData = JSON.stringify({ messages });
    const chatOptions = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/chat',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(chatData)
      }
    };

    const chatReq = http.request(chatOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const chatResponse = JSON.parse(data);
          if (chatResponse.reply) {
            // Now test TTS with the chat response
            const ttsData = JSON.stringify({
              text: chatResponse.reply,
              voice_id: 'naija_female_warm'
            });
            
            const ttsOptions = {
              hostname: 'localhost',
              port: 3001,
              path: '/api/tts',
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(ttsData)
              }
            };

            const ttsReq = http.request(ttsOptions, (ttsRes) => {
              let ttsData = '';
              ttsRes.on('data', (chunk) => {
                ttsData += chunk;
              });
              
              ttsRes.on('end', () => {
                try {
                  const ttsResponse = JSON.parse(ttsData);
                  if (ttsResponse.audioUrl) {
                    log('✅ Voice Integration working - Chat -> TTS flow complete', 'success');
                    TEST_RESULTS.voice_integration = true;
                    resolve(true);
                  } else {
                    log('❌ Voice Integration failed - TTS response invalid', 'error');
                    resolve(false);
                  }
                } catch (error) {
                  log(`❌ Voice Integration failed - TTS JSON error: ${error.message}`, 'error');
                  resolve(false);
                }
              });
            });

            ttsReq.on('error', (error) => {
              log(`❌ Voice Integration failed - TTS request error: ${error.message}`, 'error');
              resolve(false);
            });

            ttsReq.write(ttsData);
            ttsReq.end();
          } else {
            log('❌ Voice Integration failed - No chat response', 'error');
            resolve(false);
          }
        } catch (error) {
          log(`❌ Voice Integration failed - Chat JSON error: ${error.message}`, 'error');
          resolve(false);
        }
      });
    });

    chatReq.on('error', (error) => {
      log(`❌ Voice Integration failed - Chat request error: ${error.message}`, 'error');
      resolve(false);
    });

    chatReq.write(chatData);
    chatReq.end();
  });
}

function generateReport() {
  log('\n📊 ODIADEV Voice Test Report', 'info');
  log('=' * 50, 'info');
  
  const tests = [
    { name: 'TTS API', result: TEST_RESULTS.tts_api },
    { name: 'STT API', result: TEST_RESULTS.stt_api },
    { name: 'Chat API', result: TEST_RESULTS.chat_api },
    { name: 'Voice Integration', result: TEST_RESULTS.voice_integration },
    { name: 'Audio Generation', result: TEST_RESULTS.audio_generation }
  ];
  
  let passed = 0;
  tests.forEach(test => {
    const status = test.result ? '✅ PASS' : '❌ FAIL';
    const color = test.result ? 'success' : 'error';
    log(`${test.name}: ${status}`, color);
    if (test.result) passed++;
  });
  
  log('=' * 50, 'info');
  log(`Overall: ${passed}/${tests.length} tests passed`, passed === tests.length ? 'success' : 'warning');
  
  if (passed === tests.length) {
    log('🎉 ALL VOICE FUNCTIONALITY WORKING!', 'success');
    log('🚀 ODIADEV Voice System is ready for production!', 'success');
  } else {
    log('⚠️ Some tests failed. Check the logs above.', 'warning');
  }
  
  return passed === tests.length;
}

async function runAllTests() {
  log('🚀 Starting ODIADEV Voice System Tests...', 'info');
  log('Testing all voice functionality end-to-end', 'info');
  
  await testTTSAPI();
  await testSTTAPI();
  await testChatAPI();
  await testVoiceIntegration();
  
  const allPassed = generateReport();
  process.exit(allPassed ? 0 : 1);
}

// Run the tests
runAllTests().catch(error => {
  log(`💥 Test suite failed: ${error.message}`, 'error');
  process.exit(1);
});
