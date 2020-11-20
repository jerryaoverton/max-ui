// load face recognition intelligence
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('static/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('static/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('static/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('static/models')
  ]).then(startVideo)

// establish a ui display
const video = document.getElementById('video');

// activate the web cam and stream it to the display
function startVideo(){
    navigator.getUserMedia(
        { video : {} },
        stream => video.srcObject = stream,
        err => console.error(err)
    )
}

// connect face recognition to the ui display
video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas)
    const displaySize = {width: video.width, height: video.height}
    faceapi.matchDimensions(canvas, displaySize)
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, 
            new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks
            ().withFaceExpressions()
            const resizedDetections = faceapi.resizeResults(detections, displaySize)
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
            faceapi.draw.drawDetections(canvas, resizedDetections)
            faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
            faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    }, 100)
})