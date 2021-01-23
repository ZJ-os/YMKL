// 导入数据库操作模块
const db = require('../db/mysql');
const ckarttype = require('../checkym/articletype');
// 导入path路径模块
const path = require('path');

// 文章列表展示的路由处理函数
module.exports.lookAllbook = (req, res) => {
    let reqys = req.query.id
    const sql = `select  * from ym_article  WHERE ym_article.isDel!=1 limit ${reqys}, 8`;
    db.query(sql, (err, results) => {
        if (err) {
            return res.ck(err);
        }
        res.send({
            status: 0,
            msg: '获取文章成功！',
            data: results
        });
    });
}

// 根据文章分类查看文章的路由的处理函数
module.exports.lookFLbook = (req, res) => {
    let sqlStr2 = "SELECT id,type FROM ym_article_type WHERE type='" + req.query.type + "'";
    db.query(sqlStr2, (err, results) => {
        if (err) {
            res.ck(err)
        } else {
            ws = results[0].id;
            const sql = 'select * from ym_article  WHERE ym_article.isDel = 0 AND type_id = ?';
            db.query(sql, ws, (err, results) => {
                if (err) {
                    return res.ck(err);
                }
                res.send({
                    status: 0,
                    msg: '获取文章成功！',
                    data: results
                });
            });
        }
    });
}

// 根据id查看自己所写的所有文章
module.exports.lookIDbook = (req, res) => {
    const sql = 'select * from ym_article  WHERE ym_article.isDel=0 AND author_id=?';
    db.query(sql, req.query.author_id, (err, results) => {
        if (err) {
            return res.ck(err);
        }
        res.send({
            status: 0,
            msg: '获取文章成功！',
            data: results
        });
    });
}

// 根据自己的id查看指定类型的自己所写的所有文章的路由的处理函数
module.exports.lookIDFLbook = (req, res) => {
    let sqlStr2 = "SELECT id,type FROM ym_article_type WHERE type='" + req.query.type + "'";
    db.query(sqlStr2, (err, results) => {
        if (err) {
            res.ck(err)
        } else {
            ws = results[0].id;
            const sql = 'select  * from ym_article  WHERE ym_article.isDel=0 AND type_id=? AND author_id=?';
            db.query(sql, [ws, req.query.id], (err, results) => {
                if (err) {
                    return res.ck(err);
                }
                res.send({
                    status: 0,
                    msg: '获取文章成功！',
                    data: results
                });
            });
        }
    });
}

// 查看具体的文章内容
module.exports.lookNRbook = (req, res) => {
    let sqlStr = "SELECT content FROM ym_article WHERE id=?";
    db.query(sqlStr, req.query.id, (err, results) => {
        if (err) {
            res.ck(err)
        } else {
            res.send({
                status: 0,
                msg: '获取文章内容成功！',
                data: results
            });
        }
    });
}

// 根据查看的文章展示其对应的所有评论的路由处理函数
module.exports.lookALLpl = (req, res) => {
    let reqys = req.query.id
    const sql = 'select  * from ym_pl WHERE ym_pl.isDel!=1 AND ts_id =? limit ?, 6';
    db.query(sql, [req.query.ts_id, reqys], (err, results) => {
        if (err) {
            return res.ck(err);
        }
        res.send({
            status: 0,
            msg: '获取图书评论列表成功！',
            data: results
        });
    });
}