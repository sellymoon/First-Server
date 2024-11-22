import express from "express";

const app = express();
app.listen(3000, () => {
    console.log("servidor escutando...");
});

app.get("/api", (req, res) => {
    res.status(200).send("boas vindas a imersão!");
});