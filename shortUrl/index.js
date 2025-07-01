const express = require ('express');
const {connectToMongo } = require ('./connect');
const urlRoute = require ('./routes/url');
const URL = require ('./models/url');
const path = require('path');
const staticRoute = require('./routes/staticRouter');
const userRoute = require("./routes/user");
const cookieParser = require ('cookie-parser');
const {restrictToLoggedinUserOnly, checkForAuthentication} = require("./middlewares/auth");

const app = express();
const PORT = 3000;

//connect db
connectToMongo('mongodb://127.0.0.1:27017/Short')
.then(() => console.log("Mongo DB Connected"))
.catch((err) => console.log("MongoDB connection error:", err))

//view enguine 
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

//middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());


//server side rendring kaliye thaa
// app.get("/test", async (req, res) => {
//     const allUrls = await URL.find({});
//     return res.render('home', {
//         urls: allUrls,
//     });
// })

app.use('/url', restrictToLoggedinUserOnly, urlRoute);
app.use('/user', userRoute); // Move user routes before the catch-all shortId route
app.use('/', checkForAuthentication, staticRoute);

// Short URL redirect route - MUST be last to avoid conflicts
app.get('/:shortId', async(req, res) => {
    try {
        const shortId = req.params.shortId;
        
        // Skip certain paths that shouldn't be treated as shortIds
        const skipPaths = ['favicon.ico', 'robots.txt', 'sitemap.xml'];
        if (skipPaths.includes(shortId)) {
            return res.status(404).end();
        }
        
        const entry = await URL.findOneAndUpdate({
            shortId
        }, 
        {
            $push: {
                visitHistory: {
                timestamp: Date.now(),
                },
            },   
        },
        { new: true } // Return the updated document
        );

        if (!entry) {
            return res.status(404).json({ error: 'Short URL not found' });
        }

        res.redirect(entry.redirectURL);
    } catch (error) {
        console.error('Error redirecting:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.listen(PORT, () => {
    console.log(`Server tarted at Port: ${PORT}`);
})