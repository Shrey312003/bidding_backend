const pool = require('../../database');
const queries = require('./queries');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const getUser = (req,res) =>{
    console.log(req.user);
    pool.query(
        queries.getUsers,[req.user.username], (err,result)=>{
            console.log(result.rows);
            if(err) throw err;
            res.status(200).json(result.rows);
        }
    )
}

const addUsers = (req, res) => {
    const { username, password, email } = req.body;

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            return res.status(500).send("Error hashing password");
        }

        pool.query(queries.checkUniqueName, [username])
            .then(results => {
                if (results.rows.length) {
                    return res.status(403).send("Username already exists");
                } else {
                    return pool.query(queries.checkUniqueEmail, [email]);
                }
            })
            .then(results => {
                if (results.rows.length) {
                    return res.status(403).send("Email already exists");
                } else {
                    return pool.query(queries.addUsers, [username, hash, email]);
                }
            })
            .then(() => {
                res.status(200).send("User created successfully");
            })
            .catch(err => {
                if (err.message !== "Username already exists" && err.message !== "Email already exists") {
                    console.error("Database error:", err);
                    res.status(500).send("An error occurred while creating the user");
                }
            });
    });
}

const loginUser = (req, res) => {
    const { username, password } = req.body;

    pool.query(queries.loginUser, [username])
        .then(results => {
            if (results.rows.length === 0) {
                return res.status(401).send("User doesn't exist");
            }

            const user = results.rows[0];


            return bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (!isMatch) {
                        return res.status(401).send("Invalid credentials");
                    }

                    // User authenticated, generate a JWT
                    const token = jwt.sign(
                        { id: user.id, username: user.username, role: user.role},
                        process.env.JWT_SECRET,
                        { expiresIn: '1h' } // Token expiration time
                    );

                    // Send the token to the client
                    res.json({ token,username });
                });
        })
        .catch(err => {
            console.error("Database error:", err);
            res.status(500).send("An error occurred while logging in");
        });
}

module.exports = {
    getUser,
    addUsers,
    loginUser,
}