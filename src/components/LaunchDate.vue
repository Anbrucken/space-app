<template>
    <div class="info-container"  v-if="!countdown.past">


        
 
        <div class="header">{{ launch.launch_service_provider.name }}</div>  
        <div class="body">
            <div v-if="launch.image?.image_url" loading="lazy" class="launch-img"  alt="Image provided by the space agency. Likely a rocket" :style="{ backgroundImage: `url(${launch.image?.image_url})` }"></div>
            <div v-else class="launch-img"loading="lazy" :alt="`Logo of ${launch.launch_service_provider.name}`" :style="{ backgroundImage: `url(${launch.launch_service_provider.logo.image_url})` }"></div>        
            <div class="data-parent">
                <h2 class="launch-name">{{ launch.name }}</h2>
                <span class="vehicle-name">Vehicle: {{ launch.rocket.configuration.full_name }}</span> 
                <span class="launch-time">Date: {{ formatDate(launch.net) }}</span> 
                <span class="launch-location">Location: {{ launch.pad.name}}</span>
                <h2> T-{{ countdown.days }}d:{{ countdown.hours }}h:{{ countdown.minutes }}m:{{ countdown.seconds }}s</h2>
                <div class="stream-container">    
                    <a class="stream" v-for="url in launch.vid_urls" :href="url.url">
                        <component :is="getIcon(url.source)" />
                    </a>
                </div>
            </div>
       
        </div>


        
    </div>
</template>

<script setup>  
    import { ref, onMounted, onUnmounted, computed  } from 'vue'
    import IconYoutube from '~icons/mdi/youtube'
    import IconTwitter from '~icons/mdi/twitter'
    import IconTwitch from '~icons/mdi/twitch'
    import IconLink from '~icons/mdi/link'
    
    const iconMap = {
        'x.com': IconTwitter,
        'twitter.com': IconTwitter,
        'youtube.com': IconYoutube,
        'twitch.tv': IconTwitch,
    }

    const now = ref(new Date());
    let intervalID = null;

    onMounted(()=>{
        intervalID = setInterval(() => {
           now.value =new Date()
        }, 1000)
    });
    onUnmounted(() => {
        clearInterval(intervalID)
    })
    const props = defineProps({
        launch: {type: Object, required: true}
    })

    const countdown = computed(()=>{
        const target = new Date(props.launch.net)
        const diff = target.getTime() - now.value.getTime();
        if(diff <= 0){
            return{days:0, hours:0, minutes:0, seconds:0, past:true}
        }
        const totalSeconds = Math.floor(diff/1000);
        const days = Math.floor(totalSeconds / (24 * 60 * 60))
        const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60))
        const minutes = Math.floor((totalSeconds % (60 * 60)) / 60)
        const seconds = totalSeconds % 60

        return { days, hours, minutes, seconds, past: false }
    })
    
    

    function formatDate(iso) {
        return new Date(iso).toLocaleString("en-gb");
    }

    function getIcon(source) {
        return iconMap[source] || IconLink
    }

</script>

<style>
.info-container {
    height: 30vh;
    width: 70vw;
    min-height: 250px;
    min-width: 450px;
    max-width: 70vw;
    border-color:var(--accent-1);
    
    display: flex;
    justify-content: space-between;
    align-items: center;
    justify-self: center;
   
    border-radius: 5px;
    flex-direction: column;
    box-shadow: 0px 0px 50px -5px var(--bg-color-shade);
    
}
.logo-parent{
    height: 100%;
    max-width: 10%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px;
    box-sizing: border-box;
    
    border-style: solid;

}
.launch-img{
    height: 100%;
    width: 50%;
    background-size: cover;
    background-position: center;
    
}
.agency-logo {
    height: 100%;
    width: 100%;
    object-fit: contain;

}

.data-parent{
    width: 99%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.25rem; 
    align-items: center;
    box-shadow: 2px 2px 10px 2px var(--bg-color-shade)inset;
   
    
   
    

}
.header{
    background-color: var(--primary-bg-color);
    width: 100%;
}
.body{
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
    background-color: var(--primary-bg-color);
}

.stream{
    text-decoration: none;
    color: inherit;  
}
.stream:visited{
    color: inherit;  
}

.stream-container{
    display: flex;
    align-items: stretch;
    justify-content: space-evenly;
    width: 100%;
}
</style>