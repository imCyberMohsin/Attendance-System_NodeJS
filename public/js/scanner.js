//* Face Scanner Script

//! Getting the <video> element from the HTML
const video = document.querySelector("#video");
let attendanceData = [];      // for json file
let alreadyDisplayed = false;
let result;  // Variable to store the scanned name


//! Display API
// console.log(faceapi.nets);
//* ageGenderNet
//* faceExpressionNet
//* faceLandmark68Net
//* faceLandmark68TinyNet
//* faceRecognitionNet
//* ssdMobilenetv1
//* tinyFaceDetector
//* tinyYolov2

//! Using Promise
Promise.all([
  //? Loading required face-api.js models 
  faceapi.nets.ssdMobilenetv1.loadFromUri('../models'),
  // faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('../models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('../models'),
  // faceapi.nets.faceExpressionNet.loadFromUri('./models'),
  // console.log("All Models Loaded Successfully, Loading WebCam..."),
]).then(startWebcam);
//? Promise Opens webcam after all models are loaded
//* Tip: Check browser network tab for errors

//! Function to start the webcam
function startWebcam() {
  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: false,
    }).then((stream) => {
      video.srcObject = stream;       //* Set the webcam stream as the video source
      // console.log("Camera Working");
    }).catch((error) => {
      console.error(error);
    });
}



//! Function to load labeled face descriptions....Names, Landmarks, etc
// console.log("Now Loading FaceDescriptor...");
function getLabeledFaceDescriptions() {
  // Names of individuals from the 'labels' folder
  const labels = ["Messi", "Mohsin", "Saman", "Pranab Ghosh", "Sanjal Pal", "Majid Mallik"];

  // Promise to handle loading descriptions for each label
  return Promise.all(
    // Iterate over each label (individual)
    labels.map(async (label) => {
      const descriptions = [];

      // Iterate over each image for the current label (usually 2 images per individual)
      for (let i = 1; i <= 2; i++) {
        const image = await faceapi.fetchImage(`../labels/${label}/${i}.jpg`); // wait untill the images are loaded or accessed

        // Detect a single face with face landmarks and descriptors
        const detections = await faceapi
          .detectSingleFace(image)
          .withFaceLandmarks()
          .withFaceDescriptor();
        descriptions.push(detections.descriptor);   // Store the face descriptor
      }
      console.log("Labels Loaded");
      return new faceapi.LabeledFaceDescriptors(label, descriptions);   // Create labeled descriptors
    })
  );
}

//! Save attendance data to a JSON file
const saveAttendanceData = () => {
  const data = JSON.stringify(attendanceData, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Attendance-Sheet.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  // console.log('Attendance data saved!');
};

//! Function to send attendance data to the server and save it to MongoDB
const saveAttendanceToMongoDB = async () => {
  try {
    // console.log('Data to send:', attendanceData);

    const response = await fetch('/scanner', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attendanceData }),
    });

    if (response.ok) {
      console.log('Attendance data saved to MongoDB!');
      // You can optionally clear the local attendanceData array here if needed
      // attendanceData = [];
    } else {
      console.error('Failed to save attendance data to MongoDB');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

// Event listener for the "Download Attendance" button
const downloadBtn = document.querySelector('#downloadButton');
downloadBtn.addEventListener('click', () => {
  // saveAttendanceData(); // Save data to JSON file
  saveAttendanceToMongoDB(); // Save data to MongoDB
});

//! Event listener for when the video starts playing
video.addEventListener('play', async () => {
  const LabeledFaceDescriptors = await getLabeledFaceDescriptions();
  const faceMatcher = new faceapi.FaceMatcher(LabeledFaceDescriptors);

  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video)
      .withFaceLandmarks()
      .withFaceDescriptors();

    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

    resizedDetections.forEach((detection) => {
      const fullResult = faceMatcher.findBestMatch(detection.descriptor).toString();
      result = fullResult.substring(0, fullResult.indexOf('(')).trim();

      //* Show Face-Square for "unknown" faces. 
      const box = detection.detection.box;
      const drawBox = new faceapi.draw.DrawBox(box, { label: result, boxColor: 'red' });
      drawBox.draw(canvas);

      if (result !== 'unknown') {
        const box = detection.detection.box;
        const drawBox = new faceapi.draw.DrawBox(box, { label: result, boxColor: '#00a000' });
        drawBox.draw(canvas);

        let displayTimer;
        if (!attendanceData.find((entry) => entry.name === result)) {
          console.log("Scanned Name =", result);
          attendanceData.push({ name: result });

          if (!alreadyDisplayed) {
            const messageDiv = document.createElement('div');
            messageDiv.textContent = 'ATTENDANCE CAPTURED';
            messageDiv.classList.add('attendance-message');
            document.body.appendChild(messageDiv);
            alreadyDisplayed = true;

            // Automatically remove the message after 2 seconds
            displayTimer = setTimeout(() => {
              document.body.removeChild(messageDiv);
              alreadyDisplayed = false;
            }, 3000);
          }
        } else {
          if (!alreadyDisplayed) {
            const messageDiv = document.createElement('div');
            messageDiv.textContent = 'ATTENDANCE ALREADY CAPTURED';
            messageDiv.classList.add('attendance-message');
            document.body.appendChild(messageDiv);
            alreadyDisplayed = true;

            // Automatically remove the message after 2 seconds
            displayTimer = setTimeout(() => {
              document.body.removeChild(messageDiv);
              alreadyDisplayed = false;
            }, 6000);
          }
        }
      }
    });
  }, 500);   // Interval in milliseconds
});