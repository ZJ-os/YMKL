// 每次只要使用jq中的ajax请求，不区分请求方式，在发起请求之前都会先调用这个函数
// 我们调用的ajax的参数全部以options参数的形式传入这个回调函数
$.ajaxPrefilter(function (options) {
    options.url = "http://127.0.0.1:8024" + options.url;
});