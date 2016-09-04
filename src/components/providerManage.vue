<template>
  <div class="tab-pane fade" :class="{ 'in': activepage=='page3', 'active': activepage=='page3' }" id="page3">
     <div class="form-group pull-left">
        <input type="text" class="form-control search-input search-item" data-sign="keyword" placeholder="关键字检索商家">
     </div>
     <div class="dropdown pull-left">
       <button class="btn btn-default dropdown-toggle search-item" data-sign="audit" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
         全部
         <span class="caret"></span>
       </button>
       <ul class="dropdown-menu">
         <li>全部</li>
         <li>未审核</li>
         <li>已审核</li>
       </ul>
     </div>
     <div class="dropdown pull-left">
       <button class="btn btn-default dropdown-toggle search-item" data-sign="company" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
         供货商
         <span class="caret"></span>
       </button>
       <ul class="dropdown-menu">
         <li>供货商</li>
         <li>采购商</li>
       </ul>
     </div>
     <button type="button" class="btn btn-primary search-btn">搜索</button>
     <button type="button" class="btn btn-primary add-btn">添加</button>
     <div class="search-result">
       <div class="table-wrap">
         <table class="table table-bordered table-center pagination-item active">
            <caption>搜索结果</caption>
            <thead>
               <tr>
                  <th>商家LOGO</th>
                  <th>店铺名称</th>
                  <th>商家类别</th>
                  <th>手机号</th>
                  <th>审核状态</th>
                  <th>操作</th>
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
