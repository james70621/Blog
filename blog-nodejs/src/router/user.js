const {login} = require("../controller/user");
const {set} = require("../db/redis");
const {SuccessModel, ErrorModel} = require("../model/resModel");


const handleUserRouter = (req, res) =>{
    const {method, path} = req;

    if(method === "POST" && path === "/api/user/login"){
        const {username, password} = req.body;
        //const {username, password} = req.query;
        const result = login(username, password);
        return result.then(data => {
            if(data.username){
                req.session.username = data.username;
                req.session.realname = data.realname;
                set(req.sessionId, req.session);
                console.log("req.session is ", req.session);

                return new SuccessModel();
            }
            return new ErrorModel("login fail");
        })
    }


    // login chk
    // if(method === "GET" && req.path === "/api/user/login-test"){
    //     if(req.session.username){
    //         return Promise.resolve(new SuccessModel({
    //             session: req.session
    //         }));
    //     }
    //     return Promise.resolve(new ErrorModel("not login"));
    // }
}

module.exports = handleUserRouter;