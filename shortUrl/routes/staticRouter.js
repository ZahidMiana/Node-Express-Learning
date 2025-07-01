const express =require ('express')
const URL = require('../models/url');
const router = express.Router();


router.get('/', async (req, res) => {
    try {
        const allUrls = await URL.find({});
        return res.render("home", {
            urls: allUrls,
            user: req.user // Pass user data from middleware
        });
    } catch (error) {
        console.error('Error fetching URLs:', error);
        return res.render("home", {
            urls: [],
            error: 'Failed to load URLs',
            user: req.user
        });
    }
});


router.get('/signup', (req, res) => {
    return res.render("signup");
});

router.get('/login', (req, res) => {
    return res.render("login");
});



module.exports = router;