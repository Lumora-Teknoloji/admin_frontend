const http = require('http');
const https = require('https');

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '/admin';
const PORT = process.env.PORT || 3002;
const HOST = 'localhost';

const checkUrl = (url) => {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        const req = client.get(url, (res) => {
            if (res.statusCode >= 200 && res.statusCode < 400) {
                resolve(true);
            } else {
                reject(new Error(`Status Code: ${res.statusCode}`));
            }
        });
        req.on('error', (err) => reject(err));
        req.end();
    });
};

async function main() {
    console.log('🔍 Starting Deployment Health Check...');
    console.log(`📡 Configuration:`);
    console.log(`   - Base Path: ${BASE_PATH}`);
    console.log(`   - Port: ${PORT}`);
    console.log(`   - URL: http://${HOST}:${PORT}${BASE_PATH}`);

    try {
        console.log('\n1️⃣  Checking Frontend Accessibility...');
        await checkUrl(`http://${HOST}:${PORT}${BASE_PATH}/login`);
        console.log('✅ Frontend is reachable.');

        console.log('\n2️⃣  Checking Backend Proxy...');
        // Note: This endpoint might fail if auth is required, but 401/403 proves connectivity
        // We'll consider 401/403 as "reachable" for connectivity check
        try {
            await checkUrl(`http://${HOST}:${PORT}${BASE_PATH}/api/scraper/status`);
            console.log('✅ Backend Proxy is reachable (200 OK).');
        } catch (e) {
            if (e.message.includes('401') || e.message.includes('403')) {
                console.log('✅ Backend Proxy is reachable (Auth working).');
            } else {
                throw e;
            }
        }

        console.log('\n🎉 Deployment Check Passed! System is compatible.');
    } catch (error) {
        console.error('\n❌ Deployment Check Failed:', error.message);
        process.exit(1);
    }
}

main();
