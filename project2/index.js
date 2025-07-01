const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 8001;


//connection
mongoose.connect("mongodb://127.0.0.1:27017/youtube-app-1")
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err))

//Schema 
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    jobTitle: {
        type: String,
    }
});

//modal
const User = mongoose.model("user", userSchema);

//Middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());  // Add this to parse JSON requests

// CREATE - Add a new user
app.post('/users', async (req, res) => {
    try {
        const { firstName, lastName, email, jobTitle } = req.body;
        
        const newUser = new User({
            firstName,
            lastName,
            email,
            jobTitle
        }); 
        
        const savedUser = await newUser.save();
        
        res.status(201).json({
            status: "success",
            data: savedUser
        });
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message
        });
    }
});

// READ - Get all users
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        
        res.status(200).json({
            status: "success",
            results: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
});

// READ - Get a single user by ID
app.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "User not found"
            });
        }
        
        res.status(200).json({
            status: "success",
            data: user
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
});

// UPDATE - Update a user (PUT - full update)
app.put('/users/:id', async (req, res) => {
    try {
        const { firstName, lastName, email, jobTitle } = req.body;
        
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { firstName, lastName, email, jobTitle },
            { new: true, runValidators: true }
        );
        
        if (!updatedUser) {
            return res.status(404).json({
                status: "error",
                message: "User not found"
            });
        }
        
        res.status(200).json({
            status: "success",
            data: updatedUser
        });
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message
        });
    }
});

// UPDATE - Partial update a user (PATCH)
app.patch('/users/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!updatedUser) {
            return res.status(404).json({
                status: "error",
                message: "User not found"
            });
        }
        
        res.status(200).json({
            status: "success",
            data: updatedUser
        });
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message
        });
    }
});

// DELETE - Delete a user
app.delete('/users/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        
        if (!deletedUser) {
            return res.status(404).json({
                status: "error",
                message: "User not found"
            });
        }
        
        res.status(200).json({
            status: "success",
            message: "User successfully deleted"
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
});

// Root route
app.get('/', (req, res) => {
    res.send('User API is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});