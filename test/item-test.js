const axios = require('axios');

describe('Item Creation and Bidding', function() {
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

    it('should create a new item', async function() {
        const response = await axios.post(`${baseURL}/items`, {
            name: 'Test Item',
            starting_price: 100,
            description: 'This is a test item',
            user_id:'7',
            image_url:"/upload",
            end_time: new Date().toISOString()
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        chai.expect(response.status).to.equal(201);
    });

    it('should place a bid on an item', async function() {
        const response = await axios.post(`${baseURL}/items/15/bids`, {
            bid_amount: 150000
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        chai.expect(response.status).to.equal(201);
    });
});
