const querystring =  require("querystring");
const { set, get } = require("./src/db/redis");
const {access} = require("./src/utils/log")
const handleBlogRouter = require("./src/router/blog");
const handleUserRouter = require("./src/router/user");

const getCookieExpires = () => {
    const d = new Date();
    d.setTime(d.getTime() + (24*60*60*1000));
    return d.toGMTString();
}

const getPostData = (req) =>{
    const promise = new Promise((resolve, reject) => {
        if(req.method !== "POST"){
            resolve({});
            return;
        }
        if(req.headers["content-type"] !== "application/json"){
            resolve({});
            return;
        }
        let postData = "";
        req.on("data", chunk => {
            postData += chunk.toString();
        });
        req.on("end", () => {
            if(!postData){
                resolve({});
                return;
            }
            resolve(
                JSON.parse(postData)
            )
        });
    })
    return promise;
};

const serverHandle = (req, res) => {
    //紀錄access log
    access(`${req.method} -- ${req.url} -- ${req.headers["user-agent"]} -- ${Date.now()}`);

    //set return JSON file
    res.setHeader("Content-type", "application/json");

    //get path
    const url = req.url;
    req.path = url.split("?")[0];

    //parse query
    req.query = querystring.parse(url.split("?")[1]);

    //parse cookie
    req.cookie = {};
    const cookieStr = req.headers.cookie || "" //k1 = v1 ; k2 = v2 ; k3 = v3
    cookieStr.split(";").forEach(item => {
        if(!item){
            return;
        }
        const arr = item.split("=");
        const key = arr[0].trim();
        const val = arr[1].trim();
        req.cookie[key] = val;
        console.log(req.cookie);
    });
    
    //parse session
    let needSetCookie = false;
    let userId =req.cookie.userid;
    if(!userId){
        userId = `${Date.now()}_${Math.random()}`;
        needSetCookie = true;
    }
    if(!get(userId)){
        set(userId, null);
    } 
    req.sessionId = userId;
    get(req.sessionId).then((sessionData) => {
            if(!sessionData){
                req.session = {};
            }else{
                req.session = sessionData;
            }
            return getPostData(req);
        })
        .then((postData) => {
            //handle post data
            req.body = postData
            
            //handle blog router
            // const blogData = handleBlogRouter(req, res);
            // if(blogData){
            //     res.end(
            //         JSON.stringify(blogData)
            //     );
            //     return;
            // }
            const blogResult = handleBlogRouter(req, res);
            if(blogResult){
                blogResult.then(blogData => {
                    if(needSetCookie){
                        res.setHeader("Set-Cookie", `userid=${userId}; path=/;httpOnly;expires=${getCookieExpires()}`)
                    }
                    res.end(
                        JSON.stringify(blogData)
                    );
                });
                return;
            };
            
            

            //handle user router
            // const userData = handleUserRouter(req, res);
            // if(userData){
            //     res.end(
            //         JSON.stringify(userData)
            //     );
            //     return;
            // }

            const userResult = handleUserRouter(req, res);
            if(userResult){
                userResult.then(userData => {
                    if(needSetCookie){
                        res.setHeader("Set-Cookie", `userid=${userId}; path=/;httpOnly;expires=${getCookieExpires()}`)
                    }
                    res.end(
                        JSON.stringify(userData)
                    );
                });
                return;
            };

            res.writeHead(404, {"Conetent-type": "text/plain"});
            res.write("404 Not Found\n");
            res.end();
        });

}

module.exports = serverHandle;

//process.env.NODE_ENV