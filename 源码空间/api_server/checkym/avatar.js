const joi = require('@hapi/joi');
const schema = joi.object({
    avatar: joi.string().dataUri().required().error(new Error('请选择图像'))
});
module.exports = function (data) {
    var { error, value } = schema.validate(data);
    if (error) {
        return error;
    }
    return null;
};