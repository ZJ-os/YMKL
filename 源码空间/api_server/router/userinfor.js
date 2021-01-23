const exprss = require('express');
// 创建路由对象
const router = exprss.Router();
const userHandler = require('../router_handler/userinfor');
// 创建获取用户信息的接口
router.get('/myinfor', userHandler.getinfor);
// 创建用户信息更改的接口
router.post('/updateuser', userHandler.updateuser);
// 创建密码重置的接口
router.post('/repwd', userHandler.repwd);
// 创建修改图像的接口
router.post('/avatar', userHandler.updateavatar);
// 验证验证码并且返回新的token值
router.post('/yzecode', userHandler.yzecode);
// 找回密码
router.post('/resetpwd', userHandler.resetpwd)
// 将路由对象共享出去
module.exports = router;