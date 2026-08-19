<template>
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <section v-else class="launch-dates">
        <h1>Pending Launches: {{ pendingLaunches }}</h1>
        <LaunchDate v-for="launch in launches" :key="launch.id" :launch="launch"></LaunchDate>
        <div ref="sentinel" class="sentinel"></div>
        <div v-if="isLoadingMore">Loading...</div>
        <div v-if="loadingMoreError">{{loadingMoreError}}</div>
        
    </section>
    
</template>
<script setup>
import {ref, onMounted, onUnmounted, nextTick} from 'vue';
import LaunchDate from "./LaunchDate.vue";
const launches = ref([]);
const pendingLaunches = ref(0);
const isLoading = ref(true);
const isLoadingMore = ref(false)
const error = ref(null);
const loadingMoreError = ref(null);
const nextUrl = ref(null)
const sentinel = ref(null)
const baseURL = `${import.meta.env.VITE_API_BASE_URL}`;
let observer = null;
let cacheName = "LAUNCH_CACHE";
let cache = null;

async function fetchLaunches(url) {
    return caches.match(url).then( async (res)=>{
        if(res){
            if (!res.ok) throw new Error(`An error ocurred while fetching launch data ${res.status}: ${res.statusText}`);
            
            return res.json();
        }
        else{
            
            const networkRes = await fetch(url);
            if (!networkRes.ok){
                if(networkRes.status == 429){
                    throw new Error(`
                        You have unfortunately made too many API requests, try again later. 
                    `);
                }
                throw new Error(`An error ocurred while fetching launch data ${networkRes.status}: ${networkRes.statusText}`);
            } 
            const resClone = networkRes.clone();
            caches.open(cacheName).then((cache) => { cache.put(url, resClone); });
            return await networkRes.json();

        }
        

    })
    
    
    
}

async function loadMore() {
    if (!nextUrl.value || isLoadingMore.value) return

    isLoadingMore.value = true;
    try {
        const data = await fetchLaunches(nextUrl.value);
        launches.value = launches.value.concat(data.results);
        nextUrl.value = data.next;
    } catch (e) {
        loadingMoreError.value = e.message;
        isLoadingMore.value = false;
    } finally {
        isLoadingMore.value = false
    }
}
onMounted(async () =>{
    try {
        cache = await caches.open(cacheName);
        const data = await fetchLaunches(`${baseURL}/launches/upcoming/?mode=detailed&limit=25`);
        
        launches.value = data.results;
        pendingLaunches.value = data.count;
        nextUrl.value = data.next;
    } catch (e) {
        error.value = e.message;
    } finally {
        isLoading.value = false;
    }
    await nextTick();
    observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            loadMore();
        }
    }, { rootMargin: '1500px' })

    if (sentinel.value) {
        observer.observe(sentinel.value)
    }

})

onUnmounted(() => {
    if (observer) observer.disconnect()
})

</script>
<style>
.launch-dates{
    display: flex;
    flex-direction: column;
    align-self: center;
    gap: 2rem;
    
    
}

</style>