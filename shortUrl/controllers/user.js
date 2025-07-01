const { v4: uuidv4 } = require('uuid');
const User = require('../models/user');
const { setUser, getUser } = require('../service/auth');

async function handleUserSignup(req, res){
    try {
        const { name, email, password} = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render("signup", { 
                error: 'User with this email already exists!' 
            });
        }

        // Create new user
        const newUser = await User.create({
            name,
            email,
            password
        });

        console.log('User created successfully:', newUser);

        // Redirect to home page with success message
        const URL = require('../models/url');
        const allUrls = await URL.find({});
        return res.render("home", {
            urls: allUrls,
            success: `Welcome ${name}! Account created successfully.`
        });

    } catch (error) {
        console.error('Error creating user:', error);
        return res.render("signup", { 
            error: 'Failed to create account. Please try again.' 
        });
    }
}

async function handleUserLogin(req, res){
    try {
        const { email, password} = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.render("login", { 
                error: 'Invalid email or password!' 
            });
        }

        // Check if password matches (in a real app, you'd use bcrypt to hash passwords)
        if (user.password !== password) {
            return res.render("login", { 
                error: 'Invalid email or password!' 
            });
        }

        console.log('User logged in successfully:', user.name);

        const sessionId = uuidv4();
        setUser(sessionId, user);
        res.cookie("uid", sessionId);

        // Redirect to home page with success message
        const URL = require('../models/url');
        const allUrls = await URL.find({});
        return res.render("home", {
            urls: allUrls,
            success: `Welcome back, ${user.name}! You have successfully logged in.`,
            user: user // Pass user info to the home page
        });

    } catch (error) {
        console.error('Error during login:', error);
        return res.render("login", { 
            error: 'Login failed. Please try again.' 
        });
    }
}

async function handleGetAllUsers(req, res) {
    try {
        const users = await User.find({}).select('-password'); // Exclude password from response
        
        // Check if request wants JSON (API call) or HTML (web page)
        if (req.headers.accept && req.headers.accept.includes('application/json')) {
            return res.json({
                success: true,
                count: users.length,
                users: users
            });
        } else {
            // Render users page for web browser
            return res.render('users', {
                users: users
            });
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        if (req.headers.accept && req.headers.accept.includes('application/json')) {
            return res.status(500).json({ error: 'Failed to fetch users' });
        } else {
            return res.render('users', {
                users: [],
                error: 'Failed to load users'
            });
        }
    }
}

async function handleUserLogout(req, res) {
    try {
        // Clear the cookie
        res.clearCookie('uid');
        
        // In a real app with sessions, you'd destroy the session here
        const URL = require('../models/url');
        const allUrls = await URL.find({});
        
        return res.render("home", {
            urls: allUrls,
            success: "You have been successfully logged out!"
        });
    } catch (error) {
        console.error('Error during logout:', error);
        return res.redirect('/');
    }
}

module.exports = {
    handleUserSignup,
    handleUserLogin,
    handleUserLogout,
    handleGetAllUsers,
}