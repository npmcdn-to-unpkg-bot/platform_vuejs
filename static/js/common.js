$(function(){
  /*全局变量*/
    window.myModal=$("#myModal");
    window.modalBody=$(".modal-body",myModal);

 /*全局函数*/
   window._ajax=function (url,type,contentType,dataType,data,done,fail,always){
      if( !$(".mask").length ){
        $("body").append('<div class="mask"></div>');
      }

      $.ajax({
        url: url,
        type:  type || 'GET',
        contentType: contentType || 'application/x-www-form-urlencoded',
        dataType: dataType,
        data: data
      })
      .done( done || function(data) {
          data=toData(data);
          if(data.success===true || data.success==="true"){
            modalBody.html("操作成功");
          }else if(data.success===false || data.success==="false"){
            modalBody.html(data.error);
          }
      })
      .fail( fail || function() {
        modalBody.html("网络错误");
      })
      .always(always || function() {
        $(".mask").remove();
        myModal.modal("show");
      });
   }

   //转换ajax获取的数据
   window.toData=function(data){
      if($.type(data) !== "object" && $.type(data)!== "array" ){
         try{
           data=JSON.parse(data);
         }catch(e){
           modalBody.html("返回数据格式错误");
           $(".mask").remove();
           myModal.modal("show");
           return;
         }
        if( $.type(data) === "object" ){
          data=data.readyState ? JSON.parse( data.responseText ) :data;
        }
      }
      return data;
   }
   //复选框模拟单选功能
   $(document).on("click","input[type=checkbox]",function(e){
     var $this=$(this);
     var td=$this.closest('td');
     var checkboxes=td.find("input[type=checkbox]");
     if(checkboxes.length>=2){
       checkboxes.not($this).prop("checked",false);
       $this.prop("checked",true);
     }
   });

 /*时间转换*/
 window.dateSubmit=function(dateStr){
   dateStr=dateStr.replace(/[-:\/]/g,"");
   var len=dateStr.length;
   if(len<14){
     dateStr=dateStr+( new Array(14-len+1).join("0"));
   }
   return dateStr;
 }
 window.dateReceive=function(dateStr){
   dateStr=dateStr+"";
   var year=dateStr.substr(0,4);
   var month=dateStr.substr(4,2);
   var day=dateStr.substr(6,2);
   var hour=dateStr.substr(8,2);
   var min=dateStr.substr(10,2);
   var sec=dateStr.substr(12,2);
   return {
     timeObj:{
       year:year,
       month:month,
       day:day,
       hour:hour,
       min:min,
       sec:sec
     },
     timeStr:year+"-"+month+"-"+day+" "+hour+":"+min+" "+sec
   }
 }

 /*搜索和分页插件*/

 ;(function($){
     $.fn.extend({
         /*下拉选框装载数据*/
         "ZloadOptions":function(options){
           options=$.extend({
            url:""
           },options);
           var $that=this;
           $that.on("click",function(){
             var $this=$(this);

             $.ajax({
               url: options.url,
               type:   'GET',
               dataType: 'json'
             })
             .done(function(data) {
               data=toData(data);
               if(data.success==true){
                var target_page=$($this.attr("href"));
                var searchs=target_page.find(".search-item");
                 $.each(data.result,function(key,val){
                    var liStr="";
                    $.each(val,function(key2,val2){
                      liStr+='<li data-id="'+val2.id+'">'+val2.text+'</li>';
                    });
                    searchs.filter("[data-sign="+key+"]").nextAll(".dropdown-menu").children('li').each(function(index, el) {
                      if(index>0){
                       $(el).remove();
                      }
                    }).end().append( $(liStr) );
                 });

               }else if(data.success==false){
                 modalBody.html(data.error);
                 myModal.modal("show");
               }
             })
             .fail(function() {
               modalBody.html("获取下拉列表，网络错误");
               myModal.modal("show");
             })
             .always(function() {
               $(".mask").remove();
             });
           });


         },
         /*分页*/
         "Zpage":function(options){
           options=$.extend({
             url:"",
             data:{},
             prefix:'',
             suffix:'',
             array:[],
             showNum:8, //显示的页数
             pageNum:10, //总页数
             rows:10,//一页的行数
             readonly:false,//是否可由只读转为编辑状态，false：不可以，true：可以
             dataFn:function(){ //ajax请求前对数据进行处理的函数

             },
             callback:function(){ //ajax响应后的回调函数

             }
           },options);
           var $that=this;
           // var tab_pane=$that.closest('.tab-pane');

           var lis=$that.find("li");
           var prev=lis.filter(".prev");
           var next=lis.filter(".next");
           var pages=lis.not(prev).not(next);
           var pageNum=options.pageNum;
           var showNum=options.showNum;
           showNum= pageNum < showNum ? pageNum :showNum;
           //最后的页码列表
           var pages_last=pageNum % showNum;
           //倒数第二个页码列表最后的页码
           var _page_last= pages_last ? ( pageNum- pages_last ): 0;

           //避免重复绑定
           $that.off("click","li");
           $that.on("click","li",function(){
             var $this=$(this);
             if($this.hasClass('disabled')){
               return;
             }
             var tbody=$this.closest('.tab-pane').find(".table-wrap table tbody");
             var li_active=pages.filter(".active");
             var curPage= + li_active.text();
             var turnPage;
             //点击后的页面
             pages.removeClass('active');
             if( $this.is(prev) ){
               if(curPage % showNum === 1 ){
                 pages.each(function(index,el){
                   var _$this=$(el);
                   $("a",_$this).text( _$this.text() -showNum );
                   _$this.show();
                 });
                 pages.last().addClass('active');
               }else{
                 li_active.prev().addClass('active');
               }
               turnPage=curPage - 1;
             }else if( $this.is(next)  ){
               if( curPage % showNum === 0 ){
                 //如果下一个页码列表为最后一个
                 if(curPage === _page_last){
                   pages.filter(function(index) {
                     return $(this).index() > pages_last;
                   }).hide();
                 }
                 pages.each(function(index,el){
                   $("a",el).text( (+$(el).text()) + showNum );
                 });
                 pages.first().addClass('active');
               }else{
                 li_active.next().addClass('active');
               }
               turnPage=curPage + 1;
             }else{
               turnPage=+$this.text();
               $this.addClass('active');
             }

             //发送ajax请求
             if(!$this.hasClass('disabled')){
               $.ajax({
                 url: options.url,
                 type: 'GET',
                 dataType: 'json',
                 data: $.extend({page:turnPage , rows:options.rows},options.data)
               })
               .done(function(data) {
                 data=toData(data);
                 if(data.success==true){
                   tbody.prev("thead").find("input[type=checkbox]").prop("checked",false);
                   tbody.empty();
                   $.each(data.result.rows,function(index,item){
                     var tr_cls="",
                     td_attr="";
                     if(options.readonly){
                        tr_cls='class="readonly"';
                        td_attr='contenteditable="true"';
                     }
                     var tr='<tr '+tr_cls+'>'+options.prefix;
                     $.each(options.array,function(index2,item2){
                       tr+='<td '+td_attr+'>'+item[item2]+'</td>';
                     });
                     tr+=options.suffix+'</tr>';
                     //保存数据
                     tr=$(tr).data(item);
                     //具体情况
                     if( item.status==1 ){
                        tr.find(".status").text("下架");
                     }else{
                       tr.find(".status").addClass('waitPutaway');
                     }
                     if( item.logo ){
                        tr.find(".logo").attr("src",item.logo);
                     }

                     tbody.append(tr);
                   })
                   //改变前后一页按钮状态
                   prev.add(next).removeClass('disabled');
                   if(turnPage === 1 ){
                     prev.addClass('disabled');
                   }else if(turnPage === pageNum ){
                     next.addClass('disabled');
                   }
                 }else if(data.success==false){
                   modalBody.html(data.error);
                   myModal.modal("show");
                 }
               })
               .fail(function() {
                 modalBody.html("网络错误");
                 myModal.modal("show");
               })
               .always(function() {

               });
             }
           });
         },
         "Zsearch":function(options){
             options=$.extend({
                 url:"",
                 data:{},
                 prefix:'',
                 suffix:'',
                 showNum:8,
                 array:[],
                 readonly:false,
                 dataFn:function(){

                 },
                 callback:function(){

                 }
             },options);



             var $that=this;

             var tab_pane= $that.closest('.tab-pane');
             var search_result=tab_pane.find(".search-result");
             var table_wrap=search_result.find(".table-wrap");
             var pagination=search_result.find(".pagination");
             var tbody=tab_pane.find("tbody");

             $that.on("click",function(){

                 //清空表格
                 var table=table_wrap.children("table");
                 table.children('thead').find("input[type=checkbox]").prop("checked",false);
                 table.addClass('active').find("tbody").empty();
                 //清空table保存的数据
                 table.removeData();

                 //搜索提交的数据
                 var obj={};
                 var search_items=tab_pane.find(".search-item");
                 search_items.each(function(index, el) {
                   var $this=$(el);
                   if($this.hasClass('form-control')){
                     //如果是日期选择控件，转换日期格式
                     if( $this.attr("type") === "date" ){
                       obj[$this.data("sign")]=dateSubmit( $this.val() );
                     }else{
                       obj[$this.data("sign")]=$this.val();
                     }
                   }else{
                     obj[$this.data("sign")]=$.trim( $this.text() );
                   }
                 });
                 options.data=$.extend( options.data , obj );

                 options.dataFn();

                 console.log(obj);
                  $.ajax({
                    url: options.url,
                    type: 'GET',
                    dataType: 'json',
                    data: options.data
                  })
                  .done(function(data) {
                    data=toData(data);
                    if(data.success==true){
                      var result=data.result;
                      var page_num=result.total;
                      var showNum=page_num < options.showNum ? page_num :options.showNum ;

                      var tr_num=result.rows.length;

                      var lis=pagination.find("li");
                      lis.each(function(index,el){
                       if(index !== 0 && index !== 1 && index !== lis.length-1){
                         $(el).remove();
                       }
                      });
                      lis.removeClass('disabled,active');
                      lis.eq(0).addClass('disabled');
                      lis.eq(1).addClass('active').find("a").text("1");

                      //生成页码
                      //生成分页
                       var page_items=pagination.children("li");
                       for(var i=showNum-1;i>0;i--){
                         $('<li><a href="javascript:;">'+(i+1)+'</a></li>').on("click").insertAfter( page_items.eq(1) );
                       }

                      //为分页应用插件
                      pagination.Zpage($.extend(options,{pageNum:page_num}));

                      tbody.empty();

                      $.each(result.rows,function(index,item){
                        var tr_cls="",
                        td_attr="";
                        if(options.readonly){
                           tr_cls='class="readonly"';
                           td_attr='contenteditable="true"';
                        }
                        var tr='<tr '+tr_cls+'>'+options.prefix;
                        $.each(options.array,function(index2,item2){
                         var td_content=item[item2];
                         if(item2==="time"){
                           td_content= dateReceive(td_content).timeStr;
                         }
                         tr+='<td '+td_attr+'>'+td_content+'</td>';
                        });

                        tr+=options.suffix+'</tr>';
                        //保存数据
                        tr=$(tr).data(item);
                        //具体情况
                        if( item.status==1 ){
                           tr.find(".status").text("下架");
                        }else{
                          tr.find(".status").addClass('waitPutaway');
                        }
                        if( item.logo ){
                           tr.find(".logo").attr("src",item.logo);
                        }
                        if( item.brandSort ){
                           tr.find(".brandSort").find(".dropdown-toggle").html( item.brandSort+'<span class="caret"></span>' );
                        }
                        if( item.audit ){
                           tr.find("input[name=audit]").each(function(index, el) {
                             var $this=$(el);
                             if( $this.parent().index() === +item.audit ){
                               $this.prop("checked",true);
                             }else{
                               $this.prop("checked",false);
                             }
                           });
                        }

                        tbody.append(tr);
                      })
                      search_result.show();
                    }else if(data.success==false){
                      modalBody.html(data.error);
                      myModal.modal("show");
                    }

                  })
                  .fail(function() {
                    modalBody.html("网络错误");
                    myModal.modal("show");
                  })
                  .always(function() {

                  });

             })

         }
     })
 })(jQuery);

 //图片上传预览

 $(document).on("change",".preview input",function() {
     var $file = $(this);
     var fileObj = $file[0];
     var windowURL = window.URL || window.webkitURL;
     var dataURL;
     var $img = $file.siblings("img");

     if(fileObj && fileObj.files && fileObj.files[0]){
         dataURL = windowURL.createObjectURL(fileObj.files[0]);
         $img.attr('src',dataURL);
     }
 });

 //添加新的一行row
 $(".add-btn").on("click",function(){
   var $this=$(this);
   var tab_pane=$this.closest('.tab-pane');
   if( !tab_pane.find(".search-result").is(":visible")){
     return;
   }

   var tr_clone=tab_pane.find("tbody tr").eq(0).clone().removeClass('readonly');
   //重置tr
   tr_clone.children("td").each(function(index, el) {
         var $this=$(el);
         if( $this.has(".logo").length ){
           $this.find("img").removeAttr("src");
         }else if($this.hasClass('controls')){
           $this.find("a").eq(0).text("取消");
           return;
         }else if( $this.has("input[type=checkbox]").length ){
           $this.children('label').each(function(index2, el2) {
                if(index2===0){
                   $( el2 ).children('input').prop("checked",true);
                }else{
                   $( el2 ).children('input').prop("checked",false);
                }
           });
         }else if( $this.text().indexOf("供货商")!==-1 ||  $this.text().indexOf("采购商")!==-1 ){

         }else if( $this.has(".dropdown") ){
           // $this.find(".dropdown-toggle")
         }else{
           $this.html("");
         }
   });
   //预存数据
   tr_clone.data({tel:"",storeName:"",audit:0}).addClass('newTr');
   tab_pane.find("table").prepend(tr_clone);


 });

})
