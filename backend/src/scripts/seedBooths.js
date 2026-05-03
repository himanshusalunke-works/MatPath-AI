const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const { db } = require('../config/firebase');

const sampleBooths = [
  // Kothrud
  { id: 101, name: "MIT World Peace University", ac: "Kothrud", lat: 18.5182, lng: 73.8151, address: "Paud Road, Kothrud, Pune", status: "Moderate Queue" },
  { id: 102, name: "Abhinav Vidyalaya High School", ac: "Kothrud", lat: 18.5061, lng: 73.8153, address: "Erandwane, Kothrud, Pune", status: "Short Queue" },
  
  // Shivajinagar
  { id: 201, name: "Fergusson College Main Building", ac: "Shivajinagar", lat: 18.5230, lng: 73.8391, address: "FC Road, Shivajinagar, Pune", status: "Long Queue" },
  { id: 202, name: "Modern College of Arts, Science and Commerce", ac: "Shivajinagar", lat: 18.5273, lng: 73.8430, address: "Off JM Road, Shivajinagar, Pune", status: "Short Queue" },

  // Pune Cantonment
  { id: 301, name: "St. Vincent's High School", ac: "Pune Cantonment", lat: 18.5108, lng: 73.8741, address: "Camp, Pune", status: "Moderate Queue" },
  { id: 302, name: "Poona College of Arts, Science & Commerce", ac: "Pune Cantonment", lat: 18.5085, lng: 73.8814, address: "Camp Area, Pune", status: "Short Queue" },

  // Vadgaon Sheri
  { id: 401, name: "Symbiosis International School", ac: "Vadgaon Sheri", lat: 18.5645, lng: 73.9110, address: "Viman Nagar, Pune", status: "Moderate Queue" },
  { id: 402, name: "Christ College", ac: "Vadgaon Sheri", lat: 18.5620, lng: 73.9175, address: "Wadgaon Sheri, Pune", status: "Short Queue" },

  // Kasba Peth
  { id: 501, name: "NMV High School", ac: "Kasba Peth", lat: 18.5147, lng: 73.8540, address: "Appa Balwant Chowk, Kasba Peth, Pune", status: "Long Queue" },
  { id: 502, name: "PES Girls High School", ac: "Kasba Peth", lat: 18.5204, lng: 73.8567, address: "Shaniwar Peth, Kasba Peth Area, Pune", status: "Moderate Queue" },

  // Default / Catch-All
  { id: 999, name: "Pune Central Election Office", ac: "Default", lat: 18.5204, lng: 73.8567, address: "Shivaji Nagar, Pune", status: "Short Queue" }
];

async function seedBooths() {
    try {
        const batch = db.batch();
        const boothsCollection = db.collection('booths');

        const existing = await boothsCollection.get();
        existing.forEach(doc => {
            batch.delete(doc.ref);
        });

        sampleBooths.forEach(booth => {
            const docRef = boothsCollection.doc(booth.id.toString());
            batch.set(docRef, booth);
        });

        await batch.commit();

        console.log(`Successfully seeded ${sampleBooths.length} sample booths to Firestore.`);
        process.exit(0);
    } catch (error) {
        console.error('Failed to seed booths:', error);
        process.exit(1);
    }
}

seedBooths();
