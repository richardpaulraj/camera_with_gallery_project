let video = document.querySelector('video')
let recordBtnCont = document.querySelector('.record-btn-cont')
let captureBtnCont = document.querySelector('.capture-btn-cont')

let filterColor = 'transparent'

//Flags
let recordFlag = false;

//To perform animation 
let recordBtn = document.querySelector('.record-btn')
let captureBtn = document.querySelector('.capture-btn')

let recorder;
let chunks = []; //Because Media data comes in small-small chunks

let constraints = {
    audio: true,
    video: true
}

// navigator is a global object which provides information about your browser

navigator.mediaDevices.getUserMedia(constraints)
 .then((stream)=>{
    video.srcObject = stream
    recorder = new MediaRecorder(stream) // Why I declared outside is because I wanted the recorder btn instances on click to start and stop so to get that value I declared it outside
    recorder.addEventListener('start',(e)=>{
        chunks = [] // Because it will also store the previous data so clearing it    
    })
    recorder.addEventListener('dataavailable', (e)=>{
        chunks.push(e.data)
    }) //There is list of Event Listners available check it out https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder in the Events Section
    recorder.addEventListener('stop',(e)=>{
        //Conversion of media chunks data to video
        let blob = new Blob(chunks, {type: 'video/mp4'})

        if(db){
            let videoID = shortid()
            let dbTransaction = db.transaction('video', 'readwrite') //here we have to add the name 'video' which is used to create and the second is option read or readwrite
            let videoStore = dbTransaction.objectStore('video')
            let videoEntry = {
                id: `vid-${videoID}`, // see the name 'id' should be same as the name which you have given in the keypath while creating objectStore
                blobData : blob
            }
            videoStore.add(videoEntry)
        }

        // let videoURL = URL.createObjectURL(blob) //Window provides a global URL Object
        // let a = document.createElement('a') //To download the Video
        // a.href = videoURL
        // a.download = 'stream.mp4' //The download attribute is used to specify that the target will be downloaded when a user clicks on the hyperlink
        // a.click()
    })
 })

recordBtnCont.addEventListener('click', (e)=>{
    if(!recorder) return; //The recorder is inside promise if this click triggers before actually getting the video then it will give undefined / error

    recordFlag = !recordFlag

    if(recordFlag){ //start recording

        recorder.start()
        startTimer()
        recordBtn.classList.add('scale-record')

    } else{ //stop recording

        recorder.stop()
        stopTimer()
        recordBtn.classList.remove('scale-record')

    }
})

captureBtnCont.addEventListener('click', (e)=>{

    captureBtn.classList.add('scale-capture')

    let canvas = document.createElement('canvas')

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    let tool = canvas.getContext('2d')
    tool.drawImage(video,0,0, video.videoWidth, video.videoHeight)

    //Filtering
    tool.fillStyle = filterColor
    tool.fillRect(0,0,canvas.width, canvas.height)

    let imageURL = canvas.toDataURL() //toDataURL() is to to convert img into URL i think

    if(db){
        let imageID = shortid()
        let dbTransaction = db.transaction('image', 'readwrite') 
        let imageStore = dbTransaction.objectStore('image')
        let imageEntry = {
            id: `img-${imageID}`, // see the name 'id' should be same as the name which you have given in the keypath while creating objectStore
            url: imageURL
        }
        imageStore.add(imageEntry)
    }

    //To download -- Method
    // let a = document.createElement('a')
    // a.href = imageURL
    // a.download = 'image.jpg'
    // a.click()

    setTimeout(()=>{
        captureBtn.classList.remove('scale-capture')
    },200) //In future you can change this and implement it only via css

})




let timerID;
let counter = 0; //Represents total seconds
let timer = document.querySelector('.timer')

function startTimer(){

    function displayTimer(){
        let totalSeconds = counter

        let hours = Number.parseInt(totalSeconds / 3600)
        totalSeconds = Number.parseInt(totalSeconds % 3600) //remaining value

        let minutes = Number.parseInt(totalSeconds / 60)
        totalSeconds = Number.parseInt(totalSeconds % 60)

        let seconds = totalSeconds


        //adding string 0 in front if its an single digit
        hours = hours < 10 ? `0${hours}` : hours
        minutes = minutes < 10 ? `0${minutes}` : minutes
        seconds = seconds < 10 ? `0${seconds}` : seconds

        timer.style.display = 'block' //Initially its hidden, now it should be visible

        timer.innerText = `${hours}:${minutes}:${seconds}`

        counter++

        // console.log({hours, minutes, seconds})

    }
    timerID = setInterval(displayTimer, 1000) //why I added timerID outside is because I also have to clearInterval in the stopTimer()
}

function stopTimer(){
    clearInterval(timerID);
    timer.innerText = '00:00:00'
    timer.style.display = 'none'
}

//Filtering Logic

let filterLayer = document.querySelector('.filter-layer');
let allFilter = document.querySelectorAll('.filter');

allFilter.forEach((filterElem)=>{
    filterElem.addEventListener('click',(e)=>{
        filterColor = window.getComputedStyle(filterElem).getPropertyValue('background-color') //to get the color
        filterLayer.style.backgroundColor = filterColor //to set the color 
    })
})


