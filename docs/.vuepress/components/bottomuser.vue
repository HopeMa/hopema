<template>
    <div class="contributorBottom">
        <div class="cb-word">主要贡献者: </div>
        <div class="cb-contributors" >
            <div class="cb-contributor" v-for="i in contributors">
                <div class="cb-headimg">
                    <img :src="i.headimg || $withBase('/headimg.jpg')"  alt="">
                </div>
                <div class="cb-name">
                    {{i.name}}
                </div>
                <a class="cb-github" :href="i.github">github</a>
            </div>
        </div>
    </div>
   
</template>
<style>
    .contributorBottom{
        margin-top: 2rem;
        /* border: 1px 0 0 1px solid #eaecef; */
        /* padding: 1.2rem 0; */
        /* margin: 2.5rem 0; */
    }
    .cb-word{
        margin: 0;
        padding: 0;
    }
    .cb-contributors{
        /* border: 1px solid #eaecef; */
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        align-content: stretch;
        justify-content: space-between;
        position: fixed;
    }
    .cb-contributor{
        /* flex-grow: 1; */
        /* flex-basis: 30%; */
        /* max-width: 30%; */
        width: 4rem;
        height: 8rem;
        margin: 1rem;
        text-align: center;
    }
    .cb-name{
        text-align: center;
        line-height: 1rem;
    }
    .cb-headimg{
        width: 4rem;
        height: 4rem;
        border-radius: 100%;
        overflow: hidden;
    }
    .cb-github{
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
