
const mongoose = require("mongoose");



const connectDatabase = () => {
    // mongoose.connect("process.env.DB_URI",{useNewUrlParser:true,useUnifiedTopoplogy:true,useCreateIndex:true}).then(
    mongoose.connect('mongodb://localhost:27017/Ecommerce', { useNewUrlParser: true, useUnifiedTopoplogy:true}).then(
        (data) => {
            console.log(process.env.DB_URI);
            console.log(`Mongodb connected with server: ${data.connection.host}`);

        });
};

module.exports = connectDatabase


// const mongoose = require("mongoose");

// const connectDatabase = () => {
//   mongoose
//     .connect(process.env.DB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       useCreateIndex: true,
//     })
//     .then((data) => {
//       console.log(`Mongodb connected with server: ${data.connection.host}`);
//     });
// };

// module.exports = connectDatabase;
