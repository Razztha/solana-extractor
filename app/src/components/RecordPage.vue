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
	const canSave = computed(() => chunks.length > 0 && apiData != null)	

	const emit = defineEmits(['added']);
	const saveMetadata = async () => {
		if (! canSave.value) {
			alert("No record found");
			return;
		}

		if (confirm("This will cost some SOL. Press ok to continue") == true) {
			document.getElementById("loader").innerHTML = "Saving...";
			document.getElementById("loader").style.display = "block";
			console.log(dataObj);
			console.log(apiData);
			const tweet = await sendTweet('', "'"+JSON.stringify(apiData)+"'");
			document.getElementById("loader").style.display = "none";
			//const tweet = await sendTweet('', 'works');
			emit('added', tweet)
		} else {
			return;
		}
	}

	//const start = () => {
      //  initiateRecorder();
    //}

    const record = () => {
		console.log(geoData1);
		initiateRecorder();		
		//getLocation();
		document.getElementById("record-icon").style.display = "inline";
        setTimeout(onBtnRecordClicked, 100);
    }

    //const pause = () => {
      //  onPauseResumeClicked();
    //}

	const stop = () => {

		if (confirm("Click Ok to upload recorded video and extract meta data") == true) {
			// continue;
			}
		else{
			return;
		}	

		document.getElementById("loader").innerHTML = "Loading...";
		document.getElementById("loader").style.display = "block";
		document.getElementById("record-icon").style.display = "none";

        onBtnStopClicked();
		console.log(chunks);

		const blob = new Blob(chunks, {
        type: "video/mp4"
    	});

        var reader = new FileReader();
    	let base64data = "";
    	reader.readAsDataURL(blob); 
    	reader.onloadend = function() {
        base64data = reader.result;
        testAPI(base64data)          
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

		axios.post('https://solana-windows.empite.net/api/metadata/readfile', dataObj ,
		  { headers: { "Content-Type": "application/json" } }).then(function(data){    
			    console.log(data.data);
				apiData = data.data;
				console.log(apiData);
				document.getElementById("loader").style.display = "none";
			});
		
	}

</script>

<script>
	export default {
		mounted() {
			initiateRecorder();
    	}
	}
</script>

<template>
	<div class="px-8 py-4 border-b">
		<div style="border: 1px solid red; min-height:200px" class="mb-4">
            <video muted id="live" autoplay controls playsinline></video>
        </div>
		<p>
			<span id="hour">00</span> :
			<span id="min">00</span> :
			<span id="sec">00</span>
			<span id="record-icon" style="display:none"><i class="fa fa-circle ml-2" style="color:brown"></i></span>
			<span id="milisec" class="hidden">00</span>
		</p>
		<div id="controls">
			<!--<button id="start" @click="start" class="text-white px-4 py-2 mb-2 mt-2 rounded-full font-semibold bg-pink-500 mr-2" >
				Start
			</button>-->
			<button id="rec" @click="record" class="text-white px-4 py-2 mb-2 mt-2 rounded-full font-semibold bg-pink-500 mr-2" >
				Record
			</button>
			<!--<button id="pauseRes" @click="pause" class="text-white px-4 py-2 mb-2 rounded-full font-semibold bg-pink-500 mr-2" >
            	Pause
        	</button>-->
			<button id="stop" @click="stop" class="text-white px-4 py-2 mb-2 rounded-full font-semibold bg-pink-500 mr-2" >
            	Stop
        	</button>
			<button id="stop" @click="saveMetadata" class="text-white px-4 py-2 mb-2 rounded-full font-semibold bg-pink-500 mr-2" >
            	Save to Solana
        	</button>
			<p id="loader" style="display:none">Loading...</p>
		</div>
	</div>
	<a id="downloadLink" href style="display:none"></a>
</template>