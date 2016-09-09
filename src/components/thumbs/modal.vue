<template>
  <div class="modal" :class="{'fade':fade,'in':in}" :style="{display:display}" tabindex="-1">
     <!-- <div class="modal-mask"></div> -->
     <div class="modal-dialog">
        <div class="modal-content">
           <div class="modal-header">
              <button type="button" class="close" @click="cancel">
                    &times;
              </button>
              <h4 class="modal-title">
                 {{{title}}}
              </h4>
           </div>
           <div class="modal-body">
             {{{body}}}
           </div>
           <div class="modal-footer">
              <button type="button" class="btn btn-default" @click="confirm">确认
              </button>
              {{{footer}}}
           </div>
        </div>
      </div>
  </div>
</template>

<script>
  export default{
    props:{'fade':{default:true},'show':null,'title':null,'body':null,'footer':null},
    data(){
      return{
        display:'none',
        in:false
      }
    },
    watch:{
      show:function(val,oldVal){
        //注意：要实现动画效果(opacity),需满足以下条件：
        //modal出现时：需先设置display:block,再设置opacity:1
        //modal消失时：需等opacity动画(bootstrap设置为150ms)完后再设置display:none
        var vm=this;
        if(val){
          vm.display="block";
          // vm.$nextTick(function(){
          //   vm.in=true;
          // })
          setTimeout(function(){
            vm.in=true;
          })
        }else{
          vm.in=false;
          // vm.$nextTick(function(){
          //   vm.display="none";
          // })
          setTimeout(function(){
            vm.display="none";
          },150)
        }
      }
    },
    methods:{
      cancel:function(){
        this.show=false;
      },
      confirm:function(){
        this.cancel();
      }
    }
  }
</script>

<style lang="scss">
  .modal{
    background:rgba(0,0,0,0.6);
    @at-root .modal-mask{
      display: none;
      position: fixed;
      left:0;
      right:0;
      top:0;
      bottom:0;
      z-index:1000;
    }
  }
</style>
