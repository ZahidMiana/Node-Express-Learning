const User = require('../models/user');

// POST - Create a user
exports.createUser = async (req, res) => {
    try {
        const { firstname, lastname, email, jobTitle } = req.body; // Fixed typo: jobTile → jobTitle

        const newUser = new User({
            firstname,
            lastname,
            email,
            jobTitle
        });

        const savedUser = await newUser.save();

        res.status(201).json({
            status: 'success',
            data: savedUser,
        });
    } catch (err) {
        res.status(400).json({
            status: 'error',
            message: err.message,
        });
    }
};

// GET - Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();

        res.status(200).json({
            status: 'success',
            result: users.length,
            data: users,
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message,
        });
    }
};

// GET - Get user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found',
            });
        }

        res.status(200).json({
            status: 'success',
            data: user,
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message,
        });
    }
};

// PUT - Fully update user
exports.updateUser = async (req, res) => {
    try {
        const { firstname, lastname, email, jobTitle } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { firstname, lastname, email, jobTitle },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                status: 'error',
                message: 'User Not Found',
            });
        }

        res.status(200).json({
            status: 'success',
            data: updatedUser,
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message,
        });
    }
};

// PATCH - Partially update user
exports.patchUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                status: 'error',
                message: 'User Not Found',
            });
        }

        res.status(200).json({
            status: 'success',
            data: updatedUser, // Fixed typo: userUpdate → updatedUser
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message,
        });
    }
};

// DELETE - Delete a user
exports.deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found',
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'User successfully deleted',
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message,
        });
    }
};