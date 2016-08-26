<template>
  <div class="tab-pane fade" id="page4">
     <div class="form-group pull-left">
        <input type="text" class="form-control search-input" placeholder="关键字检索品牌">
     </div>
     <button type="button" class="btn btn-primary search-btn">搜索</button>
     <button type="button" class="btn btn-primary add-btn">添加</button>
     <div class="search-result">
       <div class="table-wrap">
         <table class="table table-bordered table-center pagination-item active">
            <caption>搜索结果</caption>
            <thead>
               <tr>
                  <th>品牌LOGO</th>
                  <th>品牌名</th>
                  <th>品牌类别</th>
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

</script>

<style>

</style>
