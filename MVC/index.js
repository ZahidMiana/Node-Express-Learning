const express = require ('express');
const mongoose = require ('mongoose');
const userRouter = require('./routes/userRoutes');

const app = express();
const PORT = 8000;

//connect db
mongoose.connect("mongodb://127.0.0.1:27017/Miana")
.then(() => console.log("Mongodb Connected!"))
.catch((err) => console.log(err))


//Middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());



//Route
app.get('/', (req, res) => {
    res.send("User Api is Running");
});

app.use('/users', userRouter);

//listen
app.listen(PORT, () => {
    console.log(`Server is Running on ${PORT}`);
});
