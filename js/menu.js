let p =document.querySelector('#p');
let navtop = document.querySelector('.nav-top');
let menu = document.querySelector('.menu');
let flag = 0;
p.onclick = function(){
    if (flag == 0) {
         menu.style.backgroundColor = '#52616b';
         navtop.style.backgroundColor = '#52616b';
        flag = 1;
       }else{
        menu.style.backgroundColor = '#fff';
        navtop.style.backgroundColor = '#3fc1c9';
        flag = 0;
       }
}
document.addEventListener('contextmenu',function(e){
    menu.style.display = 'block';
    e.preventDefault();
    let x = e.pageX;
    let y =e.pageY;
    let Top = menu.offsetTop;
    let Left = menu.offsetLeft;
    let w = menu.offsetWidth;
    let h = menu.offsetHeight;
    menu.style.top = y+'px';
   menu.style.left = x+'px';
   if(window.innerHeight-y < h){
       menu.style.top = y - h + 'px';
   }
   if(y < h){
       menu.style.top = 0;
   }
   if(window.innerWidth-x < w){
    menu.style.left= innerWidth - w + 'px';
}
})
// menu.addEventListener('click',function(){
//     menu.style.display = 'block';
// })
document.addEventListener('click',function(e){
    menu.style.display = 'none';
    // e.preventDefault();
})  
let assign = document.querySelector('#assign');
let replace = document.querySelector('#replace');
let reload = document.querySelector('#reload');
let index =document.querySelector('#index');
assign.addEventListener('click',function(){
    location.assign();
})
replace.addEventListener('click',function(){
    location.replace();
})
reload.addEventListener('click',function(){
    location.reload();
})
index.addEventListener('click',function(){
    location.href = 'index.html';
})