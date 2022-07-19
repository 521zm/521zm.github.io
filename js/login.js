var eye = document.getElementById('eye');
var pwd = document.getElementById('pwd');
var flag = 0;
eye.onclick = function () {
    if (flag == 0) {
        pwd.type = 'text';
        flag = 1;
        eye.className = 'iconfont icon-mima_xianshimima';
    } else {
        pwd.type = 'password';
        flag = 0;
        eye.className = 'iconfont icon-guanbi';
    }
}
