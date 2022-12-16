$(function () {
  // 录制模式
  $('.selectAll').click(function () {
    $(this).css('border', '1px solid #00bbf0').siblings().css('border', '1px solid')
    $(this).children('.p-style').css('backgroundColor', '#e6ffd2')
    $(this).siblings().children('.p-style').css('backgroundColor', '#eff0f1')
    $(this).children('.p-style').css('color', 'blue')
    $(this).siblings().children('.p-style').css('color', 'black')
  })
  // 录制设置
  let flag = true
  $('#camera').click(function () {
    $(this).toggleClass('icon-shexiangtou_guanbi');
    $(this).siblings().text(
      $(this).siblings().text() == 'Integrated Camera' ? '禁用' : 'Integrated Camera'
    )
    if (flag) {
      flag = false
      $(this).css('backgroundColor', '#eff0f1')
      personViewFunStop()
    } else {
      flag = true
      $(this).css('backgroundColor', '#e6ffd2')
      personViewFun()
    }
  })
  let flag1 = true
  $('#audio').click(function () {
    $(this).toggleClass('icon-yuyin-guan2');
    $(this).siblings().text(
      $(this).siblings().text() == 'AMD Audio Device' ? '禁用' : 'AMD Audio Device'
    )
    if (flag1) {
      flag1 = false
      $(this).css('backgroundColor', '#eff0f1')
    } else {
      flag1 = true
      $(this).css('backgroundColor', '#e6ffd2')
    }
  })
  // startRecard
  const startRecard = document.querySelector('#startRecard')
  const video = document.querySelector('#video')
  const mask_three = document.querySelector('.mask-three')
  const three = document.querySelector('.three')
  const stopRecard = document.querySelector('.stop')
  let mediaRecorder
  startRecard.addEventListener('click', async () => {
    // 获取视频流
    let videoStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true
    })
    // 获取音频流
    let audioStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    })
    // 将视频流与音频流合并实例化新的媒体流
    let tracks = []
    videoStream.getVideoTracks().forEach(t => tracks.push(t))
    audioStream.getAudioTracks().forEach(t => tracks.push(t))
    let stream = new MediaStream(tracks)
    mediaRecorder = new MediaRecorder(stream);
    //三秒后启动
    setTimeout(() => {
      mediaRecorder.start()
    }, 3000);
    // 蒙版
    mask_three.className = 'mask-three-block'
    // three三秒倒计时
    let t = 3;
    three.innerHTML = t;
    let timer = setInterval(function () {
      t--;
      if (t <= 0) {
        clearInterval(timer);
      }
      three.innerHTML = t;
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
    //停止录制视频
    mediaRecorder.addEventListener('stop', function () {
      this.stream.getTracks().forEach(track => track.stop())
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
      a.download = `${name}.mp4`
      video.src = url
      video.className = 'view'
      a.click()
      // window.URL.revokeObjectURL(url)
    })
  });
  // 停止录屏(音频与视频)
  stopRecard.addEventListener('click', () => {
    mediaRecorder.stop()
  })
  document.body.addEventListener('click', () => {
    video.className = ''
  })
  const clickPerson = document.querySelector('.select-container').querySelector('#person')
  const person_screen = document.querySelector('#person-screen')
  const screen = document.querySelector('#screen')
  const personView = document.querySelector('#personView')
  // 调用摄像头的方法
  let mediaRecorder1
  const personViewFun = async function () {
    let personStream = await navigator.mediaDevices.getUserMedia({
      video: true,
    })
    mediaRecorder1 = new MediaRecorder(personStream);
    personView.className = 'person'
    personView.srcObject = personStream
    mediaRecorder1.start()
    // let personData = []
    // mediaRecorder1.addEventListener('dataavailable', function (e) {
    //   personData.push(e.data)
    // });
    //停止录制人像
    mediaRecorder1.addEventListener('stop', function () {
      this.stream.getTracks().forEach(track => track.stop())
      // let blob = new Blob(personData, {
      //   type: personData[0].type,
      // });
      // let url = URL.createObjectURL(blob);
      // console.log(personView.src);
      // personView.src = url
    })
  }
  // 取消摄像头
  const personViewFunStop = function () {
    mediaRecorder1.stop()
    personView.className = 'person-none'
  }
  // personViewFun()
  clickPerson.addEventListener('click', () => {
    personViewFun()
  })
  person_screen.addEventListener('click', () => {
    personViewFun()
  })
  screen.addEventListener('click', () => {
    personViewFunStop()
  })
  // 摄像头默认打开
  clickPerson.click()
})