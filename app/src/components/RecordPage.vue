<script setup>
    import { initiateRecorder, onBtnRecordClicked, onBtnStopClicked, chunks } from '../assets/js/record.js';
	import { geoData1 } from '../assets/js/geolocation.js';
	import "webrtc-adapter";
	import { sendTweet } from '@/api'
	//import { useWallet } from 'solana-wallets-vue'
	import { computed } from 'vue'
	import axios from 'axios';

	// Permissions.
	//const { connected } = useWallet()
	//const canRecord = computed(() => connected)
	const canSave = computed(() => chunks.length > 0 && apiData != null);

	const emit = defineEmits(['added']);
	const saveMetadata = async () => {
		if (! canSave.value) {
			document.getElementById("loader").innerHTML = "Recording not found";
			return;
		}

		document.getElementById("loader").innerHTML = "Saving to solana...";
		document.getElementById("loader").style.display = "block";
		console.log(apiData);
		console.log(dataObj);
		const tweet = await sendTweet('', "'"+JSON.stringify(apiData)+"'");
		//const tweet = await sendTweet('', 'works');
		emit('added', tweet);
		document.getElementById("rec").innerHTML = "RECORD";
		document.getElementById("loader").innerHTML = "Successfully saved to solana";
	}

	//const start = () => {
      //  initiateRecorder();
    //}

	var isRecord = true;
    const record = () => {
		if(isRecord){
			document.getElementById("loader").innerHTML = "";
			console.log(geoData1);
			isRecord = false;
			//initiateRecorder();		
			//getLocation();
			document.getElementById("record-icon").style.display = "inline";
			document.getElementById("rec").innerHTML = "PROOF";
			setTimeout(onBtnRecordClicked, 500);
		}
		else{
			stop();
		}
    }

    //const pause = () => {
      //  onPauseResumeClicked();
    //}

	let base64data = ""; 
	const stop = () => {

		if (confirm("Click Ok to continue..."+ "\r\n"+ "\r\n" +"1. It will upload recorded video and extract meta data"
		 + "\r\n" + "2. save data to solana blockchain ") == true) {
				//document.getElementById("rec").innerHTML = "RECORD";
				console.log(base64data);
		}
		else{
			document.getElementById("rec").innerHTML = "RECORD";
			isRecord = true;
			onBtnStopClicked();
			return;
		}

		//document.getElementById("rec").innerHTML = "RECORD";
		isRecord = true;	

		//document.getElementById("loader").innerHTML = "Loading...";
		//document.getElementById("loader").style.display = "block";
		document.getElementById("record-icon").style.display = "none";

        onBtnStopClicked();
		console.log(chunks);

		const blob = new Blob(chunks, {
        type: "video/mp4"
    	});

        var reader = new FileReader();
    	base64data = "";
    	reader.readAsDataURL(blob); 
    	reader.onloadend = function() {
        base64data = reader.result;
        testAPI(base64data);        
        }
    }

	const uploadAndExtractData = () => {
		console.log(chunks.length);
		if (chunks.length == 0) {
			alert("No record found");
			return;
		}
		if (confirm("Click Ok to upload recorded video and extract meta data") == true) {
			document.getElementById("loader").style.display = "block";
			testAPI(base64data);
		}
		else{
			return;
		}
		
	}

	var geoData = null;
	var dataObj = null;
	var apiData = null;
	const testAPI = (base64data) => {
		dataObj = {Id: "", Data: base64data, Latitude: 0, Longitude: 0, FileSize: '', 
		FileName: "test-record.mp4"};
		callAPI(dataObj);
	}

	const callAPI = (dataObj) => {
		console.log(geoData);
		dataObj.Latitude = geoData1 != null ? geoData1.latitude : 0;
		dataObj.Longitude = geoData1 != null ? geoData1.longitude : 0;
		// dataObj.Data = "";
		// dataObj.Id = createGuid();
		console.log(dataObj);
		document.getElementById("loader").style.display = "block";
		document.getElementById("loader").innerHTML = "Start uploading and extracting...";
		axios.post('https://solana-windows.empite.net/api/metadata/readfile', dataObj ,
		  { headers: { "Content-Type": "application/json" } }).then(function(data){    
			    console.log(data.data);
				apiData = data.data;
				console.log(apiData);
				//document.getElementById("loader").style.display = "none";
				document.getElementById("loader").innerHTML = "Completed upload and extract";
				setTimeout(saveMetadata, 2000);
			});
		
	}

</script>

<script>
	export default {
		mounted() {
			initiateRecorder();
			console.log("hit mounted");
    	}
	}
</script>

<template>
	<div class="border-b">
		<div id="video-content" style="min-height:200px" class="mb-2">
            <video muted id="live" autoplay controls playsinline class="m-auto"></video>
        </div>
		<div id="btn-content" class="grid grid-cols-3 gap-4" style="display:none;">
			<div class="text-center">
				<p class="ml-2">
				<span id="hour" class="font-bold">00</span> :
				<span id="min" class="font-bold">00</span> :
				<span id="sec" class="font-bold">00</span>
				<span id="record-icon" style="display:none"><i class="fa fa-circle ml-2" style="color:brown"></i></span>
				<span id="milisec" class="hidden">00</span>
				</p>
			</div>
			<div class="text-center">
				<button id="rec" @click="record" class="text-white px-4 py-2 mb-2 rounded-full font-semibold bg-pink-500 mr-2" >
					RECORD
				</button>
			</div>
			<div></div>
		</div>
		
		<div id="controls">
			<!--<button id="start" @click="start" class="text-white px-4 py-2 mb-2 mt-2 rounded-full font-semibold bg-pink-500 mr-2" >
				Start
			</button>-->
			
			<!--<button id="pauseRes" @click="pause" class="text-white px-4 py-2 mb-2 rounded-full font-semibold bg-pink-500 mr-2" >
            	Pause
        	</button>-->
			<button id="stop" @click="uploadAndExtractData" class="text-white px-4 py-2 mb-2 rounded-full font-semibold bg-pink-500 mr-2 hidden" >
            	Upload & Extract
        	</button>
			<button id="save-solana" @click="saveMetadata" class="text-white px-4 py-2 mb-2 rounded-full font-semibold bg-pink-500 mr-2 hidden" >
            	Save to Solana
        	</button>
			<p id="loader" class="text-center mb-4" style="display:none">Loading...</p>
		</div>
	</div>
	<a id="downloadLink" href style="display:none"></a>
</template>