const { nanoid } = require ('nanoid');
const URL = require('../models/url');
const mongoose = require('mongoose');

async function handleGenerateNewShortUrl(req, res){
    try {
        // Check if MongoDB is connected
        if (mongoose.connection.readyState !== 1) {
            throw new Error('Database not connected');
        }

        const body = req.body;
        if(!body.url) return res.status(400).json({error: 'url is required'});
        
        // Ensure URL has proper protocol
        let url = body.url;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        
        const shortID = nanoid(8);

        const urlData = {
            shortId: shortID,
            redirectURL: url,
            visitHistory: [],
        };

        // Only add createdBy if user is logged in
        if (req.user && req.user._id) {
            urlData.createdBy = req.user._id;
        }

        await URL.create(urlData);

        // Check if request is from web form or API
        const contentType = req.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
            // API request - return JSON
            return res.json({
                id: shortID,
                shortUrl: `http://localhost:3000/${shortID}`,
                originalUrl: url
            });
        } else {
            // Web form request - render page with result
            const allUrls = await URL.find({});
            return res.render('home', {
                urls: allUrls,
                shortUrl: `http://localhost:3000/${shortID}`,
                originalUrl: url
            });
        }
    } catch (error) {
        console.error('Error generating short URL:', error);
        if (req.get('Content-Type') && req.get('Content-Type').includes('application/json')) {
            return res.status(500).json({error: 'Internal server error: ' + error.message});
        } else {
            const allUrls = await URL.find({}).catch(() => []);
            return res.render('home', {
                urls: allUrls,
                error: 'Failed to generate short URL: ' + error.message
            });
        }
    }
}

async function handleGetAnalytics(req, res) {
    try {
        const shortId = req.params.shortId;
        const result = await URL.findOne({ shortId });
        
        if (!result) {
            return res.status(404).json({ error: 'Short URL not found' });
        }
        
        return res.json({
            totalClicks: result.visitHistory.length,
            analytics: result.visitHistory,
            originalUrl: result.redirectURL,
            shortId: result.shortId
        });
    } catch (error) {
        console.error('Error getting analytics:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    handleGenerateNewShortUrl,
    handleGetAnalytics,
}