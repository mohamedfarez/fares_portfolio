// Test the AI Engineer personality with various scenarios
async function testPersonality() {
  try {
    console.log('🧪 Testing AI Engineer Personality...\n');
    
    const testCases = [
      {
        name: "Technical Inquiry",
        message: "How do you implement computer vision for real-time detection?"
      },
      {
        name: "Budget Concern", 
        message: "This sounds expensive, what would it cost?"
      },
      {
        name: "Demo Request",
        message: "Can you show me a demo of your work?"
      },
      {
        name: "Collaboration Interest",
        message: "I'd like to discuss working together on a project"
      },
      {
        name: "Experience Question",
        message: "Tell me about your experience with prompt engineering"
      }
    ];

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      console.log(`\n📋 Test ${i + 1}: ${testCase.name}`);
      console.log(`Question: "${testCase.message}"`);
      
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: testCase.message,
          sessionId: `test_${i + 1}`
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      console.log('✅ Response:', data.response);
      console.log(`📊 Engagement Score: ${data.engagementScore}/100`);
      console.log(`🎯 Stage: ${data.currentStage}/5`);
      console.log('---'.repeat(20));
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testPersonality();
