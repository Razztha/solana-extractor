<script setup>
    import { initiateRecorder, onBtnRecordClicked, onPauseResumeClicked, onBtnStopClicked, chunks } from '../assets/js/record.js';
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
			console.log(dataObj);
			console.log(apiData);
			const tweet = await sendTweet('', "'"+JSON.stringify(apiData)+"'");
			//const tweet = await sendTweet('', 'works');
			emit('added', tweet)
		} else {
			return;
		}
	}

	const start = () => {
        initiateRecorder();
    }

    const record = () => {
		getLocation();
        onBtnRecordClicked();
    }

    const pause = () => {
        onPauseResumeClicked();
    }

	const stop = () => {
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
		dataObj.Latitude = geoData != null ? geoData.latitude : 0;
		dataObj.Longitude = geoData != null ? geoData.longitude : 0;
		// dataObj.Data = "";
		// dataObj.Id = createGuid();
		console.log(dataObj);
		
		axios.post(`https://solana-windows.empite.net/api/metadata/readfile/`, dataObj,
			{ headers: { "Content-Type": "application/json" } })
			.then(res => {
			console.log(res);
			console.log(res.data);
			apiData = res.data
		})
    	.catch(error => console.log(error));	
	}

	var options = {
	enableHighAccuracy: true,
	timeout: 5000,
	maximumAge: 0
	};

	const success = (pos) => {
	var crd = pos.coords;
	geoData = crd;
	console.log('Successfully determined a user position:', crd);
	}

	const error = (err) => {
	console.log(`ERROR(${err.code}): ${err.message}`);
	}

	const getLocation = () => {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(success, error, options);
	}
	}

	//const createGuid = () => {  
	//return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
	//	(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
	//);
	//} 
</script>

<template>
	<div class="px-8 py-4 border-b">
		<div style="border: 1px solid red; min-height:200px" class="mb-5">
            <video muted id="live" autoplay controls playsinline></video>
        </div>
		
		<div id="controls">
			<button id="start" @click="start" class="text-white px-4 py-2 mb-2 mt-2 rounded-full font-semibold bg-pink-500 mr-2" >
				Start
			</button>
			<button id="rec" @click="record" class="text-white px-4 py-2 mb-2 mt-2 rounded-full font-semibold bg-pink-500 mr-2" >
				Record
			</button>
			<button id="pauseRes" @click="pause" class="text-white px-4 py-2 mb-2 rounded-full font-semibold bg-pink-500 mr-2" >
            	Pause
        	</button>
			<button id="stop" @click="stop" class="text-white px-4 py-2 mb-2 rounded-full font-semibold bg-pink-500 mr-2" >
            	Stop
        	</button>
			<button id="stop" @click="saveMetadata" class="text-white px-4 py-2 mb-2 rounded-full font-semibold bg-pink-500 mr-2" >
            	Save to Solana
        	</button>
		</div>
	</div>
	<a id="downloadLink" href style="display:none"></a>
</template>