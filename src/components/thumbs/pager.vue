<template>
  <div class="page-wrap">
    <ul class="pagination">
      <li class="prev" :class="{'disabled': pageDisabled==='prev' }" @click="switchPage('prev')"><a href="javascript:;">&laquo;</a></li>
      <li v-for="n in pageNum " :class="{'active': ( n+1 ) === pageActive }" v-show="!( pagesNth===pagesFull+1 && (n+1)>pagesExtra )" @click="switchPage(n+1)"><a href="javascript:;">{{ (n + 1) + ( pagesNth-1 )*pageNum }}</a></li>
      <li class="next" :class="{'disabled': pageDisabled==='next' }"  @click="switchPage('next')"><a href="javascript:;">&raquo;</a></li>
    </ul>
  </div>
</template>

<script>
export default {
  props:{'pagesTotal':null,'pageNum':{default:8},'pageNth':null},
  data() {
    return {
    };
  },
  computed: {
    //当前页码所处的第几分页组
    pagesNth:function(){
      return Math.ceil( this.pageNth / this.pageNum )
    },
    //前后翻页禁用的情况
    pageDisabled:function(){
      if(this.pageNth===1){
        return "prev";
      }else if(this.pageNth===this.pagesTotal){
        return "next";
      }
      return "";
    },
    //当前页码在当前显示的所有页码的index+1
    pageActive:function(){
      console.log(this.pageNth);
      return ( this.pageNth % this.pageNum || this.pageNum );
    },
    //最后显示的页码数目
    pagesExtra:function(){
      return ( this.pagesTotal % this.pageNum );
    },
    //能完整显示页码的页码页数
    pagesFull:function(){
      return ( Math.floor( this.pagesTotal / this.pageNum ) );
    }

  },
  ready() {},
  attached() {},
  methods: {
    //切换页码
    switchPage:function(agr){
      var pagesTotal=this.pagesTotal;
      var pageNth=this.pageNth;
      var pageNum=this.pageNum;
      var pageActive=this.pageActive;
      var pageDisabled=this.pageDisabled;
      if(agr==="prev"){
        //如果是第一页，不做反应
        if(pageNth===1){
          return;
        }
        if(pageActive % pageNum === 1 ){
          this.pagesNth--;
          this.pageActive=pageNum;
        }else{
          this.pageActive--;
        }
        //当前页码更新
        this.pageNth--;
      }else if(agr=="next"){
        //如果是最后一页，不做反应
        if(pageNth===pagesTotal){
          return;
        }
        if(pageActive % pageNum === 0 ){
          this.pagesNth++;
          this.pageActive=1;
        }else {
          this.pageActive++;
        }
        //当前页码更新
        this.pageNth++;
      }else{
        this.pageActive=agr;
      }
    }
  }
  
};
</script>

<style lang="css">
</style>
