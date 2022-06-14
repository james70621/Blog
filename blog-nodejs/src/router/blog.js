const {
    getList, 
    getDetail, 
    newBlog, 
    updataBlog,
    delBlog
} = require("../controller/blog");
const {SuccessModel, ErrorModel} = require("../model/resModel");

//chk if login
const loginCheck = (req) => {
    if(!req.session.username){
        return Promise.resolve(
            new ErrorModel("not login")
        );
    };
};

const handleBlogRouter = (req, res) => {
    const method = req.method;
    const id = req.query.id;

    if (method ==="GET" && req.path === "/api/blog/list"){
        let author = req.query.author || "";
        const keyword = req.query.keyword || "";
        // const listData = getList(author, keyword);
        // return new SuccessModel(listData)

        if(req.query.isadmin){
            const loginCheckResult = loginCheck(req)
            if(loginCheckResult){
                return loginCheckResult
            }
            author = req.session.username
        }

        const result = getList(author, keyword);
        return result.then(listData =>{
            return new SuccessModel(listData);
        });
    }

    if(method === "GET" && req.path === "/api/blog/detail"){
        // const data = getDetail(id);
        // return new SuccessModel(data);
        const result = getDetail(id);
        return result.then(data => {
            return new SuccessModel(data);
        });
    }
    
    if(method === "POST" && req.path === "/api/blog/new"){
        // const blogData = req.body;
        // const data = newBlog(blogData);
        // return new SuccessModel(data);

        const loginCheckResult = loginCheck(req);
        if(loginCheckResult){
            return loginCheckResult;
        }

        req.body.author = req.session.username;
        const result = newBlog(req.body);
        return result.then(data => {
            return new SuccessModel(data);
        });
        
    }

    if(method === "POST" && req.path === "/api/blog/update"){

        const loginCheckResult = loginCheck(req);
        if(loginCheckResult){
            return loginCheckResult;
        }

        const result = updataBlog(id, req.body);
        return result.then(val => {
            if(val){
                return new SuccessModel();
            }else{
                return new ErrorModel("update blog fail");
            }
        })
    }

    if(method === "POST" && req.path === "/api/blog/del"){

        const loginCheckResult = loginCheck(req);
        if(loginCheckResult){
            return loginCheckResult;
        }

        const author = req.session.username;
        const result = delBlog(id, author);
        return result.then(val => {
            if(result){
                return new SuccessModel();
            }else{
                return new ErrorModel("del blog fail");
            }
        });
    }
}

module.exports = handleBlogRouter;