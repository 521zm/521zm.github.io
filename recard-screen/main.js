$(function () {
  $('.selectAll').click(function () {
    $(this)
      .css('border', '1px solid #00bbf0')
      .siblings()
      .css('border', '1px solid');
    $(this).children('.p-style').css('backgroundColor', '#e6ffd2');
    $(this).siblings().children('.p-style').css('backgroundColor', '#eff0f1');
    $(this).children('.p-style').css('color', 'blue');
    $(this).siblings().children('.p-style').css('color', 'black');
  });
  let flag = true;
  let flag1 = true;
  $('#camera').click(function () {
    $(this).toggleClass('icon-shexiangtou_guanbi');
    $(this)
      .siblings()
      .text(
        $(this).siblings().text() == 'Integrated Camera' ?
        '禁用' :
        'Integrated Camera',
      );
    if (flag) {
      flag = false;
      $(this).css('backgroundColor', '#eff0f1');
    } else {
      flag = true;
      $(this).css('backgroundColor', '#e6ffd2');
    }
  });
  $('#audio').click(function () {
    $(this).toggleClass('icon-yuyin-guan2');
    $(this)
      .siblings()
      .text(
        $(this).siblings().text() == 'AMD Audio Device' ?
        '禁用' :
        'AMD Audio Device',
      );
    if (flag1) {
      flag1 = false;
      $(this).css('backgroundColor', '#eff0f1');
    } else {
      flag1 = true;
      $(this).css('backgroundColor', '#e6ffd2');
    }
  })
  const startRecard = document.querySelector('#startRecard')
  const video = document.querySelector('#video')
  const mask_three = document.querySelector('.mask-three')
  const three = document.querySelector('.three')
  startRecard.addEventListener('click', async function () {
    let stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    })
    let mediaRecorder = new MediaRecorder(stream);
    //三秒后启动
    setTimeout(() => {
      mediaRecorder.start()
    }, 3000);
    // 蒙版
    mask_three.className = 'mask-three-block'
    // three三秒倒计时
    let t = 2;
    let timer = setInterval(function () {
      three.innerHTML = t;
      t--;
      if (t < 0) {
        clearInterval(timer);
      }
    }, 1000)
    // 三秒后清空蒙版
    setTimeout(() => {
      mask_three.className = 'mask-three'
    }, 3000);
    //录制
    let chunks = [];
    mediaRecorder.addEventListener('dataavailable', function (e) {
      chunks.push(e.data)
    });
    //停止
    mediaRecorder.addEventListener('stop', function () {
      let blob = new Blob(chunks, {
        type: chunks[0].type,
      });
      let url = URL.createObjectURL(blob);
      let a = document.createElement('a');
      const name = "PIAOPIAO  " + new Date()
        .toISOString()
        .slice(0, 19)
        .replace('T', ' ')
        .replace(' ', '_')
        .replace(/:/g, '-')
      a.href = url
      a.download = `${name}.webm`
      video.src = url
      video.className = 'view'
      a.click()
      // window.URL.revokeObjectURL(url)

    })
  });
  document.body.addEventListener('click', function () {
    video.className = ''
  })
});