<template>
  <div class="dropdown" :class="wrapCls"  @click="wrapClick">
    <button type="button" class="btn btn-default" :class="buttonCls">
      {{selected.text}}
      <span class="caret"></span>
    </button>
    <ul class="dropdown-menu" :class='[{"show":menuShow},menuCls]'>
      <li :data-id="defaultOpt.id"  @click="itemClick" @click.stop="itemClick(defaultOpt)">{{defaultOpt.text}}</li>
      <li v-for="option in options" :data-id="option.id" @click.stop="itemClick(option)">{{ option.text }}</li>
    </ul>
  </div>
</template>

<script type="text/javascript">

  export default {
    /**
     * selected:选中项数据（对象，包含id和文字）
     * defaultOpt:默认选项（对象，包含id和文字）
     * lists：选项数组
     * wrapCls：组件外层包含标签类名（数组）
     * buttonCls：button类名（数组）
     * menuCls：menu类名（数组）
     */
    props: ['selected','defaultOpt','options','wrapCls','buttonCls','menuCls'],
    data () {
      /**
       * menuShow：控制下来选项显示
       * selectedId:选择的选项id
       */
      return{
        menuShow:false
      }
    },
    watch:{
    },
    methods:{
      wrapClick:function(){
        this.menuShow=true;
      },
      itemClick:function(opt){
        this.menuShow=false;
        this.selected=opt;
      }
    }

  }
</script>

<style lang="scss" scoped>
  .inline-block{
    margin-right:5px;
  }
</style>
