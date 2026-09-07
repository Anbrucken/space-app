<template>
    <div>    
        <span class="loading">{{loadingText }}</span>
    </div>
    
</template>

<script setup>
    import {ref, onMounted, onUnmounted, computed} from 'vue';
    
    let intervalID = null;
    const index = ref(0);
    const targetText = ref("Loading...");
    onMounted(()=>{
        intervalID = setInterval(() => {
        index.value = (index.value + 1)%(targetText.value.length+1);
        }, 150)
    });
    onUnmounted(() => {
        clearInterval(intervalID)
    });

    const loadingText = computed(()=>{
        
        return targetText.value.substring(0,index.value);

    })

</script>

<style>

</style>