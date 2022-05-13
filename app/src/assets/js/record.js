'use strict';

import {startTimer, stopTimer } from './timer.js';
import {getLocation } from './geolocation.js';

var constraints = {
	audio:true,
	video:{width:{min:640,ideal:screen.width * window.devicePixelRatio,max:640}, 
	facingMode: 'environment', height:{ min:480,ideal:screen.height * window.devicePixelRatio,max:480},
	framerate:60}};

// var playbackVideoElement = document.querySelector('#playback');
// var dataElement = document.querySelector('#data');
// var downloadLink = document.querySelector('a#downloadLink');

// playbackVideoElement.controls=false;

export var mediaRecorder;
export var chunks = [];
// var count = 0;
var localStream = null;
var soundMeter  = null;
var containerType = "video/mp4"; //defaults to webm but we switch to mp4 on Safari 14.0.2+

export const initiateRecorder = () => {
	console.log(window.devicePixelRatio);
	console.log(screen.height * window.devicePixelRatio);
	console.log(screen.width * window.devicePixelRatio);
    var liveVideoElement = document.querySelector('#live');
    liveVideoElement.controls = false;
    if (!navigator.mediaDevices.getUserMedia){
	alert('navigator.mediaDevices.getUserMedia not supported on your browser, use the latest version of Firefox or Chrome');
    }
    else{
	if (window.MediaRecorder == undefined) {
			alert('MediaRecorder not supported on your browser, use the latest version of Firefox or Chrome');
	}else{
		navigator.mediaDevices.getUserMedia(constraints)
			.then(function(stream) {
				localStream = stream;
                console.log(localStream);
				
				localStream.getTracks().forEach(function(track) {
					console.log(track.getSettings());
					if(track.kind == "audio"){
						track.onended = function(){
							 log("audio track.onended Audio track.readyState="+track.readyState+", track.muted=" + track.muted);
						}
					}
					if(track.kind == "video"){
						track.onended = function(){
							log("video track.onended Audio track.readyState="+track.readyState+", track.muted=" + track.muted);
						}
					}
				});
				
				liveVideoElement.srcObject = localStream;
				liveVideoElement.play();
				
				try {
					window.AudioContext = window.AudioContext || window.webkitAudioContext;
					window.audioContext = new AudioContext();
				  } catch (e) {
					log('Web Audio API not supported.');
				  }

				  soundMeter = window.soundMeter = new SoundMeter(window.audioContext);
				  soundMeter.connectToSource(localStream, function(e) {
					if (e) {
						log(e);
						return;
					}else{
					   /*setInterval(function() {
						  log(Math.round(soundMeter.instant.toFixed(2) * 100));
					  }, 100);*/
					}
				  });
				
			}).catch(function(err) {
				/* handle the error */
				log('navigator.getUserMedia error: '+err);
			});
	}
}
	getLocation();
}

function log(message){
	console.log(message)
}

// Meter class that generates a number correlated to audio volume.
// The meter class itself displays nothing, but it makes the
// instantaneous and time-decaying volumes available for inspection.
// It also reports on the fraction of samples that were at or near
// the top of the measurement range.
function SoundMeter(context) {
    this.context = context;
    this.instant = 0.0;
    this.slow = 0.0;
    this.clip = 0.0;
    this.script = context.createScriptProcessor(2048, 1, 1);
    var that = this;
    this.script.onaudioprocess = function(event) {
      var input = event.inputBuffer.getChannelData(0);
      var i;
      var sum = 0.0;
      var clipcount = 0;
      for (i = 0; i < input.length; ++i) {
        sum += input[i] * input[i];
        if (Math.abs(input[i]) > 0.99) {
          clipcount += 1;
        }
      }
      that.instant = Math.sqrt(sum / input.length);
      that.slow = 0.95 * that.slow + 0.05 * that.instant;
      that.clip = clipcount / input.length;
    };
  }
  
  SoundMeter.prototype.connectToSource = function(stream, callback) {
    console.log('SoundMeter connecting');
    try {
      this.mic = this.context.createMediaStreamSource(stream);
      this.mic.connect(this.script);
      // necessary to make sample run, but should not be.
      this.script.connect(this.context.destination);
      if (typeof callback !== 'undefined') {
        callback(null);
      }
    } catch (e) {
      console.error(e);
      if (typeof callback !== 'undefined') {
        callback(e);
      }
    }
  };
  SoundMeter.prototype.stop = function() {
    this.mic.disconnect();
    this.script.disconnect();
  };

//   export const onPauseResumeClicked = () => {
//     var pauseResBtn = document.querySelector('button#pauseRes');
//     var recBtn = document.querySelector('button#rec');
//     var stopBtn = document.querySelector('button#stop');

// 	if(pauseResBtn.textContent === "Pause"){
// 		pauseResBtn.textContent = "Resume";
// 		mediaRecorder.pause();
// 		stopBtn.disabled = true;
// 	}else{
// 		pauseResBtn.textContent = "Pause";
// 		mediaRecorder.resume();
// 		stopBtn.disabled = false;
// 	}
// 	recBtn.disabled = true;
// 	pauseResBtn.disabled = false;
// }

export const onBtnRecordClicked = () => {
    // var playbackVideoElement = document.querySelector('#playback');
    var downloadLink = document.querySelector('a#downloadLink');
    // var recBtn = document.querySelector('button#rec');
    // var pauseResBtn = document.querySelector('button#pauseRes');
    // var stopBtn = document.querySelector('button#stop');

	if (localStream == null) {
		alert('Could not get local stream from mic/camera');
	}else {
		// recBtn.disabled = true;
		// pauseResBtn.disabled = false;
		// stopBtn.disabled = false;

		chunks = [];

		/* use the stream */
		log('Start recording...');
		if (typeof MediaRecorder.isTypeSupported == 'function'){
			/*
				MediaRecorder.isTypeSupported is a function announced in https://developers.google.com/web/updates/2016/01/mediarecorder and later introduced in the MediaRecorder API spec http://www.w3.org/TR/mediastream-recording/
			*/
            var options = '';
			if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
			  options = {mimeType: 'video/webm;codecs=vp9'};
			} else if (MediaRecorder.isTypeSupported('video/webm;codecs=h264')) {
			  options = {mimeType: 'video/webm;codecs=h264'};
			} else  if (MediaRecorder.isTypeSupported('video/webm')) {
			  options = {mimeType: 'video/webm'};
			} else  if (MediaRecorder.isTypeSupported('video/mp4')) {
			  //Safari 14.0.2 has an EXPERIMENTAL version of MediaRecorder enabled by default
			  containerType = "video/mp4";
			  options = {mimeType: 'video/mp4'};
			}
			log('Using '+options.mimeType);
			mediaRecorder = new MediaRecorder(localStream, options);
		}else{
			log('isTypeSupported is not supported, using default codecs for browser');
			mediaRecorder = new MediaRecorder(localStream);
		}

		mediaRecorder.ondataavailable = function(e) {
			log('mediaRecorder.ondataavailable, e.data.size='+e.data.size);
			if (e.data && e.data.size > 0) {
				chunks.push(e.data);
			}
		};

		mediaRecorder.onerror = function(e){
			log('mediaRecorder.onerror: ' + e);
		};

		mediaRecorder.onstart = function(){
			startTimer(0);
			log('mediaRecorder.onstart, mediaRecorder.state = ' + mediaRecorder.state);
			
			localStream.getTracks().forEach(function(track) {
              if(track.kind == "audio"){
                log("onstart - Audio track.readyState="+track.readyState+", track.muted=" + track.muted);
              }
              if(track.kind == "video"){
                log("onstart - Video track.readyState="+track.readyState+", track.muted=" + track.muted);
              }
            });
		};

		mediaRecorder.onstop = function(){
			log('mediaRecorder.onstop, mediaRecorder.state = ' + mediaRecorder.state);

			//var recording = new Blob(chunks, {type: containerType});
			var recording = new Blob(chunks, {type: mediaRecorder.mimeType});
			

			downloadLink.href = URL.createObjectURL(recording);

			/* 
				srcObject code from https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/srcObject
			*/

			/*if ('srcObject' in playbackVideoElement) {
			  try {
			    playbackVideoElement.srcObject = recording;
			  } catch (err) {
			    if (err.name != "TypeError") {
			      throw err;
			    }*/
			    // Even if they do, they may only support MediaStream
			    // playbackVideoElement.src = URL.createObjectURL(recording);
			/*  }
			} else {
			  playbackVideoElement.src = URL.createObjectURL(recording);
			} */

			// playbackVideoElement.controls = true;
			// playbackVideoElement.play();

			var rand =  Math.floor((Math.random() * 10000000));
            var name = '';
			switch(containerType){
				case "video/mp4":
					name  = "video_"+rand+".mp4" ;
					break;
				default:
					name  = "video_"+rand+".webm" ;
			}

			downloadLink.innerHTML = 'Download '+name;

			downloadLink.setAttribute( "download", name);
			downloadLink.setAttribute( "name", name);
			// downloadLink.click();
		};

		mediaRecorder.onpause = function(){
			log('mediaRecorder.onpause, mediaRecorder.state = ' + mediaRecorder.state);
		}

		mediaRecorder.onresume = function(){
			log('mediaRecorder.onresume, mediaRecorder.state = ' + mediaRecorder.state);
		}

		mediaRecorder.onwarning = function(e){
			log('mediaRecorder.onwarning: ' + e);
		};

		// pauseResBtn.textContent = "Pause";
		console.log(mediaRecorder);
		mediaRecorder.start(1000);

		localStream.getTracks().forEach(function(track) {
			log(track.kind+":"+JSON.stringify(track.getSettings()));
			console.log(track.getSettings());
		})
	}
}
  
export const onBtnStopClicked = () => {
	stopTimer();
	// var recBtn = document.querySelector('button#rec');
    // var pauseResBtn = document.querySelector('button#pauseRes');
    // var stopBtn = document.querySelector('button#stop');

	if (mediaRecorder != null){
		mediaRecorder.stop();
	}
	
	// close camera window
	//localStream.getTracks().forEach( track => track.stop() );
	// document.getElementById("live").src = '';

	// recBtn.disabled = false;
	// pauseResBtn.disabled = true;
	// stopBtn.disabled = true;
}

  //browser ID
//   function getBrowser(){
//       var nVer = navigator.appVersion;
//       var nAgt = navigator.userAgent;
//       var browserName  = navigator.appName;
//       var fullVersion  = ''+parseFloat(navigator.appVersion);
//       var majorVersion = parseInt(navigator.appVersion,10);
//       var nameOffset,verOffset,ix;
  
//       // In Opera, the true version is after "Opera" or after "Version"
//       if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
//        browserName = "Opera";
//        fullVersion = nAgt.substring(verOffset+6);
//        if ((verOffset=nAgt.indexOf("Version"))!=-1)
//          fullVersion = nAgt.substring(verOffset+8);
//       }
//       // In MSIE, the true version is after "MSIE" in userAgent
//       else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
//        browserName = "Microsoft Internet Explorer";
//        fullVersion = nAgt.substring(verOffset+5);
//       }
//       // In Chrome, the true version is after "Chrome"
//       else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
//        browserName = "Chrome";
//        fullVersion = nAgt.substring(verOffset+7);
//       }
//       // In Safari, the true version is after "Safari" or after "Version"
//       else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
//        browserName = "Safari";
//        fullVersion = nAgt.substring(verOffset+7);
//        if ((verOffset=nAgt.indexOf("Version"))!=-1)
//          fullVersion = nAgt.substring(verOffset+8);
//       }
//       // In Firefox, the true version is after "Firefox"
//       else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
//        browserName = "Firefox";
//        fullVersion = nAgt.substring(verOffset+8);
//       }
//       // In most other browsers, "name/version" is at the end of userAgent
//       else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) <
//              (verOffset=nAgt.lastIndexOf('/')) )
//       {
//        browserName = nAgt.substring(nameOffset,verOffset);
//        fullVersion = nAgt.substring(verOffset+1);
//        if (browserName.toLowerCase()==browserName.toUpperCase()) {
//         browserName = navigator.appName;
//        }
//       }
//       // trim the fullVersion string at semicolon/space if present
//       if ((ix=fullVersion.indexOf(";"))!=-1)
//          fullVersion=fullVersion.substring(0,ix);
//       if ((ix=fullVersion.indexOf(" "))!=-1)
//          fullVersion=fullVersion.substring(0,ix);
  
//       majorVersion = parseInt(''+fullVersion,10);
//       if (isNaN(majorVersion)) {
//        fullVersion  = ''+parseFloat(navigator.appVersion);
//        majorVersion = parseInt(navigator.appVersion,10);
//       }
  
  
//       return browserName;
//   }

export const getData = async() => {

    const response = await fetch('https://api.coindesk.com/v1/bpi/currentprice.json');
    return await response.json();
}

