var sqlite3 = require('sqlite3');
sqlite3.verbose();
var util = require("util");
var db = new sqlite3.Database('photoWall.sqlite3',function () {
    db.all("SELECT * FROM uundefined_photos",function (err,row) {
        if(err){
            console.log("err: "+err);
        }else{
            console.log(row);
        }
    })
})