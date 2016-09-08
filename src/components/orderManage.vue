<template>
  <div class="tab-pane fade" :class="{ 'in': activepage=='page2', 'active': activepage=='page2' }" id="page2">
     <dropdown :selected.sync='providers.selected' :default-opt='providers.default' :options='providers.options' :wrap-cls='["inline-block"]'></dropdown>
     <dropdown :selected.sync='orderStatus.selected' :default-opt='orderStatus.default' :options='orderStatus.options' :wrap-cls='["inline-block"]'></dropdown>
     <div class="form-group inline-block">
        <input type="datetime-local" class="form-control search-item" data-sign="start">
     </div>  开始时间
     <div class="form-group inline-block">
        <input type="datetime-local" class="form-control search-item"data-sign="end">
     </div>  结束时间
     <button type="button" class="btn btn-primary search-btn">搜索</button>
     <button type="button" class="btn btn-primary order-export">导出订单</button>
     <div class="search-result">
       <div class="table-wrap">
         <table class="table table-bordered pagination-item active">
            <caption>搜索结果</caption>
            <thead>
               <tr>
                 <th v-for='list in ["供货商","订单号","订单金额","订单状态","采购商","付款时间","邀请码"]'>{{list}}</th>
               </tr>
            </thead>
            <tbody>

            </tbody>
         </table>

       </div>

       <!-- <div class="page-wrap">
         <ul class="pagination">
           <li class="disabled prev"><a href="javascript:;">&laquo;</a></li>
           <li class="active"><a href="javascript:;">1</a></li>
           <li class="next"><a href="javascript:;">&raquo;</a></li>
         </ul>
       </div> -->
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
        providers:{ default:{id: 0,text: "全部商家"},options:[{id: 1,text: "商家1"},{id: 2,text: "商家2"}],selected:{id: 0,text: "全部商家"}},
        orderStatus:{ default:{id: 0,text: "全部状态"},options:[{id: 1,text: "状态1"},{id: 2,text: "状态2"}],selected:{id: 0,text: "全部状态"}},
      /*搜索结果列表*/
        //请求得到的行数据
        trs:[],
        //控制单元格数据的显示顺序
        tdArr:["commodityName","cateName","commodityNo","provider","brandName","manuStyle","postFee","price","minNum","stocks","commodityDesc"],
      /*分页*/
        //总共的页数
        pagesTotal:"",
        //当前最多可显示的页码数
        pageNum:10,
        //当前页码
        pageNth:1,
      }
    }
  }
</script>

<style>

</style>
