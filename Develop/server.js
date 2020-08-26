// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
const fs = require("fs");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3000;
// Sets up the Express app to handle data parsing
app.use(express.static(__dirname + "/public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});
app.get("/api/notes", function (req, res) {
    console.log("get")
    fs.readFile("db/db.json",function(err,data){
        var readNote = JSON.parse(data)
    res.json(readNote);
});
})

app.delete("/api/notes/:id", function(req,res){
    var getID = req.params.id
    console.log("this is ID"+getID)
    fs.readFile("db/db.json",'utf8',function(err,data){
        if (err){
            return err
        }
        const updated = [];
        var noted = JSON.parse(data)
        console.log("each note", noted)
        for (i in noted){
            if (noted[i].id !== getID){
                updated.push(noted[i])
            }
        }        
        const rewrite = JSON.stringify(updated)
        console.log("this is the updated " + rewrite)
        fs.writeFile("db/db.json",rewrite,function(err,data){
            if (err){
                return err;
            }
        })
    })
    res.redirect('/');

 
    

});
app.post("/api/notes", function(req, res) {
    console.log("post")
    // req.body hosts is equal to the JSON post sent from the user
    // This works because of our body parsing middleware
    const notes = [];
    var writeNote = req.body;
    writeNote.id = '00'
    console.log(writeNote)
    notes.push(writeNote);

    var index = 0;
    fs.readFile("db/db.json",'utf8',function(err,data){
        if (err){
            return err
        }
        const readNote = JSON.parse(data)
        for (i in readNote){
            readNote[i].id = i+1;
            notes.push(readNote[i])
            console.log(readNote[i])
        }
        var readArr = JSON.stringify(notes)
        fs.writeFile("db/db.json", readArr,function(err,data){
            if (err){
                return err
            }
        })
        console.log(notes)
        res.json(notes);

    })
  

  });





app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });

