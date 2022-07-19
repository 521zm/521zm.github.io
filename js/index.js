// page02 js效果
var tab_list = document.querySelector('.tab_list');
var lis = tab_list.querySelectorAll('li');
var items = document.querySelectorAll('.item');
for (var i = 0; i < lis.length; i++) {
    lis[i].setAttribute('index', i);
    lis[i].onclick = function () {
        for (var i = 0; i < lis.length; i++) {
            lis[i].className = '';
            lis[i].style.borderBottom ='none';
        }
        this.className = 'current';
        this.style.borderBottom = '2px solid #00e0ff';
        var index = this.getAttribute('index');
        for (var i = 0; i < items.length; i++) {
            items[i].style.display = 'none';
        }
        items[index].style.display = 'block';
    }
}
// 领养憨憨
const commemorate = document.querySelector('.commemorate')
const day = commemorate.querySelector('.day')
const firstday = commemorate.querySelector('.firstday')
firstday.innerHTML = '2019-11-26'
const inputTime = +new Date('2019-11-26 06:00:00');
function time(){
    const nowTime = +new Date();
    const times = (nowTime - inputTime) / 1000;
    const d = parseInt(times/60/60/24)
    day.innerHTML = d
}
time()
setInterval(time,1000)