const express = require ('express');
const mongoose = require ('mongoose');


const app = express();
const PORT = 8000;

//connect db
mongoose.connect("mongodb://127.0.0.1:27017/Miana")
.then(() => console.log("Mongodb Connected!"))
.catch((err) => console.log(err))

//Schema
const userSchema = new mongoose.Schema({
    firstname : {
        type: String,
        required: true,
    },
    lastname : {
        type: String,
    },
    email : {
        type: String,
        required: true,
        unique: true,
    },
    jobTitle : {
        type: String,
    }
}, 
    {timestamps: true}
);

//modal
const User = mongoose.model("user", userSchema);

//Middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//Crud Operation 
//1: POST Request

app.post("/users", async(req, res) => {
    try{
        const {firstname, lastname, email, jobTile} = req.body;

        const newUser = new User({
            firstname,
            lastname,
            email,
            jobTile
        });

        const saveData = await newUser.save();

        res.status(201).json({
            status: "success",
            data: saveData,
        });
    }
    catch(err){
        res.status(400).json({
            status: "error",
            message: err.message,
        });
    }
});

//2: GET
app.get("/users", async(eq, res) => {
    try{
        const users = await User.find();

        res.status(200).json({
            status: "success",
            result: users.length,
            data: users,
        });
    }
    catch(err){
        res.status(500).json({
            status: "error",
            message: err.message,
        });
    }
});

//3: Get by Id
app.get("/users/:id", async(req, res) => {
    try{
        const user = await User.findById(req.params.id);

        if(!user){
            return res.status(404).json({
                status: "error",
                message: "user not found",
            });
        }

        res.status(200).json({
            status: "success",
            data: user,
        });
    }
    catch(err){
        res.status(500).json({
            status: "error",
            message: err.message,
        });
    }
});

//4: put fully update
app.put("/users/:id", async(req, res) => {
    try{
        const {firstname, lastname, email, jobTitle} = req.body;

        const updateUser = await User.findByIdAndUpdate(req.params.id, 
            {firstname, lastname, email, jobTitle}, 
            {new: true, runValidators: true}
        )

        if(!updateUser){
            res.status(404).json({
                status: "error",
                message: "User Not Found",
            });
        }

        res.status(200).json({
            status: "success",
            data: updateUser,
        });
    }
    catch(err){
        res.status(500).json({
            status: "error",
            message: err.message,
        });
    }
});

//5:patch
app.patch("/users/:id", async(req, res) => {
    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id,
            req.body,
            {new: true, runValidators: true}
        )

        if(!updateUser){
            res.status(404).json({
                status: "error",
                message: "User Not Found"
            });
        }

        res.status(200).json({
            status: "success",
            data: userUpdate,
        });
    }
    catch(err){
        res.status(500).json({
            status: "error",
            message: err.message,
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


//Route
app.get('/', (req, res) => {
    res.send("User Api is Running");
});

//listen
app.listen(PORT, () => {
    console.log(`Server is Running on ${PORT}`);
});
