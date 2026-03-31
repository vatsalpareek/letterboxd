const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const authController = {
    signup: async (req, res) => {
        try {
            const { username, email, password } = req.body;
            // 1. check if all things provided
            if (!username || !email || !password) {
                return res.status(400).json({ error: 'All fields are required ' });
            }
            //2. check if email already exists
            const existingUser = await userModel.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({ error: 'Email already exists' });
            }
            // 3. check if username already exists
            const existingUsername = await userModel.findByUsername(username);
            if (existingUsername) {
                return res.status(400).json({ error: 'Username already taken' });
            }
            //3. hash password
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);
            //4. create user
            const user = await userModel.create(username, email, passwordHash);
            //5. generate token
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            //6. send response
            res.status(201).json({ token, user });
        } catch (error) {
            console.error('Signup error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            // 1. check if all things provided
            if (!email || !password) {
                return res.status(400).json({ error: 'All fields are required ' });
            }
            //2. check if email already exists
            const user = await userModel.findByEmail(email);
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            //3. check if password is correct
            const isMatch = await bcrypt.compare(password, user.password_hash);
            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            //4. generate token
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            //5. send response
            res.status(200).json({ 
                token, 
                user: { 
                    id: user.id, 
                    username: user.username, 
                    email: user.email, 
                    created_at: user.created_at 
                } 
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = authController;