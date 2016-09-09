<template>
  <div class="tab-pane fade clearfix" :class="{ 'in': activepage=='page1_2', 'active': activepage=='page1_2' }" id="page1_2">
     <dropdown v-for='item in [brandNames,sorts,providers,statuses]' :selected.sync='item.selected' :default-opt='item.default' :options='item.options' :wrap-cls='["inline-block"]'></dropdown>
     <div class="form-group inline-block">
        <input type="text" class="form-control" v-model="keyword" placeholder="关键词（款号，商品名称）">
     </div>
     <button type="button" @click="search" class="btn btn-primary inline-block search-btn">搜索</button>
     <div class="clearfix"></div>
     <div class="search-result" v-show="trs.length>0">
       <div class="table-wrap table-responsive">
         <table class="table table-bordered pagination-item active">
            <caption>搜索结果</caption>
            <thead>
               <tr>
                  <th>
                      <label>
                       <!-- <input type="checkbox" class="select-all" v-model="selectAll"> 全选 -->
                       <input type="checkbox" class="select-all" v-model="selectAll" v-check-all="selectAll" v-bind:checked-data="checkedOn"> 全选
                      </label>
                  </th>
                  <th v-for='list in ["商品名称","一级分类","款号","商家","品牌","生成方式","邮费","吊牌价","最低起批量","库存值","商品描述","操作"]'>{{list}}</th>
               </tr>
            </thead>
            <tbody>
              <tr v-for="tr in trs" v-bind:data-id="tr.commodityId">
                <td>
                  <label><input type="checkbox" v-bind:value=' {"commodityId":tr.commodityId,"status":tr.status} | json 0 ' v-model="checkedOn"></label>
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
       <pager :pages-total='pagesTotal' :page-num='pageNum' :page-nth.sync='pageNth' ></pager>
     </div>
  </div>
</template>

<script>
  //插件引入
  var Vue = require('vue');
  var VueResource = require('vue-resource');
  Vue.use(VueResource);

  //组件注册和引用
  import dropdown from './thumbs/dropdown';
  import pager from './thumbs/pager';

  export default {
    components: {
      dropdown,pager
    },
    props:['activepage'],
    data () {
      return {
      /*搜索选项*/
        brandNames:{ default:{id: 0,text: "全部品牌"},options:[],selected:{id: 0,text: "全部品牌"}},
        sorts:{ default:{id: 0,text: "全部分类"},options:[],selected:{id: 0,text: "全部分类"} },
        providers:{ default:{id: 0,text: "全部商家"},options:[],selected:{id: 0,text: "全部商家"} },
        statuses:{ default:{id: 0,text: "全部"},options:[{id: 1,text: "出售中"},{id: 2,text: "仓库中"},{id: 2,text: "仓库中"}],selected:{id: 0,text: "全部"} },
        keyword:"",
      /*搜索结果列表*/
        //全选框
        selectAll:false,
        //选中的行
        checkedOn:[],
        checkedIds:[],
        checkedStatus:[],
        //请求得到的行数据
        trs:[],
        //控制单元格数据的显示顺序
        tdArr:["commodityName","cateName","commodityNo","provider","brandName","manuStyle","postFee","price","minNum","stocks","commodityDesc"],
      /*批量操作*/
        //批量上、下架
        upOrDown:"请选择",
      /*分页*/
        //总共的页数
        pagesTotal:"",
        //当前最多可显示的页码数
        pageNum:10,
        //当前页码
        pageNth:1,
      }
    },
    computed:{
      // 全选checkbox绑定的model
      // selectAll: {
      //   get: function() {
      //     return this.checkedCount == this.trs.length;
      //   },
      //   set: function(value) {
      //     if (value) {
      //       this.checkedOn = this.trs.map(function(item) {
      //         //保存json字符串格式
      //         return JSON.stringify({
      //           'commodityId':item.commodityId,
      //           'status':item.status
      //         });
      //
      //       })
      //     } else {
      //       this.checkedOn = [];
      //     }
      //   }
      // },
      // checkedCount: {
      //   get: function() {
      //     return this.checkedOn.length;
      //   }
      // }
    },
    watch:{
      //监控当前页是否显示，若显示则加载动态下拉选项
      activepage:function(val,oldVal){
        var vm=this;
        if(val==="page1_2"){
          vm.$http.get("static/web/data/action/loadData").then(function(response){
            var data=response.json();
            var result=data.result;
            if(data.success){
              vm.brandNames.options=result.brandName;
              vm.sorts.options=result.cateName;
              vm.providers.options=result.provider;
              console.log("动态下拉选项数据加载成功");
            }else{
              console.log("动态下拉选项数据加载失败: "+data.error);
            }
          },function(response){
            console.log("动态下拉选项数据网络错误");
          })
        }
      },
      // allChecked:function(val,oldVal){
      //   var vm=this;
      //   // vm.trs.forEach(function(item,index,array){
      //   //   vm.checkedOn.$remove(item);
      //   // });
      //   if(val==true){
      //     vm.trs.forEach(function(item,index,array){
      //       vm.checkedOn.push(item);
      //     });
      //   }
      // },
      //页码改变事件
      pageNth:function(val,oldVal){
        var vm=this;
        this.$http.get("static/web/data/action/search?" + zj.serialize( {brandName:vm.brandNames.selected.text,cateName:vm.sorts.selected.text,provider:vm.providers.selected.text,status:vm.statuses.selected.text,keyword:this.keyword,page:val} ) ).then(function(response){
          var data=response.json();
          if(data.success){
            console.log("翻页成功");
            vm.trs=data.result.rows;
            vm.pagesTotal=data.result.total;
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
          this.checkedIds.push( JSON.parse( val[i] ).commodityId );
          this.checkedStatus.push( JSON.parse( val[i] ).status );
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
        this.$http.get("/static/web/data/action/search?"+zj.serialize({brandName:vm.brandNames.selected.text,cateName:vm.sorts.selected.text,provider:vm.providers.selected.text,status:vm.statuses.selected.text,keyword:this.keyword}) ).then(function(response){
          var data=response.json();
          console.log(data);
          if(data.success){
            this.trs=data.result.rows;
            this.trs.forEach(function(item,index,array){
              item.checked=false;
            })
            this.pagesTotal=data.result.total;
            console.log("搜索成功");
          }else{
            console.log("搜索失败: "+data.error);
          }
        },function(response){
          console.log("网络错误");
        });
      },
      alert:function(tr){
        alert (tr.commodityId);
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
        this.$http.get( url+"?"+ zj.serialize({commodityIds:checkedIds.join(",")}) ).then(function(response){
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
        this.$http.get("/static/web/data/action/onshiefCommodity?"+zj.serialize({commodityIds:this.checkedIds.join(",")}) ).then(function(response){
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
        this.$http.get(url+"?"+zj.serialize({commodityIds:tr.commodityId}) ).then(function(response){
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
        this.$http.get("/static/web/data/action/deleteCommodity?"+zj.serialize({commodityIds:tr.commodityId}) ).then(function(response){
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
    },
    directives:{
      //指令内部的this指向这个指令对象
      'check-all':{
        twoWay:true,
        params:['checkedData'],
        paramWatchers:{
          checkedData:function(val,oldVal){
            this.vm.selectAll= ( this.vm.trs.length === this.vm.checkedOn.length );
          }
        },
        bind:function(){

        },
        update:function(val){
          if(val){
            this.vm.checkedOn = this.vm.trs.map(function(item) {
              //保存json字符串格式
              return JSON.stringify({
                'commodityId':item.commodityId,
                'status':item.status
              });

            })
          }else{
            this.checkedOn=[];
          }
        }
      }
    }
  }

</script>

<!-- scoped表示只在此模块中应用该样式 -->
<style lang="scss">
  .search-result{
    display: block;
  }
</style>
