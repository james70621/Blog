const router = require('koa-router')()
const {
  getList, 
  getDetail, 
  newBlog, 
  updataBlog,
  delBlog
} = require("../controller/blog");
const {SuccessModel, ErrorModel} = require("../model/resModel");
const loginCheck =require("../middleware/loginCheck")

router.prefix('/api/blog')

router.get('/list', async (ctx, next) => {
  let author = ctx.query.author || "";
  const keyword = ctx.query.keyword || "";

  if(ctx.query.isadmin){
      if(ctx.session.username == null){
          ctx.body = new ErrorModel("not login");
          return;
      }
      author = ctx.session.username;
  }
  const listData = await getList(author, keyword);
  ctx.body = new SuccessModel(listData);
})

router.get('/detail', async (ctx, next) => {
  const data = await getDetail(ctx.query.id);
  ctx.body = new SuccessModel(data);
})

router.post('/new', loginCheck, async (ctx, next) => {
  const {body} = ctx.request;
  body.author = ctx.session.username;
  const data = await newBlog(body);
  ctx.body = new SuccessModel(data);
})

router.post('/update', loginCheck, async (ctx, next) => {
  const val = await updataBlog(ctx.query.id, ctx.request.body);
  ctx.body = val ? new SuccessModel() : new ErrorModel("update blog fail");
})

router.post('/del', loginCheck, async (ctx, next) => {
  const author = ctx.session.username;
  const val = await delBlog(ctx.query.id, author);
  ctx.body = val ? new SuccessModel() : new ErrorModel("delete blog fail");
})


module.exports = router
