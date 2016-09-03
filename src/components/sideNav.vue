<template>
  <ul id="sideNav-wrap" class="nav">
     <!-- 'page-nav' : 没有二级菜单的导航项 ; 'dropdown' : 有二级菜单 ; 'page-navs' : 有二级菜单的导航项 ; active : 当前导航被激活 ; data-page : 页码-->
     <li v-for="page in pages" :class="{ 'page-nav': !page.dropdown , 'dropdown': page.dropdown , 'page-navs': page.dropdown ,'active':  activepage.indexOf(page.id) === 0  }" @click="navClick($event,page)" v-bind:data-page="page.id">
       {{page.dropdown ? "" : page.text }}
       <template v-if=" page.dropdown ">
         <div class="dropdown-toggle" data-toggle="dropdown">{{page.text}}<b class="caret"></b></div>
         <ul class="dropdown-menu" :class=" { 'show' : page.open } ">
           <li v-for="item in page.dropdown" class="page-nav" :class="{ 'active': item.id === activepage }" @click.stop="navClick($event,item)" v-bind:data-page="item.id">{{item.text}}</li>
         </ul>
       </template>
     </li>
  </ul>
</template>

<script>
  export default {
    //pages : 页面导航数据  activepage : 当前激活页面id
    props:['pages','activepage'],
    data () {
      return {
        //pages的数据演示，无用
        pages2:[
                { id:"page1",text:"商品管理",open:false,dropdown:[ {id:"page1_1",text:"商品上传"},{ id:"page1_2",text:"商品编辑" } ] } ,
                { id:"page2",text:"订单管理" } ,
                { id:"page3",text:"商家管理" } ,
                { id:"page4",text:"品牌管理" } ,
                { id:"page5",text:"营销" }
              ]
      }
    },
    methods:{
      navClick:function(event,page){
        // var $this=event.currentTarget;
        //注意阻止冒泡
        if(page.dropdown){
          page.open=true;
        }else{
          this.activepage=page.id;
          this.pages.forEach(function(item,index,array){
            //折叠二级菜单
            if(item.dropdown){
              item.open=false;
            }
          });
        }
      }
    },
    watch:{
      activepage:function(val,oldVal){

      }
    }
  }
</script>

<style lang="scss">
  .page-nav,.page-navs{
    cursor: pointer;
    color:#337ab7;
    &.active{
      background:#337ab7 !important;
      color:#fff !important;
    }
    &:not(.active):hover{
      background:#669fcc !important;
    }
  }
  .dropdown-menu{
    &.show{
      display: block !important;
    }
  }
</style>
