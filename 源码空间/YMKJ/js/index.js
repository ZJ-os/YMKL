$(function () {
    $.ajax({
        type: "GET",
        url: "/my/myinfor",
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("usertoken") || ""}`
        },
        success: function (res) {
            if (res.status !== 0) {
                layer.open({
                    title: '提示',
                    icon: 2,
                    content: "用户登录信息无效，请重新登录！",
                    time: 2000,
                    end: function () {
                        location.href = "./login.html";
                    }
                });
            } else {
                $("#uname").text(res.data.uname);
            }
        }
    });

    $("#exit_link").on("click", function () {
        if (sessionStorage.getItem("usertoken")) {
            sessionStorage.removeItem("usertoken");
            location.href = "./login.html";
        }
    });
});