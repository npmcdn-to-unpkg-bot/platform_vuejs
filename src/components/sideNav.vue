<template>
  <ul id="sideNav-wrap" class="nav">
     <li v-for="page in pages" :class="{ 'dropdown': page.dropdown , 'page-nav': !page.dropdown , 'page-navs': page.dropdown ,'active': activePage.indexOf(page.id) === 0  }" @click="dropdown($event)" v-bind:data-page="page.id">
       {{page.dropdown ? "" : page.text }}
       <template v-if=" page.dropdown ">
         <div class="dropdown-toggle" data-toggle="dropdown">{{page.text}}<b class="caret"></b></div>
         <ul class="dropdown-menu">
           <li v-for="item in page.dropdown" class="page-nav" :class="{ 'active': item.id === activePage }" @click="pageShow($event)" v-bind:data-page="item.id">{{item.text}}</li>
         </ul>
       </template>
     </li>
  </ul>
</template>

<script>
  export default {
    props:['pages'],
    data () {
      return {
        // note: changing this line won't causes changes
        // with hot-reload because the reloaded component
        // preserves its current state and we are modifying
        // its initial state.
        pages2:[
                { id:"page1",text:"商品管理",dropdown:[ {id:"page1_1",text:"商品上传"},{ id:"page1_2",text:"商品编辑" } ] } ,
                { id:"page2",text:"订单管理" } ,
                { id:"page3",text:"商家管理" } ,
                { id:"page4",text:"品牌管理" } ,
                { id:"page5",text:"营销" }
              ],
        activePage:'page1_1'
      }
    },
    methods:{
      dropdown:function(event){
        var $this=event.currentTarget;
        $this.querySelector(".dropdown-menu").style.display="block";
      },
      pageShow:function(event){
        var $this=event.currentTarget;
        this.activePage=$this.dataset.page;
      }
    }
  }
</script>

<style>

</style>
