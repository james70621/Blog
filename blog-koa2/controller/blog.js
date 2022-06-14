const xss = require("xss");
const {exec, escape} = require("../db/mysql")

const getList = async (author, keyword) => {
    author = escape(author);
    keyword = escape("%" + keyword + "%");
    
    let sql = `select * from blogs where 1=1 `
    if(author !== "''"){
        sql += `and author = ${author} `;
    }
    if(keyword  !== "'%%'"){
        sql += `and title like ${keyword} `;
    }
    sql += `order by createtime desc;`;

    return await exec(sql);
};

const getDetail = async (id) => {
    id = escape(id);

    const sql = `select * from blogs where id = ${id}`;
    const rows = await exec(sql);
    return rows[0];
};

const newBlog = async (blogData = {}) => {
    //blog data is an object, containing title, content, author
    const title = xss(escape(blogData.title));
    const content = xss(escape(blogData.content));
    const author = escape(blogData.author);
    const createTime = Date.now();

    const sql = `
        insert into blogs (title, content, createtime, author)
        values (${title}, ${content}, ${createTime}, ${author});
    `
    const insertData = await exec(sql);
    return {
        id:insertData.insertId
    }
};

const updataBlog = async (id, blogData = {}) => {
    const title = xss(escape(blogData.title));
    const content = xss(escape(blogData.content));
    id = escape(id);

    const sql = `
        update blogs set title=${title}, content=${content} 
        where id = ${id};
    `
    const updateData = await exec(sql);
    if(updateData.affectedRows > 0){
        return true;
    }
    return false;
};

const delBlog = async (id, author) => {
    id = escape(id);
    author = escape(author);

    const sql = `delete from blogs where id = ${id} and author = ${author};`;
    const delData = await exec(sql);
    if(delData.affectedRows > 0){
        return true;
    }
    return false;
}

module.exports = {
    getList, 
    getDetail,
    newBlog, 
    updataBlog, 
    delBlog
}