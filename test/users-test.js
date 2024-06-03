// test/users-test.js

const axios = require('axios');

describe('User Registration and Login', function() {
    let baseURL = 'http://localhost:8000/users';
    let chai;

    before(async () => {
        chai = await import('chai');
    });

    // it('should register a new user', async function() {
    //     const response = await axios.post(`${baseURL}/register`, {
    //         username: 'testuser8',
    //         password: 'testpassword6',
    //         email:"test8@gmail.com"
    //     });

    //     chai.expect(response.status).to.equal(201);
        
    // });

    it('should log in a user', async function() {
        const response = await axios.post(`${baseURL}/login`, {
            username: 'testuser6',
            password: 'testpassword6'
        });

        chai.expect(response.status).to.equal(200);
        chai.expect(response.data).to.have.property('token');
    });
});
