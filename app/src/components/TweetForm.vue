<script setup>
import { computed, ref, toRefs } from 'vue'
import { useAutoresizeTextarea, useCountCharacterLimit, useSlug } from '@/composables'
import { sendTweet } from '@/api'
import { useWallet } from 'solana-wallets-vue'
//import axios from 'axios';

// Props.
const props = defineProps({
    forcedTopic: String,
})
const { forcedTopic } = toRefs(props)

// Form data.
const content = ref('')
const topic = ref('')
const slugTopic = useSlug(topic)
const effectiveTopic = computed(() => forcedTopic.value ?? slugTopic.value)

// Auto-resize the content's textarea.
const textarea = ref()
useAutoresizeTextarea(textarea)

// Character limit / count-down.
const characterLimit = useCountCharacterLimit(content, 280)
const characterLimitColour = computed(() => {
    if (characterLimit.value < 0) return 'text-red-500'
    if (characterLimit.value <= 10) return 'text-yellow-500'
    return 'text-gray-400'
})

// Permissions.
const { connected } = useWallet()
const canRecord = computed(() => connected)
const canTweet = computed(() => content.value && characterLimit.value > 0)
const canSave = computed(() => parts.length > 0 && dataObj != null)

// Actions.
const emit = defineEmits(['added'])
const send = async () => {
    if (! canTweet.value) return
    const tweet = await sendTweet(effectiveTopic.value, content.value)
    emit('added', tweet)
    topic.value = ''
    content.value = ''
}

const saveMetadata = async () => {
    if (! canSave.value) {
        alert("No record found");
        return;
    }

    if (confirm("This will cost 0.00001 SOL. Press ok to continue") == true) {
        const tweet = await sendTweet(effectiveTopic.value, "'"+JSON.stringify(dataObj)+"'");
        //const tweet = await sendTweet(effectiveTopic.value, 'works');
        emit('added', tweet)
        topic.value = ''
        content.value = ''
    } else {
        return;
    }
}

const parts = [];
let mediaRecorder = null;
let streamObj = null;
const recordbtnClick = async () => {
    getLocation();
    navigator.mediaDevices.getUserMedia({audio: true,
        video: {
            // facingMode: 'user' // front
            facingMode: 'environment'
        } 
    })
    .then(stream => {
    document.getElementById("video").srcObject = stream;
    document.getElementById("video").setAttribute("playsinline", true);
    mediaRecorder = new MediaRecorder(stream);
    streamObj = stream;
        mediaRecorder.start(1000);
        mediaRecorder.ondataavailable = function(e){
            parts.push(e.data);
        }
    });
}

const stopbtnClick = async () => {
    if (mediaRecorder == null){
        alert("No record found");
        return
    }
   
    mediaRecorder.stop();
    streamObj.getTracks().forEach( track => track.stop() );
    const blob = new Blob(parts, {
        type: "video/mp4"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "diplay:none";
    a.href = url;
    document.getElementById("video").src = '';

    var reader = new FileReader();
    let base64data = "";
    reader.readAsDataURL(blob); 
    reader.onloadend = function() {
        base64data = reader.result;
        var base64str = base64data.split(',')[1];
        //var decoded = atob(base64str);
        var decoded = btoa(unescape(encodeURIComponent(base64str)));
        console.log("changed");
        console.log("FileSize: " + Math.round(decoded.length/1024));
        testAPI(base64data);                
    }

    a.download = "test-record.mp4";
    a.click();
}

var geoData = null;
var dataObj = null;
const testAPI = (base64data) => {
    var base64str = base64data.split(',')[1];
    //var decoded = atob(base64str);
    var decoded = btoa(unescape(encodeURIComponent(base64str)));
    var measure = 'KB'
    var size = decoded.length/1024;

    if (size > 1024){
        size = size/1024;
        measure = 'MB';
    }

    if (size > 1024){
        size = size/1024;
        measure = 'GB';
    }

    size = Math.round(size).toString() + ' ' + measure;

    dataObj = {Id: "", Data: base64data, Latitude: "", Longitude: "", FileSize: size, FileName: "test-record.mp4"};
    callAPI(dataObj);
}
const callAPI = (dataObj) => {
    dataObj.Latitude = geoData != null ? geoData.latitude : "";
    dataObj.Longitude = geoData != null ? geoData.longitude : "";
    dataObj.Data = "";
    dataObj.Id = createGuid();
    console.log(dataObj);
    //axios.post('https://localhost:7193/api/metadata/readfile', dataObj ,
      //  { headers: { "Content-Type": "application/json" } }).then(function(data){    
        //    console.log(data);
        //});
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

const createGuid = () => {  
   return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
} 

</script>

<template>
    <div v-if="true" class="px-8 py-4 border-b">
        <div style="border: 1px solid red; min-height:200px" class="mb-5">
            <video muted id="video" autoplay></video>
        </div>
        <button id="recordbtn" @click="recordbtnClick" class="text-white px-4 py-2 mr-2 mb-2 rounded-full font-semibold bg-pink-500" :disabled="! canRecord"
                    :class="canRecord ? 'bg-pink-500' : 'bg-pink-300 cursor-not-allowed'">
            Start recording
        </button>
        <button id="stopbtn" @click="stopbtnClick" class="text-white px-4 py-2 mb-2 rounded-full font-semibold bg-pink-500 mr-2" :disabled="! canRecord"
                    :class="canRecord ? 'bg-pink-500' : 'bg-pink-300 cursor-not-allowed'">
            Stop recording
        </button>
        <button id="savebtn" class="text-white px-4 py-2 rounded-full font-semibold bg-pink-500 mr-2 mb-2" :disabled="! canRecord && !canSave"
                    :class="canRecord ? 'bg-pink-500' : 'bg-pink-300 cursor-not-allowed'" @click="saveMetadata">
            Save to Blockchain
        </button>
        <!-- Content field. -->
        <textarea
            ref="textarea"
            rows="1"
            class="text-xl w-full focus:outline-none resize-none mb-3 hidden"
            placeholder="What's happening?"
            v-model="content"
        ></textarea>

        <div class="flex flex-wrap items-center justify-between -m-2 hidden">

            <!-- Topic field. -->
            <div class="relative m-2 mr-4">
                <input
                    type="text"
                    placeholder="topic"
                    class="text-pink-500 rounded-full pl-10 pr-4 py-2 bg-gray-100"
                    :value="effectiveTopic"
                    :disabled="forcedTopic"
                    @input="topic = $event.target.value"
                >
                <div class="absolute left-0 inset-y-0 flex pl-3 pr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 m-auto" :class="effectiveTopic ? 'text-pink-500' : 'text-gray-400'" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9.243 3.03a1 1 0 01.727 1.213L9.53 6h2.94l.56-2.243a1 1 0 111.94.486L14.53 6H17a1 1 0 110 2h-2.97l-1 4H15a1 1 0 110 2h-2.47l-.56 2.242a1 1 0 11-1.94-.485L10.47 14H7.53l-.56 2.242a1 1 0 11-1.94-.485L5.47 14H3a1 1 0 110-2h2.97l1-4H5a1 1 0 110-2h2.47l.56-2.243a1 1 0 011.213-.727zM9.03 8l-1 4h2.938l1-4H9.031z" clip-rule="evenodd" />
                    </svg>
                </div>
            </div>
            <div class="flex items-center space-x-6 m-2 ml-auto">

                <!-- Character limit. -->
                <div :class="characterLimitColour">
                    {{ characterLimit }} left
                </div>

                <!-- Tweet button. -->
                <button
                    class="text-white px-4 py-2 rounded-full font-semibold" :disabled="! canTweet"
                    :class="canTweet ? 'bg-pink-500' : 'bg-pink-300 cursor-not-allowed'"
                    @click="send"
                >
                    Tweet
                </button>
            </div>
        </div>
    </div>

    <div v-else class="px-8 py-4 bg-gray-50 text-gray-500 text-center border-b">
        Connect your wallet to start recording...
    </div>
</template>
