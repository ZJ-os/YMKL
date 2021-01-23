const joi = require('@hapi/joi');
// 做用户信息的验证规则
const schema = joi.object({
    id: joi.number().integer().min(1).required().error(new Error('用户信息暂时无法修改！')),
    uname: joi.string().required().error(new Error('输入用户名格式有误！')),
    uemail: joi.string().required().pattern(/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/).error(new Error('输入邮箱格式有误！')),
    ulogid: joi.string().alphanum().min(6).max(11).required().error(new Error('输入登录账号格式有误！')),
    unick: joi.string().max(16).error(new Error('用户昵称格式！'))
});
module.exports = function (data) {
    var { error, value } = schema.validate(data);
    if (error) {
        return error;
    }
    return null;
};