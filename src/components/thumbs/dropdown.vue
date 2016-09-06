<template id="dropdown">
  <div class="dropdown" :class="wrapCls" :data-sign="dataSign" @click="wrapClick">
    <button type="button" class="btn btn-default" :class="buttonCls">
      {{defaultOpt.text}}
      <span class="caret"></span>
    </button>
    <ul class="dropdown-menu" :class="menuCls" :class="{'show':menuShow}">
      <li :data-id="defaultOpt.id"  @click="itemClick">{{defaultOpt.text}}</li>
      <li v-for="list in lists" v-bind:data-id="list.id" @click="itemClick">{{ list.text }}</li>
    </ul>
  </div>
</template>

<script type="text/javascript">
  export default {
    props: ['defaultOpt','lists','wrapCls','dataSign','buttonCls','menuCls'],
    data () {
      return{
        menuShow:false
      }
    },
    methods:{
      wrapClick:function(){
        this.menuShow=true;
      },
      itemClick:function(){
        this.menuShow=false;
      }
    }

  }
</script>

<style>

</style>
