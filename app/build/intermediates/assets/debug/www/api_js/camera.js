/* Copyright (c) 2012 Mobile Developer Solutions. All rights reserved.
 * This software is available under the MIT License:
 * The MIT License
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
 * and associated documentation files (the "Software"), to deal in the Software without restriction, 
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, 
 * sublicense, and/or sell copies of the Software, and to permit persons to whom the Software 
 * is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies 
 * or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE 
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, 
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

//website http://docs.phonegap.com/en/1.0.0/phonegap_camera_camera.md.html

// updated based on PhoneGap API
// 
var pictureSource;   // picture source
var destinationType; // sets the format of returned value 

// Wait for PhoneGap to connect with the device
document.addEventListener("deviceready",onDeviceReady,false);

// PhoneGap is ready to be used!
function onDeviceReady() {
    pictureSource=navigator.camera.PictureSourceType;
    destinationType=navigator.camera.DestinationType;
}  

// Based on PhoneGap API File
function onResolveLocalFileSuccess(fileEntry) {
    //console.log(fileEntry.name);
    //alert("From camera.js " + fileEntry.fullPath);
    //record the fullpath on the web so that jQuery can get it
    document.getElementById('note-image').innerHTML=fileEntry.fullPath;
}

function onResolveLocalFileError(fileEntry) {
    document.getElementById('note-image').innerHTML="";
}

// Called when a photo is successfully retrieved
function onPhotoDataSuccess(imageData) {
	// Uncomment to view the base64 encoded image data
    // console.log(imageData);
    // Get image handler
    var cameraImage = document.getElementById('cameraImage');
    // Unhide image elements
    cameraImage.style.display = 'block';
    cameraImage.style.visibility = 'visible';
    // Show the captured photo, the inline CSS rules are used to resize the image
    cameraImage.src = "data:image/jpeg;base64," + imageData;
}

//Called when a photo is successfully retrieved
function onPhotoURISuccess(imageURI) {
    // Uncomment to view the image file URI 
    console.log(imageURI);
    // Get image handle
    var cameraImage = document.getElementById('cameraImage');
    // Unhide image elements
    cameraImage.style.display = 'block';
    cameraImage.style.visibility = 'visible';
    // Show the captured photo, the inline CSS rules are used to resize the image
    cameraImage.src = imageURI;
    
    // Resolve the path for image
    window.resolveLocalFileSystemURI(imageURI, onResolveLocalFileSuccess, onError); 
}

/* take picture and retriever image location*/
function take_pic1() {
    navigator.camera.getPicture(onPhotoDataSuccess, function(ex) {
        //alert("Camera Error!");
    }, { quality : 30, destinationType: destinationType.DATA_URL });
    
}

function take_pic2() {
	//Once the photo is taken, the camera application closes and your application is restored
	pictureSource=navigator.camera.PictureSourceType.CAMERA;
    navigator.camera.getPicture(onPhotoURISuccess, function(ex) {
        //alert("Camera Error!");
    }, { quality : 30, destinationType: destinationType.FILE_URL });
}

function album_pic() {
	destinationType=Camera.PictureSourceType.PHOTOLIBRARY;
    navigator.camera.getPicture(onPhotoURISuccess, function(ex) {
            //alert("Camera Error!"); 
    }, { quality: 30, destinationType: destinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY});
}