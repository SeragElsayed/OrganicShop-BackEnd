const mongoose = require("mongoose");
mongoose.set('useCreateIndex', true);

// const connectionUrl = "mongodb+srv://admin:123@ecommerceproject-5sa07.mongodb.net/ecomProject?retryWrites=true&w=majority"
// const connectionUrl = " mongodb://127.0.0.1:27017ecommerce"
// mongoose.connect(connectionUrl, { useNewUrlParser: true, useUnifiedTopology: true });

const url=" mongodb+srv://serag:serag123@serag-jmhxv.mongodb.net/shop?retryWrites=true&w=majority";

mongoose.connect(url,{useUnifiedTopology:true,useNewUrlParser:true})
.then(()=>{
    console.log('connected');

})
.catch("error")