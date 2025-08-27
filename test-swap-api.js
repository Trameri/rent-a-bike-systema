// Test script per verificare le API di sostituzione bici
// Esegui con: node test-swap-api.js

const API_BASE = 'http://localhost:4000/api';

// Simula un token JWT (sostituisci con un token valido)
const TEST_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Inserisci token valido

async function testAPI(endpoint, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TEST_TOKEN}`
      }
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(`${API_BASE}${endpoint}`, options);
    const data = await response.json();
    
    console.log(`✅ ${method} ${endpoint}:`, response.status);
    if (!response.ok) {
      console.log('❌ Error:', data);
    } else {
      console.log('📊 Data:', Array.isArray(data) ? `Array(${data.length})` : 'Object');
    }
    console.log('---');
    
    return { success: response.ok, data };
  } catch (error) {
    console.log(`❌ ${method} ${endpoint}: ERROR`);
    console.log('Error:', error.message);
    console.log('---');
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🧪 TESTING BIKE SWAP APIs');
  console.log('========================\n');
  
  // Test 1: Lista contratti attivi
  console.log('1. Testing active contracts...');
  await testAPI('/contracts?status=in-use,reserved&limit=5');
  
  // Test 2: Storico sostituzioni
  console.log('2. Testing swap history...');
  await testAPI('/contracts/swap-history?limit=10');
  
  // Test 3: Ricerca per barcode (esempio)
  console.log('3. Testing barcode search...');
  await testAPI('/contracts/active-by-barcode/TEST123');
  
  // Test 4: Lista bici disponibili
  console.log('4. Testing available bikes...');
  await testAPI('/bikes?status=available&limit=5');
  
  // Test 5: Ricerca bici per barcode
  console.log('5. Testing bike by barcode...');
  await testAPI('/bikes/barcode/TEST456');
  
  console.log('🎉 Test completati!');
  console.log('\n📝 Note:');
  console.log('- Sostituisci TEST_TOKEN con un token JWT valido');
  console.log('- I test di ricerca per barcode falliranno se i barcode non esistono');
  console.log('- Per testare la sostituzione vera, usa l\'interfaccia web');
}

// Esegui i test solo se questo file viene eseguito direttamente
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}

export { testAPI, runTests };