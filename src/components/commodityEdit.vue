<template>
  <div class="tab-pane fade clearfix" id="page1_2">
     <div class="dropdown inline-block">
       <button class="btn btn-default dropdown-toggle search-item" data-sign="brandName" type="button"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
         全部品牌
         <span class="caret"></span>
       </button>
       <ul class="dropdown-menu">
         <li data-id="0">全部品牌</li>
       </ul>
     </div>
     <div class="dropdown inline-block">
       <button class="btn btn-default dropdown-toggle search-item" data-sign="cateName" type="button"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
         全部分类
         <span class="caret"></span>
       </button>
       <ul class="dropdown-menu">
         <li data-id="0">全部分类</li>
       </ul>
     </div>
     <div class="dropdown inline-block">
       <button class="btn btn-default dropdown-toggle search-item" data-sign="provider" type="button"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
         全部商家
         <span class="caret"></span>
       </button>
       <ul class="dropdown-menu">
         <li data-id="0">全部商家</li>
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
     <button type="button" class="btn btn-primary pull-left search-btn">搜索</button>
     <div class="clearfix"></div>
     <div class="search-result">
       <div class="table-wrap table-responsive">
         <table class="table table-bordered pagination-item active">
            <caption>搜索结果</caption>
            <thead>
               <tr>
                  <th>
                      <label>
                       <input type="checkbox" name="selectAll" class="select-all"> 全选
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
            </tbody>
         </table>

       </div>
       <div class="bt-btn-wrap">
         <button type="button" class="btn btn-default inline-block operates">批量上架</button>
         <button type="button" class="btn btn-default inline-block operates">批量删除</button>
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
    data () {
      return {
        // note: changing this line won't causes changes
        // with hot-reload because the reloaded component
        // preserves its current state and we are modifying
        // its initial state.
        msg: 'Hello World!'
      }
    }
  }

  $(function(){

    //装载下拉数据

    $("#sideNav-wrap").find("[href=#page1_2]").ZloadOptions({ url:"static/web/data/action/loadData" });
    $("#sideNav-wrap").find("[href=#page2]").ZloadOptions({ url:"static/web/data/action/loadData" });


    //显示选中项
    $(".tab-pane").on("click",".dropdown-menu li",function(){
       var $this=$(this);
       var dropdown=$this.closest('.dropdown');
       dropdown.find(".dropdown-toggle").html( $this.text() +'<span class="caret"></span>' );
       // dropdown.data("id",$this.data("id"));
    });



    //商品管理搜索
    $(".search-btn","#page1_2").Zsearch({
       url:'static/web/data/action/search',
       data:{},
       prefix:'<td><label><input type="checkbox" name="selectAll"></label></td>',
       suffix:'<td class="controls"><a href="javascript:;" class="control-item">编辑</a>&nbsp;&nbsp;<a href="javascript:;" class="control-item status">上架</a>&nbsp;&nbsp;<a href="javascript:;" class="control-item">删除</a></td>',
       array:["commodityName","cateName","commodityNo","provider","brandName","manuStyle","postFee","price","minNum","stocks","commodityDesc"]
    });

    //操作
    $(document).on("click",".control-item",function(){
       var $this=$(this);
       var tr=$this.closest('tr');
       var id=tr.data("commodityId");
       //tr保存数据
       switch( $this.index() ){
         case 0:
           break;
         case 1:
           if($this.text().indexOf("上架") !== -1){
             _ajax( "static/web/data/action/onshiefCommodity","GET", "" , "json" , {commodityIds: id },function(data){
               data=toData(data);
               if(data.success===true){
                 modalBody.html("上架成功");
                 $this.text("下架").removeClass('waitPutaway');
               }else if(data.success===false){
                 modalBody.html(data.error);
               }
             });
           }else if($this.text().indexOf("下架") !== -1){
             _ajax( "static/web/data/action/offshiefCommodity","GET", "" , "json" , {commodityIds: id },function(data){
               data=toData(data);
               if(data.success===true){
                 modalBody.html("下架成功");
                 $this.text("上架").addClass('waitPutaway');
               }else if(data.success===false){
                 modalBody.html(data.error);
               }
             });
           }
           break;
         case 2:
           _ajax( "static/web/data/action/deleteCommodity","GET", "" , "json" , {commodityIds: id },function(data){
             data=toData(data);
             if(data.success===true){
               modalBody.html("删除成功");
               tr.remove();
             }else if(data.success===false){
               modalBody.html(data.error);
             }
           });
       }
    });

    //批量操作
    var operates=$(".bt-btn-wrap","#page1_2").children();
    var operate1=operates.eq(0);
    var operate2=operates.eq(1);
    // $(".search-result").on("click",".operates",function(){
    //    var $this=$(this);
    //    var text=$this.text();
    //    var search_result=$this.closest('.search-result');
    //    var trs_checked=search_result.find(".table-wrap table.active tbody tr").filter(function(){
    //      return $(this).find("input[type=checkbox]")[0].checked;
    //    });
    //    if(text.indexOf("批量上架")!== -1){
    //      var isOk=true;
    //      trs_checked.each(function(index,item){
    //          // item.data("status").
    //      });

    //    }else if(text.indexOf("批量删除") !==-1){

    //    }else if(text.indexOf("批量下架") !==-1){
    //      {
    //        commondityIds:[1,2]
    //      }
    //    }
    // });



    //批量删除
    operate2.on("click",function(){
       var $this=$(this);
       var tab_pane=$this.closest('.tab-pane');
       var table=tab_pane.find("table.active");
       var data=$.map(table.data("arr"),function(item,index){
          return item.commodityId;
       });

       console.log(data);
       console.log(table.data("arr"));
       _ajax("static/web/data/action/deleteCommodity","GET","","json",{ commodityIds:data.join(",") },function(data){
         data=toData(data);
         if(data.success==true){
           modalBody.html("删除成功");
           var checkeds=table.find("tbody tr").filter(function(index) {
             var $this=$(this);
             return $this.find("td").eq(0).find("input")[0].checked;
           });
           checkeds.remove();
           table.data("arr",[]);
         }else if(data.success==false){
           modalBody.html(data.error);
         }

       },"","");
    });

    //全选
    $(document).on("change",".select-all",function(){
       var $this=$(this);
       var table=$this.closest('table.active');
       var checkboxes=table.find("input").filter("[name="+$this.attr("name")+"]").not($this);
       checkboxes.each(function(index,item){
         item.checked=$this[0].checked;
       });
       if($this.prop("checked")){
         operate1.data("commodityIds",[]);
         table.data("checkeds",[]);
       }
       checkboxes.each(function(index,item){
         item.checked=$this[0].checked;
         checkbox_choose.call(item);
       });

       console.log(this.checked);
    });

    function checkbox_choose(){
          var $this=$(this);
          var tr=$this.closest('tr');
          var table=$this.closest('table');
          //保存选择队列
          if(!table.data("checkeds")){
            table.data("arr",[]);
            table.data( "checkeds",table.data("arr") );
          }
          if($this[0].checked===true){
            table.data("checkeds").push({status:tr.data("status"),commodityId:tr.data("commodityId")});
          }else{
            var arr=table.data("checkeds");
            for(var i=0;i<arr.length;i++){
              if(arr[i].commodityId == tr.data("commodityId")){
                table.data("checkeds").splice(i,1);
                i--;
              }
            }
          }
          //保存状态队列
          var status_arr=$.map( table.data("checkeds") ,function(item,index){
            return item.status;
          });
          var status_len=status_arr.length;
          var commodityIds;
          if(status_len===0){
            operate1.addClass('disabled');
          }else{
            if( status_arr.join("").split("0").length === (status_len + 1) ){
              //选中的都为在仓库中，可上架
              operate1.removeClass('disabled');
              operate1.text("批量上架");
              commodityIds=$.map( table.data("checkeds") ,function(item,index){
                return item.commodityId;
              });
              operate1.data("commodityIds",commodityIds);
            } else if( status_arr.join("").split("1").length === (status_len + 1)  ){
              //选中的都为已上架，可下架
              operate1.removeClass('disabled');
              operate1.text("批量下架");
              commodityIds=$.map( table.data("checkeds") ,function(item,index){
                return item.commodityId;
              });
              operate1.data("commodityIds",commodityIds);
            }else{
              operate1.addClass('disabled');
            }
          }
          // console.log(table.data("checkeds"));
          console.log(status_arr);
       }
    //单选
    $(document).on("change","tbody input[name=selectAll]",checkbox_choose)

    //批量上/下架
    operate1.on("click",function(){
       var $this=$(this);
       if( !$this.hasClass('disabled') ){
         var idStr=$this.data("commodityIds").join(",");
         if($this.text().indexOf("上架") !== -1){
           _ajax( "static/web/data/action/onshiefCommodity","GET", "" , "json" , {commodityIds: idStr },
                   function(data) {
                       data=toData(data);
                       if(data.success===true || data.success==="true"){
                         modalBody.html("操作成功");
                         operate1.text("批量下架");
                         var tab_pane=$this.closest('.tab-pane');
                         var trs_checked=tab_pane.find(".table-wrap tbody tr").filter(function(){
                           return $(this).find("input")[0].checked;
                         });
                         trs_checked.each(function(index,el){
                           $(el).children('td').last().find("a").eq(1).text("下架");
                         });
                       }else if(data.success===false || data.success==="false"){
                         modalBody.html(data.error);
                       }
                   }
             );
         }else if($this.text().indexOf("下架") !== -1){
           _ajax( "static/web/data/action/offshiefCommodity","GET", "" , "json" , {commodityIds: idStr },

               function(data) {
                   data=toData(data);
                   if(data.success===true || data.success==="true"){
                     modalBody.html("操作成功");
                     operate1.text("批量上架");
                     var tab_pane=$this.closest('.tab-pane');
                     var trs_checked=tab_pane.find(".table-wrap tbody tr").filter(function(){
                       return $(this).find("input")[0].checked;
                     });
                     trs_checked.each(function(index,el){
                       $(el).children('td').last().find("a").eq(1).text("上架");
                     });
                   }else if(data.success===false || data.success==="false"){
                     modalBody.html(data.error);
                   }
               }

             );
         }
       }
    });

  });
</script>

<style>

</style>
