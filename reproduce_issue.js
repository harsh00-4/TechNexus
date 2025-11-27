const API_URL = 'http://127.0.0.1:5000/api';

async function reproduce() {
    try {
        // 1. Login/Signup to get a token
        console.log('Attempting to login/signup...');
        let token;
        let userId;

        // Try login first
        let res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'test_repro@example.com',
                password: 'password123'
            })
        });

        if (!res.ok) {
            console.log('Login failed, trying signup...');
            res = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: 'Test Repro',
                    email: 'test_repro@example.com',
                    password: 'password123'
                })
            });
        }

        const authData = await res.json();
        if (!authData.success && !authData.token) {
            throw new Error('Auth failed: ' + JSON.stringify(authData));
        }

        token = authData.token;
        console.log('Auth successful, token obtained');

        // 2. Create Group
        console.log('Attempting to create group...');
        const groupRes = await fetch(`${API_URL}/groups`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: 'Repro Group ' + Date.now(), // Unique name
                description: 'Testing group creation',
                type: 'personal',
                memberIds: []
            })
        });

        const groupData = await groupRes.json();

        if (!groupRes.ok) {
            console.error('❌ Error reproducing issue:');
            console.error('Status:', groupRes.status);
            console.error('Data:', JSON.stringify(groupData, null, 2));
        } else {
            console.log('✅ Group created successfully:', groupData);
        }

    } catch (error) {
        console.error('❌ Script error:', error);
    }
}

reproduce();
