<script setup>
    import { initiateRecorder, onBtnRecordClicked, onPauseResumeClicked, onBtnStopClicked } from '../assets/js/record.js';

	window.onload = function() {
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
			<button id="rec" @click="record()">Record</button>
			<button id="pauseRes" @click ="pause()">Pause</button>
			<button id="stop" @click ="stop()">Stop</button>
			//<button id="stateButton">trace state</button>
		</div>
		<button id="stopbtn" @click="stopbtnClick" class="text-white px-4 py-2 mb-2 rounded-full font-semibold bg-pink-500 mr-2" :disabled="! canRecord"
                    :class="canRecord ? 'bg-pink-500' : 'bg-pink-300 cursor-not-allowed'">
            Stop recording
        </button>
	</div>
	<a id="downloadLink" href></a>
</template>