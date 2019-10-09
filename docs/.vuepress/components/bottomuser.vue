<template>
    <div class="contributorBottom">
        <div class="word">主要贡献者: </div>
        <div class="contributors" >
            <div class="contributor" v-for="i in contributors">
                <div class="headimg">
                    <img :src="i.headimg || '/headimg.jpg'"  alt="">
                </div>
                <div class="name">
                    {{i.name}}
                </div>
                <a class="github" :href="i.github">github</a>
            </div>
        </div>
    </div>
   
</template>
<style>
    .contributorBottom{
        border: 1px 0 0 1px solid #eaecef;
        padding: 1.2rem 0;
        margin: 2.5rem 0;
    }
    .word{
        margin: 0;
        padding: 0;
    }
    .contributors{
        border: 1px 0 0 1px solid #eaecef;
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        align-content: stretch;
        justify-content: space-between;
        position: fixed;
    }
    .contributor{
        /* flex-grow: 1; */
        /* flex-basis: 30%; */
        /* max-width: 30%; */
        width: 4rem;
        height: 8rem;
        margin: 1rem;
        text-align: center;
    }
    .name{
        text-align: center;
        line-height: 1rem;
    }
    .headimg{
        width: 4rem;
        height: 4rem;
        border-radius: 100%;
        overflow: hidden;
    }
    .github{
        text-align: center
    }
    
</style>
<script>
    export default{
        props:{
            contributors: {}
        },
        mounted(){
         
        },
        data(){
            return{
            //    contributors: [
            //        {name: 'xq', headimg:''},
            //        {name: 'nz', headimg:''},
            //    ]
            }
        },
        components:{
        },
        updated(){
        },
        methods: {
         
        }
    }
</script>
