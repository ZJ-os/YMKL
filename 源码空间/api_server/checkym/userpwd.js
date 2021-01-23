const joi = require('@hapi/joi');
// 做重置密码格式的验证规则
const schema = joi.object({
    // 使用upwd这个规则，验证req.body.oldpwd的值
    oldpwd: joi.string().min(6).max(18).required().error(new Error('密码为6-18位任意字符！')),
    // joi.ref('oldpwd'):代表newpwd的值必须和oldpwd的值保持一致
    // joi.not(joi.ref('oldpwd')):代表newpwd的值不能和oldpwd的值相同
    // concat():用户合并joi.not(joi.ref('oldpwd'))验证规则和
    newpwd: joi.string().min(6).max(18).required().error(new Error('密码为6-18位任意字符！')),
    aginpwd: joi.any().valid(joi.ref('newpwd')).error(new Error('重复密码和新密码不一致'))
});
// 做重置密码的判断的验证规则
const schemapwd = joi.object({
    oldpwd: joi.string().min(6).max(18).required().error(new Error('密码为6-18位任意字符！')),
    newpwd: joi.not(joi.ref('oldpwd')).error(new Error("新密码不能和旧密码相同！")),
    aginpwd: joi.any().valid(joi.ref('newpwd')).required().error(new Error('重复密码和新密码不一致'))
});
module.exports = function (data) {
    var {
        error,
        value
    } = schema.validate(data);
    if (error) {
        return error;
    }
    var { error, value } = schemapwd.validate(data);
    if (error) {
        return error;
    }
    return null;
};