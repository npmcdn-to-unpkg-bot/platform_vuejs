<template>
  <div class="tab-pane fade" :class="{ 'in': activepage=='page2', 'active': activepage=='page2' }" id="page2">
     <div class="dropdown inline-block" >
       <button class="btn btn-default dropdown-toggle search-item" data-sign="provider" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
         全部商家
         <span class="caret"></span>
       </button>
       <ul class="dropdown-menu">
         <li data-id="0">全部商家</li>
       </ul>
     </div>
     <div class="dropdown inline-block">
       <button class="btn btn-default dropdown-toggle search-item" data-sign="order" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
         全部订单
         <span class="caret"></span>
       </button>
       <ul class="dropdown-menu">
         <li data-id="0">全部订单</li>
       </ul>
     </div>
     <div class="form-group inline-block">
        <input type="date" class="form-control search-item" data-sign="start">
     </div>  开始时间
     <div class="form-group inline-block">
        <input type="date" class="form-control search-item"data-sign="end">
     </div>  结束时间
     <button type="button" class="btn btn-primary search-btn">搜索</button>

     <div class="search-result">
       <div class="table-wrap">
         <table class="table table-bordered pagination-item active">
            <caption>搜索结果</caption>
            <thead>
               <tr>
                  <th>供货商</th>
                  <th>订单号</th>
                  <th>订单金额</th>
                  <th>订单状态</th>
                  <th>采购商</th>
                  <th>付款时间</th>
                  <th>邀请码</th>
               </tr>
            </thead>
            <tbody>
            </tbody>
         </table>

       </div>
       <div class="page-wrap">
         <ul class="pagination">
           <li class="disabled prev"><a href="javascript:;">&laquo;</a></li>
           <li class="active"><a href="javascript:;">1</a></li>
           <li class="next"><a href="javascript:;">&raquo;</a></li>
         </ul>
       </div>

     </div>

  </div>
</template>

<script>
  export default {
    props:['activepage'],
    data () {
      return {
      }
    }
  }
</script>

<style>

</style>
