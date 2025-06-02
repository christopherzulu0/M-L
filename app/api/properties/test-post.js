// Test script for POST /api/properties endpoint
// Run this script with Node.js to test the endpoint

const fetch = require('node-fetch');

async function testPostProperty() {
  try {
    const response = await fetch('http://localhost:3000/api/properties', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Test Property',
        propertyTypeId: 1,
        listingTypeId: 1,
        price: 250000,
        address: '123 Test Street',
        locationId: 1,
        bedrooms: 3,
        bathrooms: 2,
        squareFeet: 1500,
        status: 'draft'
      }),
    });

    const data = await response.json();

    console.log('Status:', response.status);
    console.log('Response:', data);

    if (response.status === 201) {
      console.log('✅ POST /api/properties endpoint is working correctly!');
    } else {
      console.log('❌ POST /api/properties endpoint returned an unexpected status code.');
    }
  } catch (error) {
    console.error('Error testing POST /api/properties endpoint:', error);
  }
}

testPostProperty();
