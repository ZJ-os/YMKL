$(function () {
    $(".link_reg").on("click", function () {
        $(".reg-box").show().siblings("div").hide();
    });
    $(".link_login").on("click", function () {
        $(".login-box").show().siblings("div").hide();
    });
    $(".link_find").on("click", function () {
        $(".findpwd-box").show().siblings("div").hide();
        code_draw();
    });
    var form = layui.form;
    form.verify({
        uid: [
            /^[a-zA-z\d]{6,11}$/,
            '账号必须为6-11位字母数字组合'
        ],
        upwd: [
            /^[\S]{6,18}$/, '密码必须6-18位，不能使用空格'
        ]
    });



    $("#canvas").on("click", function () {
        code_draw();
    });


    $(".btn-backLog").click(function (e) {
        $(".login-box").show().siblings("div").hide();
        $.each($(".fpwd-content .layui-form"), function (i, n) {
            n.reset();
        });
        nextnav(0);
        user = null;
    });


    // div参数是当前的表单，index是当前的表单索引。完成找回密码的表单切换
    function nextnav(index) {
        $(".fpwd-content>div").addClass("fpwd").eq(index).removeClass("fpwd");
        var liststrong = $(".layui-breadcrumb>strong");
        $.each(liststrong, function (i, n) {
            $(n).text($(n).text());
        });
        var nexttxt = $(liststrong[index]).text();
        $(liststrong[index]).html("<cite>" + nexttxt + "</cite>");
    }

    // 登录功能的实现
    $("#form-login").on("submit", function (e) {
        e.preventDefault();
        $.ajax({
            url: "/api/login",
            method: "POST",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.open({
                        title: '提示',
                        icon: 2,
                        content: res.msg
                    });
                }
                sessionStorage.setItem("usertoken", res.token);
                layer.open({
                    title: '注意',
                    content: '登录成功！'
                });
                location.href = "./index.html";
            }
        });
    });

    // 注册功能的实现
    $("#form-reg").on("submit", function (e) {
        e.preventDefault();
        $.post("/api/reguser", $(this).serialize(), function (res) {
            if (res.status !== 0) {
                return layer.open({
                    title: '提示',
                    icon: 2,
                    content: res.msg
                });
            }
            var layerindex = layer.open({
                title: '提示',
                content: res.msg + "请登录！",
                btn: ['确定', '取消'],
                icon: 1,
                yes: function () {
                    layer.close(layerindex);
                    $("#form-reg")[0].reset();
                    $(".link_login").click();
                },
                btn2: function () {
                    $("#form-reg")[0].reset();
                }
            });
        });
    });

    // 找回密码功能的实现
    var user = null;
    $("#form-fpwdid").on("submit", function (e) {
        e.preventDefault();
        // 将输入的内容转为大写，可通过这步进行大小写验证
        $.post("/api/getuser", $(this).serialize(), function (res) {
            if (res.status !== 0) {
                return layer.open({
                    title: '提示',
                    icon: 2,
                    content: res.msg
                });
            } else {
                user = res.data;
                var val = $(".codeval").val().toLowerCase();
                // 获取生成验证码值
                var num = $('#canvas').attr('data-code');
                if (val == '') {
                    return layer.open({
                        title: '提示',
                        icon: 2,
                        content: '请输入验证码！'
                    });
                } else if (val == num) {
                    $(".codeval").val('');
                    nextnav(1);
                } else {
                    $(".codeval").val('');
                    code_draw();
                    return layer.open({
                        title: '提示',
                        icon: 2,
                        content: '验证码错误，请重新输入！'
                    });
                }
            }
        });
    });

    // 处理获取邮箱验证码
    $(".btn-getemailcode").on("click", function () {
        console.log(user);
        // 先判断邮箱地址是否和账号中的邮箱对应
        if (!user) {
            layer.open({
                title: '提示',
                icon: 2,
                content: "请先输入您要找回的账号！"
            });
            return nextnav(0);
        }
        if (user[0].uemail != $("#idemail").val()) {
            console.log(user.uemail);
            return layer.open({
                title: '提示',
                icon: 2,
                content: "此邮箱并非账号绑定邮箱，请重新检查！"
            });
        }
        $.post("/api/getecode", { id: user[0].id, uemail: $("#idemail").val() }, (res) => {
            if (res.status !== 0) {
                return layer.open({
                    title: '提示',
                    icon: 2,
                    content: "邮箱接收验证码失败！请稍后再试！"
                });
            }
            layer.open({
                title: '提示',
                icon: 1,
                content: res.msg,
                time: 1000
            });
            window.sessionStorage.setItem("codetoken", res.token)
            var time = 60;
            $(this).addClass("layui-disabled").attr("disabled", "disabled");
            $(this).text(`${time}s`);
            var interval = setInterval(() => {
                time--;
                $(this).text(`${time}s`);
                if (time == 0) {
                    $(this).removeClass("layui-disabled").removeAttr("disabled");
                    $(this).text("获取邮箱验证码");
                    // 移除本地token值
                    if (sessionStorage.getItem("codetoken")) {
                        sessionStorage.removeItem("codetoken");
                    }
                    clearInterval(interval);
                }
            }, 1000);
        });
    });
    // 验证邮箱验证码
    $("#form-fpwdemail").on("submit", function (e) {
        e.preventDefault();
        if (!sessionStorage.getItem("codetoken")) {
            return layer.open({
                title: "提示",
                icon: 2,
                content: "邮箱动态码已失效,请重新获取邮箱动态码!"
            });
        }
        const url = '/my/yzecode';
        $.ajax({
            type: 'POST',
            url: url,
            data: $("#form-fpwdemail").serialize(),
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("codetoken") || ""}`
            },
            success: (res) => {
                if (res.status != 0) {
                    return layer.open({
                        title: "提示",
                        icon: 2,
                        content: res.msg
                    });
                } else {
                    // 邮箱动态码验证成功,在本地存储idtoken字符串
                    sessionStorage.setItem("idtoken", res.token);
                    // 将ecodetoken字符串销毁
                    if (sessionStorage.getItem("codetoken")) {
                        sessionStorage.removeItem("codetoken");
                    }
                    // 提示用户在10分钟之内完成修改密码操作
                    layer.open({
                        title: "提示",
                        icon: 3,
                        content: "请在10分钟之内完成重置密码!",
                        time: 2000,
                        end: () => {
                            // 切换找回密码样式
                            nextnav(2);
                            var i = 10 * 60;
                            // 创建计时器
                            var interval = setInterval(() => {
                                i--;
                                if (i == 0) {
                                    // 移除本地token字符串
                                    if (sessionStorage.getItem("idtoken")) {
                                        sessionStorage.removeItem("idtoken");
                                    }
                                    layer.open({
                                        title: "提示",
                                        icon: 2,
                                        content: "重置密码超时,请重新找回密码",
                                        time: 2000,
                                        end: () => {
                                            // 清空找回密码中的表单
                                            $.each($(".fpwd-content .layui-form"), (i, item) => {
                                                item.reset();
                                            });
                                            // 找回密码模块样式初始化
                                            cutStyle(0);
                                            user = null;
                                        }
                                    });
                                    clearInterval(interval);
                                }
                            }, 1000);
                        }
                    });
                }
            }
        });
    });

    $('#form-fpwdpwd').on('submit', function (e) {
        e.preventDefault();
        if (!sessionStorage.getItem("idtoken")) {
            return layer.open({
                title: "提示",
                icon: 2,
                content: "身份认证失败,请重新找回密码!",
                time: 2000,
                end: () => {
                    // 清空找回密码中的表单
                    $.each($(".fpwd-content .layui-form"), (i, item) => {
                        item.reset();
                    });
                    // 找回密码模块样式初始化
                    nextnav(0);
                    user = null;
                }
            });
        } else {
            const url = "/my/resetpwd";
            console.log("over");
            $.ajax({
                type: 'POST',
                url: url,
                data: $("#form-fpwdpwd").serialize(),
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("idtoken") || ""}`
                },
                success: (res) => {
                    if (res.status != 0) {
                        return layer.open({
                            title: "提示",
                            icon: 2,
                            content: res.msg
                        });
                    }
                    // 销毁token字符串
                    if (sessionStorage.getItem("idtoken")) {
                        sessionStorage.removeItem("idtoken");
                    }
                    nextnav(3);
                    layer.open({
                        title: "提示",
                        icon: 1,
                        content: res.msg,
                        time: 1000
                    });
                    $(".finalydiv>span").text(res.msg);
                }
            })
        }
    })
});   