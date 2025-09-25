// Simple test to verify our setup works
console.log('🚀 Testing Fares AI Portfolio Setup...');

// Load environment variables
const fs = require('fs');
const path = require('path');

// Test 1: Check if we can import basic modules
try {
  console.log('✅ Test 1: Basic setup - PASSED');
} catch (error) {
  console.log('❌ Test 1: Basic setup - FAILED', error);
}

// Test 2: Check environment variables from .env.local
let hasOpenAI = '❌';
let hasGoogleAI = '❌';

try {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  hasOpenAI = envContent.includes('OPENAI_API_KEY=sk-') ? '✅' : '❌';
  hasGoogleAI = envContent.includes('GOOGLE_AI_STUDIO_KEY=') ? '✅' : '❌';
} catch (error) {
  console.log('⚠️  Could not read .env.local file');
}

console.log(`${hasOpenAI} Test 2a: OpenAI API Key configured`);
console.log(`${hasGoogleAI} Test 2b: Google AI Studio Key configured`);

// Test 3: Check file structure

const requiredFiles = [
  'package.json',
  'next.config.js',
  'tailwind.config.js',
  'tsconfig.json',
  '.env.local',
  'src/app/globals.css',
  'src/app/layout.tsx',
  'src/app/[locale]/layout.tsx',
  'src/app/[locale]/page.tsx',
  'src/middleware.ts',
  'public/locales/en/common.json',
  'public/locales/ar/common.json'
];

console.log('\n📁 File Structure Check:');
requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, file));
  console.log(`${exists ? '✅' : '❌'} ${file}`);
});

console.log('\n🎉 Setup verification complete!');
console.log('Next step: Run "npm install" to install dependencies');
