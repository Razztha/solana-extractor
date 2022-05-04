<script setup>
    import { initiateRecorder, onBtnRecordClicked, onPauseResumeClicked, onBtnStopClicked } from '../assets/js/record.js';
	import "webrtc-adapter";

	const start = () => {
        initiateRecorder();
    }

    const record = () => {
        onBtnRecordClicked();
    }

    const pause = () => {
        onPauseResumeClicked();
    }

	const stop = () => {
        onBtnStopClicked();
    }
</script>

<template>
	<div>
		<video id="live" controls autoplay playsinline muted></video> 
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
		</div>
	</div>
	<a id="downloadLink" href></a>
</template>