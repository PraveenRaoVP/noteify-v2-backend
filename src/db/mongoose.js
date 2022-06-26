const mongoose = require("mongoose");

const dbConnectURL = process.env.NOTEIFY_MONGODB_URL;

mongoose.connect(dbConnectURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


