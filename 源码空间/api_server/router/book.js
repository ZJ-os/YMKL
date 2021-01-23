const express = require('express');
const router = express.Router();
const articleHandler = require('../router_handler/book');

// 全体文章列表展示的路由
router.get('/lookallbook', articleHandler.lookAllbook);

// 根据文章分类查看文章的路由
router.get('/lookflbook', articleHandler.lookFLbook);

// 根据自己的id查看自己所写的所有文章
router.get('/lookidbook', articleHandler.lookIDbook);

// 根据自己的id查看指定类型的自己所写的所有文章的路由
router.get('/lookidflbook', articleHandler.lookIDFLbook);

// 查看具体的文章内容
router.get('/looknrbook', articleHandler.lookNRbook);

// 根据查看的文章展示其对应的所有评论的路由处理函数
router.get('/lookallpl', articleHandler.lookALLpl);


module.exports = router;