const mongoose = require('mongoose');

const MONGODB_URL = "somestring"
// async await are same which wait an be use both
exports.connect = () => {
    mongoose.connect(MONGODB_URL , {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(console.log("DB is connected"))
    .catch((error) => {
        console.log("DB connecton failed");
        console.log(error);
        process.exit(1)
    })
}



