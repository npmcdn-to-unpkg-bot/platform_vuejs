<template>
  <div class="tab-pane fade clearfix" :class="{ 'in': activepage=='page1_2', 'active': activepage=='page1_2' }" id="page1_2">
     <div class="dropdown inline-block">
       <button class="btn btn-default dropdown-toggle search-item" data-sign="brandName" type="button"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
         全部品牌
         <span class="caret"></span>
       </button>
       <ul class="dropdown-menu">
         <li data-id="0">全部品牌</li>
         <li v-for="brandName in brandNames" v-bind:data-id="brandName.id">{{ brandName.text }}</li>
       </ul>
     </div>
     <div class="dropdown inline-block">
       <button class="btn btn-default dropdown-toggle search-item" data-sign="cateName" type="button"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
         全部分类
         <span class="caret"></span>
       </button>
       <ul class="dropdown-menu">
         <li data-id="0">全部分类</li>
         <li v-for="sort in sorts" v-bind:data-id="sort.id">{{ sort.text }}</li>
       </ul>
     </div>
     <div class="dropdown inline-block">
       <button class="btn btn-default dropdown-toggle search-item" data-sign="provider" type="button"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
         全部商家
         <span class="caret"></span>
       </button>
       <ul class="dropdown-menu">
         <li data-id="0">全部商家</li>
         <li v-for="provider in providers" v-bind:data-id="provider.id">{{ provider.text }}</li>
       </ul>
     </div>
     <div class="dropdown inline-block">
       <button class="btn btn-default dropdown-toggle search-item" data-sign="status" type="button"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
         全部
         <span class="caret"></span>
       </button>
       <ul class="dropdown-menu">
         <li data-id="0">全部</li>
         <li data-id="1">出售中</li>
         <li data-id="2">仓库中</li>
         <li data-id="3">已卖完</li>
       </ul>
     </div>
     <br>
     <br>
     <div class="form-group pull-left">
        <input type="text" class="form-control search-input search-item" data-sign="keyword"
           placeholder="关键词（款号，商品名称）">
     </div>
     <button type="button" @click="search" class="btn btn-primary pull-left search-btn">搜索</button>
     <div class="clearfix"></div>
     <div class="search-result" v-show="trs.length>0">
       <div class="table-wrap table-responsive">
         <table class="table table-bordered pagination-item active">
            <caption>搜索结果</caption>
            <thead>
               <tr>
                  <th>
                      <label>
                       <input type="checkbox" class="select-all" v-model="allChecked"> 全选
                      </label>
                  </th>
                  <th>商品名称</th>
                  <th>一级分类</th>
                  <th>款号</th>
                  <th>商家</th>
                  <th>品牌</th>
                  <th>生成方式</th>
                  <th>邮费</th>
                  <th>吊牌价</th>
                  <th>最低起批量</th>
                  <th>库存值</th>
                  <th>商品描述</th>
                  <th>操作</th>
               </tr>
            </thead>
            <tbody>
              <tr v-for="tr in trs" v-bind:data-id="tr.commodityId">
                <td>
                  <label><input type="checkbox" v-bind:checked="allChecked" v-bind:value="{'commodityId':tr.commodityId,'status':tr.status}" v-model="checkedOn"></label>
                </td>
                <td v-for="td in tdArr">{{ tr[td] }}</td>
                <td class="controls">
                  <a href="javascript:;" class="control-item" @click="">编辑</a>&nbsp;&nbsp;
                  <a href="javascript:;" class="control-item" @click="switchStatus(tr)">{{ tr.status == 0 ? "上架" : "下架"  }}</a>&nbsp;&nbsp;
                  <a href="javascript:;" class="control-item" @click="deleteCommodity(tr)">删除</a>
                </td>
              </tr>
            </tbody>
         </table>

       </div>
       <div class="bt-btn-wrap">
         <button type="button" class="btn btn-default inline-block" @click="switchChose" v-bind:style=" (upOrDown=='请选择' || upOrDown=='重新选择') && {'color':'#aaa','pointer-events':'none'}  ">{{ upOrDown }}</button>
         <button type="button" class="btn btn-default inline-block" @click="deleteChose">批量删除</button>
       </div>
       <div class="page-wrap">
         <ul class="pagination">
           <li class="prev" :class="{'disabled': pageDisabled==='prev' }" @click="switchPage('prev')"><a href="javascript:;">&laquo;</a></li>
           <li v-for="n in pageNum " :class="{'active': ( n+1 ) === pageActive }" v-show="!(pagesNth===pagesFull+1 && (n+1)>pagesLast)" @click="switchPage(n+1)"><a href="javascript:;">{{ (n + 1) + ( pagesNth-1 )*pageNum }}</a></li>
           <li class="next" :class="{'disabled': pageDisabled==='next' }"  @click="switchPage('next')"><a href="javascript:;">&raquo;</a></li>
         </ul>
       </div>

     </div>
  </div>
</template>

<script>
  var Vue = require('vue');
  var VueResource = require('vue-resource');
  Vue.use(VueResource);

  export default {
    props:['activepage'],
    data () {
      return {
        // note: changing this line won't causes changes
        // with hot-reload because the reloaded component
        // preserves its current state and we are modifying
        // its initial state.

      //下拉列表选项
        brandNames:[{id: 1,text: "品牌1"}, {id: 2,text: "品牌2"}],
        sorts:[],
        providers:[],
      //搜索结果列表
        //全选框
        allChecked:false,
        //选中的行
        checkedOn:[],
        checkedIds:[],
        checkedStatus:[],
        //请求得到的行数据
        trs:[],
        //控制单元格数据的显示顺序
        tdArr:["commodityName","cateName","commodityNo","provider","brandName","manuStyle","postFee","price","minNum","stocks","commodityDesc"],
      //批量操作:
        //批量上、下架
        upOrDown:"请选择",
      //分页
        //总共的页数
        pagesTotal:18,
        //当前最多可显示的页码数
        pageNum:10,
        //当前页码所处的第几分页组
        pagesNth:1,
        //当前页码在当前显示的所有页码的index
        pageActive:1,
        //控制前后翻页的禁用状态
        pageDisabled:"prev"


      }
    },
    computed:{
      //全选
      allChecked:{
        get:function(){

        },
        set:function(val){

        }
      },
      //选中的数量
      selectCount:{
        get:function(){
          var i=0;
          
        }
      },
      //能完整显示页码的页码页数
      pagesFull:function(){
        return Math.floor( this.pagesTotal / this.pageNum );
      },
      //最后显示的页码数目
      pagesLast:function(){
        return ( this.pagesTotal % this.pageNum );
      },
      //前后翻页禁用的情况
      pageDisabled:function(){
        if(this.pageNth===1){
          return "prev";
        }else if(this.pageNth===18){
          return "next";
        }
      },
      //当前的页码
      pageNth:function(){
        return (this.pageActive+(this.pagesNth-1)*this.pageNum);
      }
    },
    watch:{
      pageActive:function(val,oldVal){
        // ajax
        console.log(this.pageNth);
      },
      //页码改变事件
      pageNth:function(val,oldVal){
        if( val === 1){
          this.pageDisabled="prev";
        }else if(val === this.pagesTotal){
          this.pageDisabled="next";
        }else{
          this.pageDisabled="";
        }
        this.$http.get("static/web/data/action/search?page="+val ).then(function(response){
          var data=response.json();
          if(data.success){
            console.log("翻页成功");
            this.trs=data.result.rows;
            this.pagesTotal=data.result.total;
          }else{
            //可以加个图片提示错误
            console.log("翻页失败，请稍后重试");
          }
        },function(response){
          console.log("网络错误");
        });
      },
      checkedOn:function(val,oldVal){
        this.checkedIds=[];
        this.checkedStatus=[];
        for(var i=0,len=val.length;i<len;i++){
          this.checkedIds.push(val[i].commodityId);
          this.checkedStatus.push(val[i].status);
        }
      },
      checkedStatus:function(val,oldVal){
        var status=val[0];
        var len=val.length;
        if(len===0){
          this.upOrDown="请选择";
          return;
        }
        if( val.join("").split(status).length==len+1 ){
          //选中的全部为要上架或要下架的商品
          if(status==0){
            //0表示要上架的
            this.upOrDown="批量上架";
          }else if(status==1){
            //1表示要下架的
            this.upOrDown="批量下架";
          }
        }else{
          this.upOrDown="重新选择";
        }
      }

    },
    methods:{
      //搜索
      search:function(){
        var vm=this;
        this.$http.get("/static/web/data/action/search?"+"brandName="+11+"&"+"cateName="+11+"&"+"provider="+11+"&"+"status="+11+"&"+"keyword="+11).then(function(response){
          var data=response.json();
          console.log(data);
          if(data.success){
            this.trs=data.result.rows;
            this.pagesTotal=data.result.total;
          }else{
            console.log("搜索失败，请重试");
          }
        },function(response){
          console.log("网络错误");
        });
      },
      alert:function(tr){
        alert (tr.commodityId);
      },
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
      },
      //批量上、下架
      switchChose:function(){
        var url;
        var checkedIds=this.checkedIds;
        var checkedStatus=this.checkedStatus;
        if(checkedStatus[0]==0){
          //批量上架
          url="/static/web/data/action/onshiefCommodity";
        }else{
          //批量下架
          url="/static/web/data/action/offshiefCommodity";
        }
        this.$http.get(url+"?commodityIds="+checkedIds.join(",")).then(function(response){
          var data=response.json();
          if(data.success){
            console.log("操作成功");

          }else{
            console.log("操作失败，请稍后重试");
          }
        },function(response){
          console.log("网络错误");
        })
      },
      //批量删除
      deleteChose:function(){
        this.$http.get("/static/web/data/action/onshiefCommodity?commodityIds="+this.checkedIds.join(",")).then(function(response){
          var data=response.json();
          if(data.success){
            console.log("操作成功");
          }else{
            console.log("操作失败，请稍后重试");
          }
        },function(response){
          console.log("网络错误");
        })
      },
    //单个商品操作
      //切换上、下架
      switchStatus:function(tr){
        var url;
        if(tr.status==0){
          //批量上架
          url="/static/web/data/action/onshiefCommodity";
        }else if(tr.status==1){
          //批量下架
          url="/static/web/data/action/offshiefCommodity";
        }
        this.$http.get(url+"?commodityIds="+tr.commodityId).then(function(response){
          var data=response.json();
          if(data.success){
            console.log("操作成功");
            //操作成功后，修改商品状态
            tr.status=1-tr.status;
          }else{
            console.log("操作失败，请稍后重试");
          }
        },function(response){
          console.log("网络错误");
        })
      },
      //删除
      deleteCommodity:function(tr){
        this.$http.get("/static/web/data/action/deleteCommodity?commodityIds="+tr.commodityId).then(function(response){
          var data=response.json();
          if(data.success){
            console.log("操作成功");

          }else{
            console.log("操作失败，请稍后重试");
          }
        },function(response){
          console.log("网络错误");
        })
      }
    }
  }

</script>

<!-- scoped表示只在此模块中应用该样式 -->
<style lang="scss" scoped>
  .search-result{
    display: block;
  }
</style>
