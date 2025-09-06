#!/usr/bin/env node

/**
 * ODIADEV Chat Widget Test Script
 * Tests the complete implementation following the universal prompt template
 */

import https from 'https';
import http from 'http';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https');
    const client = isHttps ? https : http;
    
    const req = client.request(url, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      timeout: 10000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data: data, headers: res.headers });
        }
      });
    });
    
    req.on('error', reject);
    req.on('timeout', () => reject(new Error('Request timeout')));
    
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    
    req.end();
  });
}

async function testTTSAPI() {
  log('\n🎤 Testing TTS API...', 'blue');
  
  try {
    const response = await makeRequest('http://localhost:5173/api/tts', {
      method: 'POST',
      body: {
        text: 'Hello! This is a test of the ODIADEV TTS system.',
        voice_id: 'naija_female_warm',
        format: 'mp3'
      }
    });
    
    if (response.status === 200 && response.data.audioUrl) {
      log('✅ TTS API working correctly', 'green');
      log(`   Voice: ${response.data.voice_id}`, 'yellow');
      log(`   Format: ${response.data.format}`, 'yellow');
      log(`   Audio size: ${response.data.size} bytes`, 'yellow');
      return true;
    } else {
      log(`❌ TTS API failed: ${response.status}`, 'red');
      log(`   Response: ${JSON.stringify(response.data)}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ TTS API error: ${error.message}`, 'red');
    return false;
  }
}

async function testChatAPI() {
  log('\n💬 Testing Chat API...', 'blue');
  
  try {
    const response = await makeRequest('http://localhost:5173/api/chat', {
      method: 'POST',
      body: {
        message: 'Hello Agent ODIADEV',
        sessionId: 'test-session-' + Date.now()
      }
    });
    
    if (response.status === 200 && response.data.reply) {
      log('✅ Chat API working correctly', 'green');
      log(`   Response: ${response.data.reply}`, 'yellow');
      return true;
    } else {
      log(`❌ Chat API failed: ${response.status}`, 'red');
      log(`   Response: ${JSON.stringify(response.data)}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Chat API error: ${error.message}`, 'red');
    return false;
  }
}

async function testRateLimiting() {
  log('\n🚦 Testing Rate Limiting...', 'blue');
  
  try {
    const promises = Array(5).fill().map(() => 
      makeRequest('http://localhost:5173/api/tts', {
        method: 'POST',
        body: {
          text: 'Rate limit test',
          voice_id: 'naija_female_warm'
        }
      })
    );
    
    const responses = await Promise.all(promises);
    const rateLimited = responses.some(r => r.status === 429);
    
    if (rateLimited) {
      log('✅ Rate limiting working correctly', 'green');
      return true;
    } else {
      log('⚠️  Rate limiting may not be working', 'yellow');
      return false;
    }
  } catch (error) {
    log(`❌ Rate limiting test error: ${error.message}`, 'red');
    return false;
  }
}

async function testCORS() {
  log('\n🌐 Testing CORS Configuration...', 'blue');
  
  try {
    const response = await makeRequest('http://localhost:5173/api/tts', {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://odia.dev',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    const corsHeaders = {
      'access-control-allow-origin': response.headers['access-control-allow-origin'],
      'access-control-allow-methods': response.headers['access-control-allow-methods'],
      'access-control-allow-headers': response.headers['access-control-allow-headers']
    };
    
    if (corsHeaders['access-control-allow-origin']) {
      log('✅ CORS configured correctly', 'green');
      log(`   Allowed Origin: ${corsHeaders['access-control-allow-origin']}`, 'yellow');
      return true;
    } else {
      log('❌ CORS not properly configured', 'red');
      return false;
    }
  } catch (error) {
    log(`❌ CORS test error: ${error.message}`, 'red');
    return false;
  }
}

async function runAllTests() {
  log('🚀 Starting ODIADEV Chat Widget Tests', 'bold');
  log('=====================================', 'bold');
  
  const results = {
    tts: await testTTSAPI(),
    chat: await testChatAPI(),
    rateLimit: await testRateLimiting(),
    cors: await testCORS()
  };
  
  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  
  log('\n📊 Test Results Summary', 'bold');
  log('=======================', 'bold');
  log(`TTS API: ${results.tts ? '✅ PASS' : '❌ FAIL'}`, results.tts ? 'green' : 'red');
  log(`Chat API: ${results.chat ? '✅ PASS' : '❌ FAIL'}`, results.chat ? 'green' : 'red');
  log(`Rate Limiting: ${results.rateLimit ? '✅ PASS' : '⚠️  WARN'}`, results.rateLimit ? 'green' : 'yellow');
  log(`CORS: ${results.cors ? '✅ PASS' : '❌ FAIL'}`, results.cors ? 'green' : 'red');
  
  log(`\nOverall: ${passed}/${total} tests passed`, passed === total ? 'green' : 'yellow');
  
  if (passed === total) {
    log('\n🎉 All tests passed! Your ODIADEV Chat Widget is ready for deployment.', 'green');
  } else {
    log('\n⚠️  Some tests failed. Please check the configuration and try again.', 'yellow');
  }
}

// Check if server is running
async function checkServer() {
  try {
    await makeRequest('http://localhost:5173/api/tts', { method: 'OPTIONS' });
    return true;
  } catch (error) {
    return false;
  }
}

async function main() {
  log('ODIADEV Chat Widget Test Suite', 'bold');
  log('==============================', 'bold');
  
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    log('\n❌ Server not running!', 'red');
    log('Please start the development server first:', 'yellow');
    log('  npm run dev:full', 'blue');
    log('  or', 'yellow');
    log('  npm run dev && npm run dev:api', 'blue');
    process.exit(1);
  }
  
  await runAllTests();
}

main().catch(console.error);
