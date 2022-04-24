const express = require("express");
const app = express();
const date = require(__dirname + "/date.js");

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

const port = process.env.PORT || 3000;

const items = [];
const workItems = [];

app.route("/")
    .get((req, res) => {
        res.render("list", { listTitle: date.getDate(), listItems: items });
    })
    .post((req, res) => {
        const item = req.body.newItem;
        if (req.body.list === "Work") {
            workItems.push(item);
            res.redirect("/work");
        } else {
            items.push(item);
            res.redirect("/");
        }
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
