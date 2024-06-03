const axios = require('axios');

describe('Notifications', function() {
    let baseURL = 'http://localhost:8000';
    let token;

    before(async () => {
        chai = await import('chai');
    });

    before(async function() {
        const response = await axios.post(`${baseURL}/users/login`, {
            username: 'testuser6',
            password: 'testpassword6'
        });
        token = response.data.token;
    });

    it('should get notifications', async function() {
        const response = await axios.get(`${baseURL}/notifications`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        chai.expect(response.status).to.equal(200);
        chai.expect(response.data).to.be.an('array');
    });

    it('should mark a notification as read', async function() {
        const response = await axios.post(`${baseURL}/notifications/mark-read/3`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        chai.expect(response.status).to.equal(200);
        // chai.expect(response.data).to.have.property('is_read', true);
    });
});