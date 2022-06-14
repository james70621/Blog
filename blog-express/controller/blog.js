const xss = require("xss");
const {exec, escape} = require("../db/mysql")

const getList = (author, keyword) => {
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

    return exec(sql);
};

const getDetail = (id) => {
    id = escape(id);

    const sql = `select * from blogs where id = ${id}`;
    return exec(sql).then(rows => {
        return rows[0];
    });
};

const newBlog = (blogData = {}) => {
    //blog data is an object, containing title, content, author
    const title = xss(escape(blogData.title));
    const content = xss(escape(blogData.content));
    const author = escape(blogData.author);
    const createTime = Date.now();

    const sql = `
        insert into blogs (title, content, createtime, author)
        values (${title}, ${content}, ${createTime}, ${author});
    `
    return exec(sql).then(insertData => {
        console.log("insertData is ", insertData);
        return {
            id: insertData.insertId
        }
    })

};

const updataBlog = (id, blogData = {}) => {
    const title = xss(escape(blogData.title));
    const content = xss(escape(blogData.content));
    id = escape(id);

    const sql = `
        update blogs set title=${title}, content=${content} 
        where id = ${id};
    `
    return exec(sql).then (updateData => {
        console.log("updateData is ", updateData);
        if(updateData.affectedRows > 0){
            return true;
        }
        return false;
    });

};

const delBlog = (id, author) => {
    id = escape(id);
    author = escape(author);

    const sql = `delete from blogs where id = ${id} and author = ${author};`;
    return exec(sql).then(delData => {
        console.log("updateData is ", delData);
        if(delData.affectedRows > 0){
            return true;
        }
        return false;
    });
}

module.exports = {
    getList, 
    getDetail,
    newBlog, 
    updataBlog, 
    delBlog
}