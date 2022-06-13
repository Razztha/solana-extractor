<script setup>
import { toRefs, computed } from 'vue'
import { useWorkspace } from '@/composables'

const props = defineProps({
    tweet: Object,
})

const { tweet } = toRefs(props)
const { wallet } = useWorkspace()
const authorRoute = computed(() => {
    if (wallet.value && wallet.value.publicKey.toBase58() === tweet.value.author.toBase58()) {   
        return { name: 'Profile' }
    } else {
        return { name: 'Users', params: { author: tweet.value.author.toBase58() } }
    }
})

const loadVideo = (content) => {
    
    if (isJsonString(content)){
        var contentObj = JSON.parse(content.replace(/'/gi,''));
        return contentObj.uri;
    }
    else{
        return "";
    }  
}

const getLocation = (content) => {
    
    if (isJsonString(content)){
        var contentObj = JSON.parse(content.replace(/'/gi,''));
        console.log(contentObj);
        return "Location: "+ contentObj.latitude + ", " + contentObj.longitude +" ";
    }
    else{
        return "";
    }  
}

const getDataId = (content) => {
    
    if (isJsonString(content)){
        var contentObj = JSON.parse(content.replace(/'/gi,''));
        return contentObj.id;
    }
    else{
        return "";
    }  
}

const toggleDataDiplay = (id) => {
    if (id != null){
        var x = document.getElementById(id);
        if (window.getComputedStyle(x).display === "none") {
            document.getElementById(id).style.display = "block";
		    document.getElementById(id+"_btn").innerHTML = "Hide";
        }
        else{
            document.getElementById(id).style.display = "none";
		    document.getElementById(id+"_btn").innerHTML = "See More";
        }
    }
}

const isJsonString = (str) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
</script>

<template>
    <div class="px-8 py-4">
        <div>
            <h3 class="inline font-semibold" :title="tweet.author">
                <!-- TODO: Link to author page or the profile page if it's our own tweet. -->
                <router-link :to="authorRoute" class="hover:underline">
                    {{ tweet.author_display }}
                </router-link>
            </h3>
            <span class="text-gray-500"> • </span>
            <time class="text-gray-500 text-sm" :title="tweet.created_at">
                <!-- TODO: Link to the tweet page. -->
                <router-link :to="{ name: 'Home' }" class="hover:underline">
                    {{ tweet.created_ago }}
                </router-link>
            </time>
        </div>
        <div>
            <video controls preload="metadata">
                <source :src="loadVideo(tweet.content)" type="video/mp4">
            </video>
        </div>
        <p class="mt-1">{{getLocation(tweet.content)}}</p>
        <p class="mt-1">CreatedAt: {{tweet.created_at}}</p>
        <p class="mt-1">
            <button class="bg-pink-500 text-white active:bg-pink-600 font-bold text-xs px-4 py-2 rounded shadow hover:shadow-md mr-1 mb-1 ease-linear transition-all duration-150" :id="getDataId(tweet.content)+'_btn'" @click="toggleDataDiplay(getDataId(tweet.content))">See More</button>
        </p>
        <p :id="getDataId(tweet.content)" class="" style="word-break: break-all; display:none;" v-text="tweet.content"></p>
        <!-- TODO: Link to the topic page. -->
        <router-link v-if="tweet.topic" :to="{ name: 'Home' }" class="inline-block mt-2 text-pink-500 hover:underline">
            #{{ tweet.topic }}
        </router-link>
    </div>
</template>
