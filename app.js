const express = require("express");
const mongoose = require("mongoose");
const app = express();
const date = require(__dirname + "/date.js");

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

const port = process.env.PORT || 3000;

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");

const itemsSchema = new mongoose.Schema({
    name: {
        type: String,
    },
});

const Item = new mongoose.model("Item", itemsSchema);

let addDefault = true;

const defaultItems = [
    {
        name: "Welkom bij jouw boodschappenlijstje!",
    },
    {
        name: "Klik op de + (rechtsonder) om iets aan de lijst toe te voegen.",
    },
    {
        name: "<-- Klik op het vakje om een boodschap te verwijderen",
    },
];

app.route("/")
    .get((req, res) => {
        Item.find({}, (err, foundItems) => {
            if (err) {
                console.log(err);
            } else {
                if (addDefault && foundItems.length === 0) {
                    Item.insertMany(defaultItems);
                    addDefault = false;
                    res.redirect("/");
                } else {
                    res.render("list", { listTitle: date.getDay(), listItems: foundItems });
                }
            }
        });
    })
    .post((req, res) => {
        const item = req.body.newItem;
        if (req.body.list === "Work") {
            workItems.push(item);
            res.redirect("/work");
        } else {
            const newItem = new Item({
                name: item,
            });

            newItem.save();

            res.redirect("/");
        }
    });

app.post("/delete", (req, res) => {
    const checkedItemId = req.body.checkbox;
    // Item.deleteOne({ _id: checkedItemId }, (err) => {});
    Item.findByIdAndRemove(checkedItemId, (err) => {
        if (!err) {
            console.log("Deleted: " + checkedItemId);
        }
    });
    res.redirect("/");
});

app.get("/work", (req, res) => {
    res.render("list", { listTitle: "Work List", listItems: workItems });
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
