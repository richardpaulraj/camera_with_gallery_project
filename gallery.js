setTimeout(()=>{ // Because it takes little time to load all the videos so this is a small trick to acheive it
    if(db){

        //videos retrieval
 
    
        let videoDBTransaction = db.transaction('video', 'readonly') //it  returns a transaction object which contain my object store(ie. video,image)
        let videoStore = videoDBTransaction.objectStore('video')
        let videoRequest = videoStore.getAll() //this is event driven
        videoRequest.onsuccess = (e)=>{ //this will triger when it brings all the video
            let galleryCont = document.querySelector('.gallery-cont')
            let videoResult = videoRequest.result 
            // console.log(videoResult)
            videoResult.forEach((videoObj)=>{

                //Recreate this html code

                // <div class="media-cont">
                //     <div class="media">
                //         <video loop autoplay src="video.mp4"></video>
                //     </div>
                //     <div class="delete action-btn">DELETE</div>
                //     <div class="download action-btn">DOWNLOAD</div>
                // </div>

                let mediaElem = document.createElement('div')
                mediaElem.setAttribute('class', 'media-cont')
                mediaElem.setAttribute('id', videoObj.id)

                let url = URL.createObjectURL(videoObj.blobData) //used to create url


                mediaElem.innerHTML = `
                    <div class="media">
                         <video loop autoplay src='${url}'></video>
                    </div>
                    <div class="delete action-btn">DELETE</div>
                    <div class="download action-btn">DOWNLOAD</div>
                `
                
                galleryCont.appendChild(mediaElem)



                let deleteBtn = mediaElem.querySelector('.delete')
                let downloadBtn = mediaElem.querySelector('.download')

                deleteBtn.addEventListener('click', deleteListener)
                downloadBtn.addEventListener('click', downloadListener)

            })
        }   



        //images retrieval
        
        let imageDBTransaction = db.transaction('image', 'readonly') //it  returns a transaction object which contain my object store(ie. video,image)
        let imageStore = imageDBTransaction.objectStore('image')
        let imageRequest = imageStore.getAll() //this is event driven
        imageRequest.onsuccess = (e)=>{ //this will triger when it brings all the video
            let galleryCont = document.querySelector('.gallery-cont')
            let imageResult = imageRequest.result 
            // console.log(imageResult)
            imageResult.forEach((imageObj)=>{

                //Recreate this html code

                // <div class="media-cont">
                //     <div class="media">
                //         <video loop autoplay src="video.mp4"></video>
                //     </div>
                //     <div class="delete action-btn">DELETE</div>
                //     <div class="download action-btn">DOWNLOAD</div>
                // </div>

                let mediaElem = document.createElement('div')
                mediaElem.setAttribute('class', 'media-cont')
                mediaElem.setAttribute('id', imageObj.id)

                let url = imageObj.url // here we are not using URL.createObjectURL as we did for video because image already comes in url

                mediaElem.innerHTML = `
                    <div class="media">
                         <img src='${url}' />
                    </div>
                    <div class="delete action-btn">DELETE</div>
                    <div class="download action-btn">DOWNLOAD</div>
                `
                galleryCont.appendChild(mediaElem)




                let deleteBtn = mediaElem.querySelector('.delete')
                let downloadBtn = mediaElem.querySelector('.download')

                deleteBtn.addEventListener('click', deleteListener)
                downloadBtn.addEventListener('click', downloadListener)

            })
        }   



    }
}, 100)



// Task:
// 1) DB Remove
// 2) UI Remove

function deleteListener(e){

    //DB removal

    let id = e.target.parentElement.getAttribute('id') // here we are accessing the parent Elem because it has the id we needed

    //now we have to check wether its a video or image because previously we add img/vid before the id 
    let type = id.slice(0,3)
     if(type === 'vid'){

        //now to delete we have to go the objectStore  and there is a method called delete which requires that unique key to delete
        let videoDBTransaction = db.transaction('video', 'readwrite') //here we changed the permission to readwrite before it was only read for previous operations
        let videoStore = videoDBTransaction.objectStore('video')
        videoStore.delete(id)

    } 
    else if(type === 'img'){
        let imageDBTransaction = db.transaction('image', 'readwrite')
        let imageStore = imageDBTransaction.objectStore('image')
        imageStore.delete(id)
    }

    //UI Removal
    e.target.parentElement.remove()
}


function downloadListener(e){
    let id = e.target.parentElement.getAttribute('id')

    let type = id.slice(0,3)

    if(type === 'vid'){
        let videoDBTransaction = db.transaction('video', 'readwrite')
        let videoStore = videoDBTransaction.objectStore('video')
        let videoRequest = videoStore.get(id)
        videoRequest.onsuccess = ()=>{  //dont forget to put  =  after onsuccess I was behind this bug for long time
            let videoResult = videoRequest.result 
            
            //creating link
            let videoURL = URL.createObjectURL(videoResult.blobData)
            let a = document.createElement('a')
            a.href = videoURL
            a.download = 'video.mp4' //even here be careful sometimes I used to write a.download()
            a.click()

        }
    }
    else if(type === 'img'){
        let imageDBTransaction = db.transaction('image', 'readwrite')
        let imageStore = imageDBTransaction.objectStore('image')
        let imageRequest = imageStore.get(id)

        imageRequest.onsuccess = ()=>{
            let imageURL = imageRequest.result.url // here we dont need to make url it already gives us ready made url which u can even run in browsers
            let a = document.createElement('a')
            a.href = imageURL
            a.download = 'image.jpg'
            a.click()
        }


    }
}



