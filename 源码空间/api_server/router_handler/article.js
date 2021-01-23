// 导入数据库操作模块
const db = require('../db/mysql');
const ckarttype = require('../checkym/articletype');
// 导入path路径模块
const path = require('path');
const jwt = require('jsonwebtoken');
const config = require("../config")
// 获取文章分类列表的路由处理函数
module.exports.getArticleType = function (req, res) {
    const sql = 'SELECT * FROM ym_article_type WHERE ym_article_type.isDel=0 ORDER BY id ASC';
    db.query(sql, (err, results) => {
        if (err) {
            return res.ck(err);
        }
        res.send({
            status: 0,
            msg: '获取文章分类列表成功！',
            data: results
        });
    });
};

// 添加文章分类的路由处理函数
module.exports.addArticleType = (req, res) => {
    const valerr = ckarttype.validate(req.body, ckarttype.schema.addtype);
    if (valerr) {
        return res.ck(valerr);
    }
    const sqlgetarttype = 'SELECT * FROM ym_article_type WHERE ym_article_type.type=?';
    db.query(sqlgetarttype, req.body.type, (err, results) => {
        if (err) {
            return res.ck(err);
        }
        if (results.length === 1 && results[0].type === req.body.type) {
            if (results[0].isDel == 0) {
                return res.ck('该类型已存在！');
            }
            const updatearttype = 'UPDATE ym_article_type SET isDel=0 WHERE id=?';
            db.query(updatearttype, results[0].id, (err, results) => {
                if (err) {
                    return res.ck(err);
                }
                if (results.affectedRows !== 1) {
                    return res.ck('新增文章类型失败！请稍后再试');
                }
                return res.ck('新增文章类型成功！', 0);
            });
        } else {
            const sqladdtype = 'INSERT INTO ym_article_type SET ?';
            db.query(sqladdtype, req.body, (err, results) => {
                if (err) {
                    return res.ck(err);
                }
                if (results.affectedRows !== 1) {
                    return res.ck('新增文章类型失败！请稍后再试');
                }
                res.ck('新增文章类型成功！', 0);
            });
        }
    });
};

// 删除文章分类的路由处理函数
module.exports.delArticleType = (req, res) => {
    const err = ckarttype.validate(req.body, ckarttype.schema.deltype);
    if (err) {
        return res.ck(err);
    }
    const sql = 'UPDATE ym_article_type SET isDel=1 WHERE id=?';
    db.query(sql, req.body.id, (err, results) => {
        if (err) {
            return res.ck(err);
        }
        if (results.affectedRows !== 1) {
            return res.ck('删除文章分类失败！');
        }
        res.ck('删除文章分类成功！', 0);
    });
}

// 根据id获取文章分类的路由处理函数
module.exports.getArtTypebyId = (req, res) => {
    const sql = 'SELECT * FROM ym_article_type WHERE ym_article_type.id=?'
    db.query(sql, req.params.id, (err, results) => {
        if (err) {
            return res.ck(err);
        }
        if (results.length !== 1) {
            return res.ck('获取文章分类失败！');
        }
        res.send({
            status: 0,
            msg: '获取文章分类成功！',
            data: results[0]
        });
    });
};

// 根据id修改文章分类的路由处理函数
module.exports.updateArttype = (req, res) => {
    const err = ckarttype.validate(req.body, ckarttype.schema.updtype);
    if (err) {
        return res.ck(err);
    }
    const sql = 'SELECT * FROM ym_article_type WHERE ym_article_type.id=?';
    db.query(sql, req.body.id, (err, results) => {
        if (err) {
            return res.ck(err);
        }
        if (results.length !== 1) {
            return res.ck('该分类暂时无法修改！');
        } else {
            // 修改之前的该项的type数据
            const oldtype = results[0].type;
            // 检测修改的目标type是否已存在
            const sqlgetarttype = 'SELECT * FROM ym_article_type WHERE ym_article_type.type=?';
            db.query(sqlgetarttype, req.body.type, (err, results) => {
                if (err) {
                    return res.ck(err);
                }
                // 如果根据类型名称从数据库中查询到了该类型名称，则不能直接修改
                if (results.length === 1 && results[0].type === req.body.type) {
                    // 如果该文章分类的标记为未删除
                    if (results[0].isDel == 0) {
                        return res.ck('该文章分类已存在！');
                    } else if (results[0].isDel == 1) {
                        // 此时应该将这两条数据的type值进行更换
                        // 1.将results[0].id对应的数据Type设为''
                        const tid = results[0].id;
                        const sql1 = 'UPDATE ym_article_type SET type="" WHERE id=?'
                        db.query(sql1, results[0].id, (err, results) => {
                            if (err) {
                                return res.ck(err);
                            }
                            if (results.affectedRows !== 1) {
                                return res.ck('该分类修改失败！');
                            }
                            else {
                                const sql2 = 'UPDATE ym_article_type SET type=? WHERE id=?';
                                db.query(sql2, [req.body.type, req.body.id], (err, results) => {
                                    if (err) {
                                        return res.ck(err);
                                    }
                                    if (results.affectedRows !== 1) {
                                        return res.ck('该分类修改失败！');
                                    }
                                    else {
                                        const sql3 = 'UPDATE ym_article_type SET type=? WHERE id=?';
                                        db.query(sql3, [oldtype, tid], (err, results) => {
                                            if (err) {
                                                return res.ck(err);
                                            }
                                            if (results.affectedRows !== 1) {
                                                return res.ck('该分类修改失败！');
                                            }
                                            return res.ck('修改文章分类成功！', 0)
                                        });
                                    }
                                });
                            }
                        });
                        // 2.将req.body.type的值
                    }
                } else {
                    const sql = 'UPDATE ym_article_type SET type=? WHERE id=?';
                    db.query(sql, [req.body.type, req.body.id], (err, results) => {
                        if (err) {
                            return res.ck(err);
                        }
                        if (results.affectedRows !== 1) {
                            return res.ck('修改文章分类失败！');
                        }
                        return res.ck('修改文章分类成功！', 0);
                    });
                }
            });
        }
    });
};

// 发布文章的路由的处理函数
module.exports.addArticle = (req, res) => {
    if (!req.file || req.file.fieldname !== "conpicimage") {
        return res.ck('文章封面未选择');
    }
    const err = ckarttype.validate(req.body, ckarttype.schema.aritle);
    if (err) {
        return res.ck(err);
    }
    const articleinfor = {
        ...req.body,
        conpicimage: path.join('/uploads', req.file.filename),
        publishtime: new Date(),
        author_id: req.user.id
    };
    const sql = 'INSERT INTO ym_article SET ?';
    db.query(sql, articleinfor, (err, results) => {
        if (err) {
            return res.ck(err);
        }
        if (results.affectedRows !== 1) {
            return res.ck('发布文章失败！');
        }
        res.ck('发布文章成功！', 0);
    });
};

// 根据id查看自己所写的所有文章[登录状态]
module.exports.lookIDbook = (req, res) => {
    const sql = 'select * from ym_article  WHERE ym_article.isDel=0 AND author_id=?';
    db.query(sql, req.user.id, (err, results) => {
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

// 修改已写发布的文章的路由处理函数
module.exports.lookXGbook = (req, res) => {
    const err = ckarttype.validate(req.body, ckarttype.schema.aritle);
    if (err) {
        return res.ck(err);
    }
    var conpicimage = ''
    if (!req.file) {
        const sql1 = 'select  conpicimage from ym_article  WHERE id=?';
        db.query(sql1, req.query.id, (err, results) => {
            if (err) {
                return res.ck(err);
            }
            conpicimage = results[0].conpicimage
        });
    } else {
        conpicimage = path.join('/uploads', req.file.filename);
    }
    const articleinfor = {
        ...req.body,
        conpicimage: conpicimage,
        publishtime: new Date(),
        author_id: req.user.id
    };
    const sql = 'UPDATE ym_article SET ? WHERE id=?';
    db.query(sql, [articleinfor, req.query.id], (err, results) => {
        if (err) {
            return res.ck(err);
        }
        if (results.affectedRows !== 1) {
            return res.ck('修改文章失败！');
        }
        res.ck('修改文章成功！', 0);
    });
}

// 自己删除已发布的文章的路由处理函数
module.exports.lookDELbook = (req, res) => {
    const sql = 'UPDATE ym_article SET idDel=1 WHERE id=?';
    db.query(sql, req.query.id, (err, results) => {
        if (err) {
            return res.ck(err);
        }
        if (results.affectedRows !== 1) {
            return res.ck('删除文章失败！');
        }
        res.ck('删除文章成功！', 0);
    });
}

// 个人对文章发表评论的路由处理函数
module.exports.lookGRFBbook = (req, res) => {
    const err = ckarttype.validate(req.body, ckarttype.schema.plsc);
    if (err) {
        return res.ck(err);
    }
    const articleinfor = {
        ...req.body,
        ts_id: req.body.id,
        nowntime: new Date(),
        user_id: req.user.id
    };
    const sql = 'INSERT INTO ym_pl SET ?';
    db.query(sql, articleinfor, (err, results) => {
        if (err) {
            return res.ck(err);
        }
        if (results.affectedRows !== 1) {
            return res.ck('发布评论失败！');
        }
        res.ck('发布评论成功！', 0);
    });
}

// 删除文章中的评论的处理函数
module.exports.delALLpl = (req, res) => {
    const sql = 'UPDATE ym_pl SET idDel=1 WHERE id=?';
    db.query(sql, req.body.id, (err, results) => {
        if (err) {
            return res.ck(err);
        }
        if (results.affectedRows !== 1) {
            return res.ck('删除评论失败！');
        }
        res.ck('删除评论成功！', 0);
    });
}
