var currentIndex = 0
var audio = new Audio()
audio.autoplay = true
var musicList=[]




audio.ontimeupdate = function(){
    $('.musicbox .progress-now').style.width = audio.currentTime/audio.duration*100 + '%'
}
audio.onplay = function(){
    clock = setInterval(function(){
    var min = Math.floor(audio.currentTime/60)
    var sec = Math.floor(audio.currentTime%60)+''
    sec=sec.length===2?sec:'0'+sec
    $('.musicbox .time').innerText = min +':'+sec
    },1000)
}
audio.onpause = function(){
    clearInterval(clock)
}
audio.onended = function(){
    currentIndex =(musicList.length + (--currentIndex))%musicList.length
    loadMusic(musicList[currentIndex])
}

function $(selector){
    return document.querySelector(selector)
}
function $$(selector){
    return document.querySelectorAll(selector)
}
$('.musicbox .forward').onclick = function(){
    currentIndex =((++currentIndex)%musicList.length)
    loadMusic(musicList[currentIndex])
}

$('.musicbox .back').onclick = function(){
    currentIndex =(musicList.length + (--currentIndex))%musicList.length
    loadMusic(musicList[currentIndex])
}
$('.musicbox .bar').onclick= function(e){
   var percent = e.offsetX / parseInt(getComputedStyle(this).width)
   audio.currentTime = audio.duration * percent

}


function getMusicList(callback){
    var xhr = new XMLHttpRequest()
    xhr.open('GET','music.json',true)
    xhr.onload = function(){
            callback(JSON.parse(xhr.responseText))
    }
    xhr.onerror = function(){
        console.log('网络异常')
    }
    xhr.send()
}

getMusicList(function(list){
    musicList = list
    loadMusic(list[currentIndex])
    generateList(musicList)
 })

 function generateList(musicList){
     musicList.forEach(function(musicObj){
       var node = document.createElement('li')
       node.innerText = musicObj.auther + '-'+musicObj.title
       $('.musicbox .list').appendChild(node)
     })
 }


 $('.musicbox .list').onclick = function(e){
     console.log(e.target)
     if(e.target.tagName.toLowerCase()==='li'){
         for(var i=0;i<this.children.length;i++){
             if(this.children[i]==e.target){
                currentIndex = i
             }
         }
     }
    loadMusic(musicList[currentIndex])
 }


function loadMusic(musicObj){
    $('.musicbox .title').innerText = musicObj.title
    $('.musicbox .auther').innerText = musicObj.auther
    $('.cover').style.backgroundImage = 'url('+musicObj.img +')'
     audio.src = musicObj.src
}

$('.musicbox .play').onclick =function(){
    if(audio.paused){
        audio.play()
        this.querySelector('.fa').classList.remove('fa-play')
        this.querySelector('.fa').classList.add('fa-pause')
    }else{
        audio.pause() 
        this.querySelector('.fa').classList.add('fa-play')
        this.querySelector('.fa').classList.remove('fa-pause')
    }
}

