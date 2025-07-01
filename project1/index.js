const express = require ('express');
const users = require('./data.json');
const fs = require ('fs');

const app = express();
const PORT = 3000;
 
//middleware 
app.use(express.urlencoded ({extended: false}));

app.use((req, res, next) => {
    fs.appendFile('log.txt', `\n${Date.now()}: 
    ${req.method}: ${req.path}\n`,
    (err, data) =>{
        next();
    }
    );
});

//this is basically just for html rendering on browser
app.get('/users', (req, res) => {
    const html = `
    <ul>
        ${users.map((user) => `<li>${user.first_name} </li>`).join("")}
    </ul>
    `;
    res.send(html);
});


//Routes REST API'S
//Hybrid approach using /api/users mean achieve anywhere or any device 
app.get('/api/users', (req, res) => {
    res.setHeader("myName", "Piyush Garg");
    return res.json(users);
});

//get by id
app.get('/api/users/:id', (req, res) =>{
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    res.json(user);
});

//post
app.post('/api/users', (req,res) =>{
    const body = req.body;
    users.push({...body, id: users.length +1});
    fs.writeFile('./data.json', JSON.stringify(users), (err, data) => {
        return res.json({status : "Success", id: users.length});
    })
   
})

//put
app.put('/api/users/:id', (req, res) =>{
    return res.json({status : "pending"});
});
//patch
app.patch('/api/users/:id', (req, res) =>{
    return res.json({status : "pending"});
});
//Delete
app.delete('/api/users/:id', (req, res) => {
    return res.json({status : "pending"});
});

 
app.listen(PORT, () => console.log(`Server started at Port ${PORT}`));

