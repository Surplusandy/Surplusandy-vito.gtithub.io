const express = require('express');
const request = require('request');
const multer = require('multer');
const app = express();
const { OrderReceive,Order } = require('./db');
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(express.static(__dirname));




const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './file/image');
    },
    filename: (req, file, cb) => {
        let type = file.originalname.replace(/.+\./, '.');
        cb(null, Date.now() + type);
    }
})

const upload = multer({ storage: storage })
// app.get('/api/test', async (req, res) => {
//     res.send("success +++++100005465456456456!");
// })

// 申请接单
app.post('/addNewReceiver', async (req, res) => {
    try {
        await OrderReceive.create(req.body);
        res.send("success");
    } catch (error) {
        res.send("fail");
    }
})


// 上传文件
app.post("/uploadImg", upload.array('file', 10), (req, res) => {
    res.send(req.files);
})

// 获取需要审核的接单申请
app.get("/getOrderReceive", async (req, res) => {
    try {
      const result = await OrderReceive.find({
        state: "待审核",
      });
      res.send(result);
    } catch (error) {
      res.status(500).send({
        message: "服务器出错~~~",
      });
    }
  });

  // 审核用户的接单审核
app.post("/updateOrderReceive", async (req, res) => {
    try {
      const { _id, state, examinePerson } = req.body;
      await OrderReceive.findByIdAndUpdate(_id, {
        state,
        examinePerson,
      });
      res.send("success");
    } catch (error) {
      res.send("fail");
    }
  });


  // 获取当前用户的所有接单申请
app.get("/findAllReceive", async (req, res) => {
    try {
      const { openid } = req.query;
      const result = await OrderReceive.find({
        openid,
      });
      res.send(result);
    } catch (error) {
      res.status(500).send({
        message: "服务器出错~~~",
      });
    }
  });

  // 提交订单
app.post("/addOrder", async (req, res) => {
    try {
      await Order.create(req.body);
      res.send("success");
    } catch (error) {
      console.log(error);
      res.send("fail");
    }
  });

  // 获取全部订单
app.get("/getAllOrder", async (req, res) => {
    const result = await Order.find();
    res.send(result);
  });

  // 获取用户的接单权限
app.get("/getPersonPower", async (req, res) => {
    const { openid } = req.query;
    const result = await OrderReceive.find({
      openid,
      state: "通过",
    });
    res.send(result);
  });
  
  // 获取我的订单信息
  app.get("/getMyOrder", async (req, res) => {
    const { openid } = req.query;
    const result = await Order.find({
      openid,
    });
    res.send(result);
  });
  
  // 获取我帮助的订单信息
  app.get("/getMyHelpOrder", async (req, res) => {
    const { receivePerson } = req.query;
    const result = await Order.find({
      receivePerson,
      state: "已完成",
    });
    res.send(result);
  });
  
  // 获取我帮助的订单单数总和
  app.get("/getHelpTotalNum", async (req, res) => {
    const { receivePerson } = req.query;
    const result = await Order.countDocuments({
      receivePerson,
      state: "已完成",
    });
    res.send({
      count: result,
    });
  });
  
  // 获取我帮助的订单金额总和
  app.get("/getHelpTotalMoney", async (req, res) => {
    const { receivePerson } = req.query;
    const result = await Order.aggregate([
      {
        $match: {
          receivePerson,
          state: "已完成",
        },
      },
      {
        $group: {
          _id: "",
          totalNum: {
            $sum: "$money",
          },
        },
      },
    ]);
    console.log(result);
  
    res.send(result);
  });
  
// 给订单添加评论
app.post("/addComment", async (req, res) => {
    try {
      const { _id, nickName, avatarUrl, time, comment } = req.body;
      const order = await Order.findById(_id);
      const { commentList } = order;
      commentList.push({
        nickName,
        avatarUrl,
        time,
        comment
      });
      await Order.findByIdAndUpdate(_id, {
        commentList
      })
      res.send("success");
    } catch (error) {
      res.send("fail");
    }
  })


  // 接单功能
  app.get("/toGetOrder", async (req, res) => {
    try {
      const { _id, receivePerson } = req.query;
      await Order.findByIdAndUpdate(_id, {
        receivePerson,
        state: "已帮助",
      });
      res.send("success");
    } catch (error) {
      res.send("fail");
    }
  });
  
  // 完成订单
app.get("/toFinishOrder", async (req, res) => {
    try {
      const { _id, starNum } = req.query;
      const result =  await Order.findByIdAndUpdate(_id, {
        state: "已完成",
        starNum
      });
      const { receivePerson } = result;
      const receiveInfo = await OrderReceive.findOne({
        openid: receivePerson,
        state: "通过",
      });
  
      let { orderNumber, _id: receiveID } = receiveInfo;
  
      await OrderReceive.findByIdAndUpdate(receiveID, {
        orderNumber: orderNumber + 1,
      });
      res.send("success");
    } catch (error) {
      console.log(error);
      res.send("fail");
    }
  });
  
  // 获取正在悬赏的订单信息
  app.get("/getRewardOrder", async (req, res) => {
      const result = await Order.find({
          state: "待帮助"
      })
      res.send(result);
  })
  

// 登录
app.get("/login", (req, res) => {
    const { code } = req.query;
    request({
        url: `https://api.weixin.qq.com/sns/jscode2session?appid=自己的APPID&secret=自己的secret&js_code=${code}&grant_type=authorization_code`
    }, (err, response, data) => {
        res.send(data);
    })
})

app.listen(3000, () => {
    console.log('server running port 3000!');
})