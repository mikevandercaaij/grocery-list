const express = require("express");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

const port = process.env.PORT || 3000;

mongoose.connect("mongodb://admin:geheim@cluster0-shard-00-00.0544c.mongodb.net:27017,cluster0-shard-00-01.0544c.mongodb.net:27017,cluster0-shard-00-02.0544c.mongodb.net:27017/todolistDB?ssl=true&replicaSet=atlas-twc4ba-shard-0&authSource=admin&retryWrites=true&w=majority");

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

const listSchema = {
    name: String,
    items: [itemsSchema],
};

const List = mongoose.model("List", listSchema);

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
                    res.render("list", { listTitle: "Boodschappenlijst", listItems: foundItems });
                }
            }
        });
    })
    .post((req, res) => {
        const item = req.body.newItem;
        const listName = req.body.list;

        const newItem = new Item({
            name: item,
        });

        if (listName === "Boodschappenlijst") {
            newItem.save();
            res.redirect("/");
        } else {
            List.findOne({ name: listName }, (err, foundList) => {
                if (!err) {
                    foundList.items.push(newItem);
                    foundList.save();
                    res.redirect("/" + listName);
                } else {
                    console.log(err);
                }
            });
        }
    });

app.post("/delete", (req, res) => {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === "Boodschappenlijst") {
        Item.findByIdAndRemove(checkedItemId, (err) => {});
        res.redirect("/");
    } else {
        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } }, (err, result) => {
            if (!err) {
                res.redirect("/" + listName);
            }
        });
    }
});

app.get("/:customListName", (req, res) => {
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({ name: customListName }, (err, result) => {
        if (!err) {
            if (!result) {
                //Create a new list
                const list = new List({
                    name: customListName,
                    items: [],
                });

                list.save();

                res.redirect(`/${customListName}`);
            } else {
                //Show the existing list
                res.render("list", { listTitle: result.name, listItems: result.items });
            }
        }
    });
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
