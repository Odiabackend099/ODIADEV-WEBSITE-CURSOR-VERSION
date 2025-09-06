import React, { useState } from 'react'
import { motion } from 'framer-motion'
import AdaquaChatWidget from '../components/chat/AdaquaChatWidget'

const AdaquaTest = () => {
  const [testResults, setTestResults] = useState<string[]>([])

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`])
  }

  const testTTS = async () => {
    addTestResult('Testing TTS API...')
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: 'Hello! This is a test of the ODIADEV TTS system.',
          voice_id: 'naija_female_warm'
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        addTestResult(`✅ TTS Success: ${data.audioUrl ? 'Audio generated' : 'No audio URL'}`)
      } else {
        addTestResult(`❌ TTS Failed: ${response.status}`)
      }
    } catch (error) {
      addTestResult(`❌ TTS Error: ${error}`)
    }
  }

  const testChat = async () => {
    addTestResult('Testing Chat API...')
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Hello Agent ODIADEV',
          sessionId: 'test-session'
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        addTestResult(`✅ Chat Success: ${data.reply}`)
      } else {
        addTestResult(`❌ Chat Failed: ${response.status}`)
      }
    } catch (error) {
      addTestResult(`❌ Chat Error: ${error}`)
    }
  }

  const testSTT = async () => {
    addTestResult('Testing STT API...')
    try {
      const response = await fetch('/api/stt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioBase64: 'dGVzdCBhdWRpbyBkYXRh',
          mimeType: 'audio/webm'
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        addTestResult(`✅ STT Success: ${data.text}`)
      } else {
        addTestResult(`❌ STT Failed: ${response.status}`)
      }
    } catch (error) {
      addTestResult(`❌ STT Error: ${error}`)
    }
  }

  const runAllTests = async () => {
    setTestResults([])
    addTestResult('🚀 Starting Adaqua AI Tests...')
    
    await testTTS()
    await testChat()
    await testSTT()
    
    addTestResult('✅ All tests completed!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Adaqua AI Test Center
          </h1>
          <p className="text-lg text-gray-600">
            Test your conversational AI assistant with Nigerian voice
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Test Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              API Tests
            </h2>
            
            <div className="space-y-4">
              <button
                onClick={testTTS}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
              >
                🎤 Test TTS (Text-to-Speech)
              </button>
              
              <button
                onClick={testChat}
                className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors"
              >
                💬 Test Chat API
              </button>
              
              <button
                onClick={testSTT}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors"
              >
                🎙️ Test STT (Speech-to-Text)
              </button>
              
              <button
                onClick={runAllTests}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                🚀 Run All Tests
              </button>
            </div>
          </motion.div>

          {/* Test Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Test Results
            </h2>
            
            <div className="bg-gray-100 rounded-lg p-4 h-96 overflow-y-auto">
              {testResults.length === 0 ? (
                <p className="text-gray-500 text-center">No tests run yet. Click a test button to start.</p>
              ) : (
                <div className="space-y-2">
                  {testResults.map((result, index) => (
                    <div
                      key={index}
                      className={`text-sm p-2 rounded ${
                        result.includes('✅') ? 'bg-green-100 text-green-800' :
                        result.includes('❌') ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {result}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-white rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            How to Use the Chat Widget
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Text Chat
              </h3>
              <ul className="text-gray-600 space-y-1">
                <li>• Type your message in the input field</li>
                <li>• Press Enter or click Send</li>
                <li>• Agent ODIADEV will respond with text and voice</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Voice Chat
              </h3>
              <ul className="text-gray-600 space-y-1">
                <li>• Hold the microphone button</li>
                <li>• Speak your message</li>
                <li>• Release to send for transcription</li>
                <li>• Get voice response automatically</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800">
              <strong>Note:</strong> The chat widget is now active on this page. 
              Look for the floating blue button in the bottom-right corner to start chatting with Agent ODIADEV!
            </p>
          </div>
        </motion.div>
      </div>

      {/* Chat Widget */}
      <AdaquaChatWidget />
    </div>
  )
}

export default AdaquaTest

