const express = require('express');
const router = express.Router();
const articleHandler = require('../router_handler/article');
// 导入multer模块
const multer = require('multer');
// 导入path路径模块
const path = require('path');
// 创建multer对象,dest属性:指定文件存放的路径地址
const upload = multer({ dest: path.join(__dirname, '../uploads') });

// 获取文章分类列表的路由
router.get('/arttype', articleHandler.getArticleType);

// 添加文章分类的路由
router.post('/addarttype', articleHandler.addArticleType);

// 删除文章分类的路由
router.post('/delarttype', articleHandler.delArticleType);

// 根据id获取文章分类的路由
router.get('/gettypebyid/:id', articleHandler.getArtTypebyId);

// 根据id修改文章分类的路由
router.post('/updatearttype', articleHandler.updateArttype);

// 发布文章的路由
router.post('/add', upload.single('conpicimage'), articleHandler.addArticle);

// 根据自己的id查看自己所写的所有文章
router.post('/lookidbook', articleHandler.lookIDbook);

// 修改已写发布的文章的路由处理函数
router.post('/lookxgbook', articleHandler.lookXGbook);

// 自己删除已发布的文章的路由处理函数
router.post('/lookdelbook', articleHandler.lookDELbook);

// 个人对文章发表评论的路由处理函数
router.post('/lookgrfbbook', articleHandler.lookGRFBbook);

// 个人删除自己的文章中的所有评论的处理函数
router.post('/delallpl', articleHandler.delALLpl);




module.exports = router;