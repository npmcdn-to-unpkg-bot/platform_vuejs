<template>
  <div class="tab-pane fade" :class="{ 'in': activepage=='page2', 'active': activepage=='page2' }" id="page2">
     <dropdown :selected.sync='providers.selected' :default-opt='providers.default' :options='providers.options' :wrap-cls='["inline-block"]'></dropdown>
     <dropdown :selected.sync='orderStatus.selected' :default-opt='orderStatus.default' :options='orderStatus.options' :wrap-cls='["inline-block"]'></dropdown>
     <div class="form-group inline-block">
        <input type="datetime-local" class="form-control" v-model="start">
     </div>  开始时间
     <div class="form-group inline-block">
        <input type="datetime-local" class="form-control" v-model="end">
     </div>  结束时间
     <button type="button" @click="search" class="btn btn-primary search-btn" >搜索</button>
     <button type="button" class="btn btn-primary order-export">导出订单</button>
     <div class="search-result" v-show="trs.length>0">
       <div class="table-wrap">
         <table class="table table-bordered pagination-item active">
            <caption>搜索结果</caption>
            <thead>
               <tr>
                 <th v-for='list in ["供货商","订单号","订单金额","订单状态","采购商","付款时间","邀请码"]'>{{list}}</th>
               </tr>
            </thead>
            <tbody>
              <tr v-for="tr in trs" v-bind:data-id="tr.commodityId">
                <td v-for="td in tdArr">{{ tr[td] }}</td>
              </tr>
            </tbody>
         </table>

       </div>
       <pager :pages-total='pagesTotal' :page-num='pageNum' :page-nth.sync='pageNth' ></pager>

     </div>

  </div>
</template>

<script>

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
        //商家选择
        providers:{ default:{id: 0,text: "全部商家"},options:[],selected:{id: 0,text: "全部商家"}},
        //订单状态选择
        orderStatus:{ default:{id: 0,text: "全部订单"},options:[{id:1,text:"交易关闭"},{id:2,text:"待付款"},{id:3,text:"已付款"},{id:4,text:"代发货"},{id:5,text:"待收货"},{id:6,text:"已完成"}],selected:{id: 0,text: "全部订单"}},
        //订单时间区间
        start:"",
        end:"",
      /*搜索结果列表*/
        //请求得到的行数据
        trs:[],
        //控制单元格数据的显示顺序
        tdArr:["provider", "orderNo", "money", "orderStatus", "buyer", "time", "code"],
      /*分页*/
        //总共的页数
        pagesTotal:"",
        //当前最多可显示的页码数
        pageNum:10,
        //当前页码
        pageNth:1,
      }
    },
    watch:{
      //页码改变事件
      pageNth:function(val,oldVal){
        this.search();
      },
      //监控当前页是否显示，若显示则加载动态下拉选项
      activepage:function(val,oldVal){
        var vm=this;
        if(val==="page2"){
          vm.$http.get("static/web/data/action/loadData").then(function(response){
            var data=response.json();
            var result=data.result;
            if(data.success){
              vm.providers.options=result.provider;
              console.log("动态下拉选项数据加载成功");
            }else{
              console.log("动态下拉选项数据加载失败: "+data.error);
            }
          },function(response){
            console.log("动态下拉选项数据网络错误");
          })
        }
      }
      //页码改变事件
      // pageNth:function(val,oldVal){
      //   this.$http.get("static/web/data/action/search?" + zj.serialize({page:val}) ).then(function(response){
      //     var data=response.json();
      //     if(data.success){
      //       console.log("翻页成功");
      //       this.trs=data.result.rows;
      //       this.pagesTotal=data.result.total;
      //     }else{
      //       //可以加个图片提示错误
      //       console.log("翻页失败，请稍后重试");
      //     }
      //   },function(response){
      //     console.log("网络错误");
      //   });
      // }
    },
    methods:{
      //搜索
      search:function(opts){
        // {
        //   url:,
        //   data:{},
        //   success:function(response){
        //
        //   },
        //   fail:function(response){
        //
        //   }
        // }
        var vm=this;
        opts=opts || {};
        var url= opts.url || "/static/web/data/action/orderSearch";
        var data=opts.data || {provider:vm.providers.selected.text,order:vm.orderStatus.selected.text,start:zj.timeToDigit(vm.start),end:zj.timeToDigit(vm.end)};
        var success=opts.success || function(response){
          var data=response.json();
          console.log(data);
          if(data.success){
            this.trs=data.result.rows;
            this.pagesTotal=data.result.total;
            console.log("搜索成功");
          }else{
            console.log("搜索失败: "+data.error);
          }
        };
        var fail=opts.fail || function(response){
          console.log("网络错误");
        };
        this.$http.get( url + "?" +zj.serialize(data) ).then(success,fail);
      }
    }
  }
</script>

<style>

</style>
