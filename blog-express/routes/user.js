const express = require('express');
const router = express.Router();
const {login} = require("../controller/user");
const {SuccessModel, ErrorModel} = require("../model/resModel");


router.post('/login', function(req, res, next) {
  const {username, password} = req.body;
  const result = login(username, password);
  return result.then(data => {
      if(data.username){
          req.session.username = data.username;
          req.session.realname = data.realname;

          res.json(
            new SuccessModel()
          );
          return;
      }
      res.json(
        new ErrorModel("login fail")
      );
  })
});

// router.get("/login-test", (req, res, next) => {
//   if(req.session.username){
//     res.json({
//       errno: 0,
//       msg: "login success"
//     })
//     return;
//   }
//   res.json({
//     errno: -1,
//     msg:"login fail"
//   })
// })

// //session測試
// router.get('/session-test', (req, res, next) => {
//   const session = req.session;
//   if(session.veiwNum == null){
//     session.veiwNum = 0;
//   }
//   session.veiwNum++;

//   res.json({
//     veiwNum:session.veiwNum
//   })
// })


module.exports = router;