const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const graphqlHTTP = require("express-graphql");
const massive = require("massive");
const gqlConfigs = require("./graphqlConfigs");

massive(process.env.CONNECTION_STRING)
  .then(dbInstance => {
    exports.database = dbInstance;
    // dbInstance.init();
    console.log("Connected to the database");
  })
  .catch(error => console.log(error, "Massive Error"));

app.use(cors());
app.use(
  "/graphiql",
  graphqlHTTP({
    schema: gqlConfigs.schema,
    rootValue: gqlConfigs.root,
    graphiql: true
  })
);

const PORT = 4020;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
