const mongoose = require("mongoose");

// 连接mongodb数据库
mongoose.connect("mongodb://localhost:27017/bilibiliRun")
.then(() => {
    console.log("数据库连接成功!");
})
.catch((err) => {
    console.log("数据库连接失败!", err);
})

const OrderReceiveSchema = new mongoose.Schema({
    openid: {
        type: String
    },
    name: {
        type: String
    },
    userID: {
        type: String
    },
    userIDImg: {
        type: String
    },
    userInfo: {
        type: Object
    },
    state: {
        type: String
    },
    time: {
        type: String
    },
    orderNumber: {
        type: Number,
        default: 0
    },
    examinePerson: {
        type: String,
        default: ''
    }
})

const OrderSchema = new mongoose.Schema({
    name: {
        type: String
    },
    time: {
        type: String
    },
    money: {
        type: Number
    },
    state: {
        type: String
    },
    address: {
        type: String
    },
    info: {
        type: Object
    },
    userInfo: {
        type: Object
    },
    phone: {
        type: String
    },
    receivePerson: {
        type: String,
        default: ''
    },
    commentList: {
        type: Array,
        default: []
    },
    starNum: {
        type: Number,
        default: 0
    }
})

const OrderReceive = mongoose.model("OrderReceive1", OrderReceiveSchema);
const Order = mongoose.model("Order", OrderSchema);


module.exports = {
    OrderReceive,
    Order
}
