const axios = require('axios');

const seedAdmin = async () => {
    try {
        const response = await axios.post('http://localhost:5000/api/auth/register', {
            name: 'Super Admin',
            email: 'admin@jira.com',
            phone: '9999999999',
            userId: 'ADMIN001',
            password: 'admin123',
            role: 'admin'
        });
        console.log('✅ Admin Seeded Successfully:', response.data.user.userId);
    } catch (error) {
        console.error('❌ Seeding Failed:', error.response ? error.response.data.error : error.message);
    }
};

seedAdmin();
