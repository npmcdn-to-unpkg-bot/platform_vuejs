$(function () {
 /*商品编辑*/

 //下拉菜单模拟下拉选框
   

   // '<td><div class="preview"><input type="file" name="logo"><img src="" alt="logo"></div></td>'
   // '<td><label><input type="radio" name="audit">未审核</label>&nbsp;<label><input type="radio" name="audit">已审核</label></td>'
   // '<td><a href="javascript:;" class="controls">编辑</a><a href="javascript:;" class="controls">确认</a></td>'

   //订单管理
      //下拉框装载选项数据

   $(".search-btn","#page2").Zsearch({
      url:'/web/data/action/orderSearch',
      array:["provider","orderNo","money","orderStatus","buyer","time","code"]
   });

   //商家管理
   $(".search-btn","#page3").Zsearch({
      url:'/web/data/action/providerSearch',
      prefix:'<td><div class="preview"><input type="file" name="logo"><img alt="logo" class="logo"></div></td>',
      suffix:'<td><label><input type="checkbox" name="audit" checked="checked">未审核</label>&nbsp;<label><input type="checkbox" name="audit">已审核</label></td>'+'<td class="controls"><a href="javascript:;" class="control-item">编辑</a>&nbsp;&nbsp;<a href="javascript:;" class="control-item">确认</a></td>',
      array:["storeName","company","tel"],
      readonly:true,
      dataFn:function(){
        //this为options对象
        var data=this.data;
        if(data.company==="供货商"){
          this.url="/web/data/action/searchProvider";
        }else if(data.company==="采购商"){
          this.url="/web/data/action/searchPurchaser";
        }

      }
   });

      //编辑和确认(品牌管理同)
      $("#page3,#page4").on("click",".control-item",function(){
          var $this=$(this);
          var tab_pane=$this.closest('.tab-pane');
          var tab_pane_id=tab_pane.attr("id");
          var tr=$this.closest('tr');
          var oldData=tr.data();

          if($this.text()==="编辑"){
              tr.removeClass('readonly');
              $this.text("取消");
          }else if($this.text()==="取消"){
            if(tr.hasClass('newTr')){
              tr.remove();
            }else{
              tr.addClass('readonly');
              $this.text("编辑");
              if(tab_pane_id=="page3"){
                tr.children('td').each(function(index, el) {
                    switch(index){
                      case 0:
                        $(el).find("img").attr("src",oldData.logo);
                        $(el).find("input").val("");
                        break;
                      case 1:
                        $(el).text(oldData.storeName);
                        break;
                      case 3:
                        $(el).text(oldData.tel);
                        break;
                      case 4:
                        $(el).find("input").each(function(index, el) {
                          if(index==oldData.audit){
                            el.checked=true;
                          }else{
                            el.checked=false;
                          }
                        });
                        break;
                    }
                });
              }

            }
          }else if($this.text()==="确认"){
            var obj={};
            var company="";
            var logoChange=false;
            if(tab_pane_id=="page3"){
              tr.find("td").not(".controls").each(function(index, el) {
                var $this=$(el);
                if(index===0){
                  if( $this.find("input").val() ){
                    logoChange=true;
                  }
                }else if(index===1){
                  if( $this.text() !== oldData.storeName){
                    obj.storeName=$this.text();
                  }
                }else if(index===2){
                    company=$this.text();
                }else if(index===3){
                  if( $this.text() !== oldData.tel ){
                    obj.tel=$this.text();
                  }
                }else if(index===4){
                  var audit=$this.find("input").filter(":checked").parent().index();
                  if( audit !== oldData.audit){
                    obj.audit=audit;
                  }
                }
              });
            }else if(tab_pane_id=="page4"){

              tr.find("td").not(".controls").each(function(index, el) {
                var $this=$(el);
                if(index===0){
                  if( $this.find("input").val() ){
                    logoChange=true;
                  }
                }else if(index===1){
                  if( $this.text() !== oldData.brandName){
                    obj.brandName=$this.text();
                  }
                }else if(index===2){
                  var td_sort=$.trim( $this.find(".dropdown-toggle").text() );
                  if( td_sort !== $.trim(oldData.brandSort) ){
                    obj.brandSort=td_sort;
                  }
                }
              });

            }

            //判断是否有修改
            if( $.isEmptyObject( obj ) && logoChange == false){
              modalBody.html("没有修改，请修改后再确认提交");
              myModal.modal("show");
              return;
            }else if(tab_pane_id=="page3"){
              if(oldData.providerId){
                obj.providerId=oldData.providerId;
              }
              obj.company=company;
            }else if(tab_pane_id=="page4"){
              obj.brandId=oldData.brandId;
            }

            //遮罩层
            if( !$(".mask").length ){
              $("body").append('<div class="mask"></div>');
            }
            //原生ajax
            var xhr = new XMLHttpRequest();
            //发送完成并成功事件
            xhr.onload = function() {
                data=toData(xhr.responseText);
                if (data.success == true) {
                    //模态框提示
                    modalBody.html("发布成功");
                    myModal.modal("show");
                    $this.siblings('.control-item').text("编辑");
                    tr.addClass('readonly');
                } else if(data.success == false){
                    //模态框提示
                    modalBody.html(data.error);
                    myModal.modal("show");
                }
                $(".mask").remove();
            };
            //提交失败事件
            xhr.onerror = function() {
                //模态框提示
                modalBody.html("网络错误");
                myModal.modal("show");
                $(".mask").remove();
            };
            //post方式提交，异步
            var requestUrl="";

            //新增行
            if( tr.hasClass('newTr') ){
              if(tab_pane_id=="page3"){
                if($.trim( obj.company) ==="供货商" ){
                  requestUrl="/web/data/action/addProvider";
                  // xhr.open('post', '/web/data/action/addProvider', true);
                }else{
                  requestUrl="/web/data/action/addPurchaser";
                }
              }else if(tab_pane_id=="page4"){
                requestUrl="";
              }
            }
            //非新增行
            else{
              if(tab_pane_id=="page3"){
                if($.trim( obj.company) ==="供货商" ){
                  requestUrl="/web/data/action/modProvider";
                }else{
                  requestUrl="/web/data/action/modPurchaser";
                }
              }else if(tab_pane_id=="page4"){
                requestUrl="";
              }
            }
            xhr.open('post', requestUrl , true);
            //设置头部信息（post方式必须）
            xhr.setRequestHeader('X-Request-With', 'XMLHttpRequest');
            //获取files对象
            var filesObj = tr.find("input[type=file]")[0].files;
            // //通过FormData来构建提交文件数据
            var formData = new FormData();
            //调用 append(name，value) 方法并传入相应的 File 对象作为参数(假设只有一个上传文件)
            if(filesObj[0]){
              formData.append("file", filesObj[0]);
            }
            for (var key in obj) {
                formData.append(key, obj[key]);
            }
            //将formData作为参数调用send()方法
            xhr.send(formData);

          }
      });

      //品牌管理
      $(".search-btn","#page4").Zsearch({
         url:'/web/data/action/brandSearch',
         prefix:'<td><div class="preview"><input type="file" name="logo"><img alt="logo" class="logo"></div></td>',
         suffix:'<td class="brandSort"><div class="dropdown pull-left"><button class="btn btn-default dropdown-toggle" data-sign="brandSort" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">文胸<span class="caret"></span></button><ul class="dropdown-menu"><li>文胸</li><li>未审核</li><li>已审核</li></ul></div></td>'
         +'<td class="controls"><a href="javascript:;" class="control-item">编辑</a>&nbsp;&nbsp;<a href="javascript:;" class="control-item">确认</a></td>',
         array:["brandName"],
         readonly:true,
         dataFn:function(){
           //this为options对象
           // var data=this.data;
           // if(data.company==="供货商"){
           //   this.url="/web/data/action/searchProvider";
           // }else if(data.company==="采购商"){
           //   this.url="/web/data/action/searchPurchaser";
           // }
         }
      });


});
