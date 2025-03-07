const express = require("express");
const serverless = require("serverless-http");

const app = express();
app.use(express.json());

app.get("/api/temas", (req, res) => {
    res.json([
        { tema: "Família", versiculo: "Provérbios 22:6" },
        { tema: "Trabalho", versiculo: "Colossenses 3:23" },
        { tema: "Saúde", versiculo: "1 Coríntios 6:19" },
        { tema: "Finanças", versiculo: "Provérbios 22:7" }
    ]);
});

module.exports.handler = serverless(app);
