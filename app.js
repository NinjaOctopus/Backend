var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    methodOverride = require("method-override"),
    Cookbook = require("./models/cookbook");

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine","ejs");
app.use(methodOverride("_method"));

mongoose.connect("mongodb://cookbookuser:taylorswift111@ds259111.mlab.com:59111/cookbook", { useNewUrlParser: true }); // connect to our database

// middleware to use for all requests
app.use(function(req, res, next) {
    // do logging
    console.log("Something is happening");
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
app.get("/", function(req, res) {
    res.json({ message: "Welcome to our api. Use postman to test this API. GET for read, POST for new, PUT for edit and DELETE for delete. Goodluck!!!"});   
});
// get all the bears (accessed at GET http://localhost:8080/api/bears)
app.get("/cookbook", function(req, res) {
    Cookbook.find(function(err, cookbook) {
        if (err) {
            res.send(err);
        } else {
            res.json(cookbook);
        }
    });
});

// Creating new from the mobile app
app.get("/cookbook/new", function(req, res){
    res.render("new");
});

// Get route from the APP or the website
app.get("/cookbook/:id", function(req, res) {
    Cookbook.findById(req.params.id, function(err, data) {
        if (err) {
            console.log("Error while fetching the cookbook with id!!");
            res.send(err);
        } else {
            console.log("found cookbook:" + data);
            res.json(data);
        }
    });
});

// Creating new from the mobile app
app.post("/cookbook", function(req, res){
    var name = req.body.name;
    var category = req.body.category;
    var image = req.body.image;
    var aptFor = req.body.aptFor;
    var target = req.body.target;
    var foodContents = req.body.foodContents;
    var price = req.body.price;
    var newCookbookData = {
                    name: name,
                    category: category,
                    image: image,
                    aptFor: aptFor,
                    target: target,
                    foodContents: foodContents,
                    price: price
    };
    // Add the new things to database
    Cookbook.create(newCookbookData, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.json({ message: 'New Cookbook Data created!' });
        }
    });
});

// This is for getting the edit page where we get the database
app.get("/cookbook/:id/edit", function(req, res) {
        Cookbook.findById(req.params.id, function(err, foundCookbook){
            if(err) {
                res.send("Error in finding the data" + err);
            } else {
                res.render("edit", {cookbook: foundCookbook});
            }
        });
});


// This is for editing the cookbook database from the datapage
app.put("/cookbook/:id", function(req, res) {
    // console.log(req.);
    Cookbook.findById(req.params.id, function(err, foundCookbook) {

        if (err) {
            res.send(err);
        } else {
            foundCookbook.name = req.body.cookbook.name;
            foundCookbook.category = req.body.cookbook.category;
            foundCookbook.image = req.body.cookbook.image;
            foundCookbook.aptFor = req.body.cookbook.aptFor;
            foundCookbook.target = req.body.cookbook.target;
            foundCookbook.foodContents = req.body.cookbook.foodContents;
            foundCookbook.price = req.body.cookbook.price;
        }

        // save the bear
        foundCookbook.save(function(err) {
            if (err) {
                res.send(err);
            } else {
                res.json({ message: 'Cookbook Data updated!' });
            }
        });
    });
});

app.delete("/cookbook/:id", function(req, res){
    Cookbook.remove({_id: req.params.id}, function(err, bear) {
        if (err) {
            res.send(err);
        } else {
            res.json({ message: 'Cookbook Successfully deleted' });
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("App has been started!!!");
});