// Test the Sales Manager AI API
async function testChatAPI() {
  try {
    console.log('🧪 Testing Sales Manager AI API...');
    
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Hello, tell me about your AI expertise',
        sessionId: 'test123'
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    console.log('✅ API Response received:');
    console.log('Response:', data.response);
    console.log('Engagement Score:', data.engagementScore);
    console.log('Conversation Stage:', data.currentStage);
    console.log('Session ID:', data.sessionId);
    
    // Test another message
    console.log('\n🧪 Testing follow-up message...');
    
    const response2 = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'What projects have you worked on?',
        sessionId: 'test123'
      })
    });

    const data2 = await response2.json();
    console.log('✅ Second Response:');
    console.log('Response:', data2.response);
    console.log('Engagement Score:', data2.engagementScore);
    console.log('Conversation Stage:', data2.currentStage);
    
  } catch (error) {
    console.error('❌ API Test failed:', error.message);
  }
}

// Run the test
testChatAPI();
