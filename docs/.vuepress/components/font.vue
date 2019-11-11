<template>
    <font :color="color" :size='size' >
        <sort></sort>
    </font>
</template>
<script>
    export default{
        props:{
            color:{},
            size:{}
        }
    }
</script>