const mongoose = require('mongoose');

const dbConnect = () => {
    main()
    .then(() => {
        console.log("Connected to DB");
    }).catch(err => console.log(err));

    async function main() {
        await mongoose.connect(process.env.MONGO_URL);
    }
}

module.exports = dbConnect;