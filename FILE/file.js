const fs = require ('fs');
const os = require ("os");

console.log(os.cpus().length);

//SYNC.... call create a file and write some data 
// fs.writeFileSync('./test.txt',"O ki Haal hai");

//ASYNC ....call 
// fs.writeFile("./test1.txt", "Hello I am hare", (err) => {});

//read file sync it always return something 
const result = fs.readFileSync("./contact.txt", "utf-8");
console.log(result);


//read file ASync it never return always expect call back function
fs.readFile("./contact.txt", "utf-8", (err, result) => {
    if(err)
    {
        console.log("ERROR", err);
    }
    else
    {
        console.log(result);
    }
})


//we can also append , copy and delete files or 
//more different operation perform 
