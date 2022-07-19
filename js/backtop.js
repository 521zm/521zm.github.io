    const backtop = document.querySelector('.backtop');
    const a = backtop.children[0];
    const backtopTop = backtop.offsetTop;
    const fixTop = backtopTop - 200;
    document.addEventListener('scroll',function(){
        if(window.pageYOffset >= 200){
            backtop.style.position = 'fixed';
            backtop.style.top = fixTop + 'px';
        }else{
            backtop.style.position = 'absolute';
            backtop.style.top = 500 + 'px';
        }
        if(window.pageYOffset >= 600){
                   a.style.display = 'block';
        }else{
            a.style.display = 'none';
        }
    })
    const btn = document.querySelector('#btn');
    btn.addEventListener('click',function(){
            animate(window,0);
    })
    // 缓慢回到顶部效果
    function animate(obj, target, callback) {
        clearInterval(obj.timer);
        obj.timer = setInterval(function () {
            const step = (target - obj.pageYOffset) / 10;
            const step1 = step > 0 ? Math.ceil(step) : Math.floor(step);
            if (obj.pageYOffset == target) {
                clearInterval(obj.timer);
                if (callback) {
                    callback();
                }
                // callback && callback()
            }
            // obj.style.left = window.pageYOffset + step1 + 'px';
            obj.scroll(0,obj.pageYOffset + step1);
        }, 30)
    }