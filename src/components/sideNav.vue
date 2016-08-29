<template>
  <ul id="sideNav-wrap" class="nav nav-tabs">
      <li class="dropdown active">
        <a href="#" id="myTabDrop1" class="dropdown-toggle"
           data-toggle="dropdown">商品管理<b class="caret"></b>
        </a>
        <ul class="dropdown-menu" role="menu" aria-labelledby="myTabDrop1">
           <li class="active"><a href="#page1_1" class="active" tabindex="-1" data-toggle="tab">
              商品上传</a>
           </li>
           <li><a href="#page1_2" tabindex="-1" data-toggle="tab">
              商品编辑</a>
           </li>
        </ul>
     </li>

     <li><a href="#page2" @click="fn" data-toggle="tab">订单管理</a></li>
     <li><a href="#page3" data-toggle="tab">商家管理</a></li>
     <li><a href="#page4" data-toggle="tab">品牌管理</a></li>
     <li><a href="#page5" data-toggle="tab">营销</a></li>
  </ul>
</template>

<script>
  export default {
    data () {
      return {
        // note: changing this line won't causes changes
        // with hot-reload because the reloaded component
        // preserves its current state and we are modifying
        // its initial state.
        msg: 'Hello World!'
      }
    },
    methods:{
      fn:function(){
        alert(12222);
      }
    }
  }
</script>

<style>

</style>
