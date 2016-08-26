<template>
  <div class="tab-pane fade in active" id="page1_1">
    <div class="pull-left">
      <input type="text" id="fileName" class="pull-left">
    </div>
    <div class="btn-group pull-right">
      <button type="button" class="btn btn-primary">选择文件<input type="file" name="xlfile" id="xlf" /> </button>
      <button type="button" id="upload-file" class="btn btn-default">上传</button>
    </div>
    <div class="clearfix"></div>
    <div id="out" class="table-responsive"></div>
    <br/>
  </div>
</template>

<script>
  // export default {
  //   data () {
  //     return {
  //       // note: changing this line won't causes changes
  //       // with hot-reload because the reloaded component
  //       // preserves its current state and we are modifying
  //       // its initial state.
  //       msg: 'Hello World!'
  //     }
  //   }
  // }
  // debugger;
  // console.log( $("#myModal") instanceof jQuery);
  $(function(){
    var fileNameJq=$("#fileName");
    //显示文件名
    $("#xlf").on("change",function(){
       $("#out").empty();
      var $this=$(this);
      var _this=this;
      //获取文件名
      var fileName=_this.files[0].name;
      var index=fileName.lastIndexOf(".");
      fileName=fileName.substring(0,index);
      fileNameJq.val(fileName);

    });

    //导入excel
    var X = XLSX;
    var XW = {
        /* worker message */
        msg: 'xlsx',
        /* worker scripts */
        rABS: 'static/js/excel/xlsxworker2.js', //根目录下的路径
        norABS: 'static/js/excel/xlsxworker1.js',
        noxfer: 'static/js/excel/xlsxworker.js'
    };

    var rABS = typeof FileReader !== "undefined" && typeof FileReader.prototype !== "undefined" && typeof FileReader.prototype.readAsBinaryString !== "undefined";
    var use_worker = typeof Worker !== 'undefined';
    var transferable = use_worker;
    var wtf_mode = false;
    function fixdata(data) {
        var o = "",
            l = 0,
            w = 10240;
        for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
        o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
        return o;
    }

    function ab2str(data) {
        var o = "",
            l = 0,
            w = 10240;
        for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint16Array(data.slice(l * w, l * w + w)));
        o += String.fromCharCode.apply(null, new Uint16Array(data.slice(l * w)));
        return o;
    }

    function s2ab(s) {
        var b = new ArrayBuffer(s.length * 2),
            v = new Uint16Array(b);
        for (var i = 0; i != s.length; ++i) v[i] = s.charCodeAt(i);
        return [v, b];
    }

    function xw_noxfer(data, cb) {
        var worker = new Worker(XW.noxfer);
        worker.onmessage = function(e) {
            switch (e.data.t) {
                case 'ready':
                    break;
                case 'e':
                    console.error(e.data.d);
                    break;
                case XW.msg:
                    cb(JSON.parse(e.data.d));
                    break;
            }
        };
        var arr = rABS ? data : btoa(fixdata(data));
        worker.postMessage({
            d: arr,
            b: rABS
        });
    }

    function xw_xfer(data, cb) {
        var worker = new Worker(rABS ? XW.rABS : XW.norABS);
        worker.onmessage = function(e) {
            switch (e.data.t) {
                case 'ready':
                    break;
                case 'e':
                    console.error(e.data.d);
                    break;
                default:
                    var xx = ab2str(e.data).replace(/\n/g, "\\n").replace(/\r/g, "\\r");
                    console.log("done");
                    cb(JSON.parse(xx));
                    break;
            }
        };
        if (rABS) {
            var val = s2ab(data);
            worker.postMessage(val[1], [val[1]]);
        } else {
            worker.postMessage(data, [data]);
        }
    }

    function xw(data, cb) {
        transferable = true;
        if (transferable) xw_xfer(data, cb);
        else xw_noxfer(data, cb);
    }

    function get_radio_value(radioName) {
        var radios = document.getElementsByName(radioName);
        for (var i = 0; i < radios.length; i++) {
            if (radios[i].checked || radios.length === 1) {
                return radios[i].value;
            }
        }
    }

    function to_json(workbook) {
        var result = {};
        workbook.SheetNames.forEach(function(sheetName) {
            var roa = X.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
            if (roa.length > 0) {
                result[sheetName] = roa;
            }
        });
        return result;
    }

    function to_csv(workbook) {
        var result = [];
        workbook.SheetNames.forEach(function(sheetName) {
            var csv = X.utils.sheet_to_csv(workbook.Sheets[sheetName]);
            if (csv.length > 0) {
                result.push("SHEET:" + sheetName);
                // result.push("");
                result.push(csv);
            }
        });
        return result.join("__;__");
    }

    function to_formulae(workbook) {
        var result = [];
        workbook.SheetNames.forEach(function(sheetName) {
            var formulae = X.utils.get_formulae(workbook.Sheets[sheetName]);
            if (formulae.length > 0) {
                result.push("SHEET:" + sheetName);
                result.push("");
                result.push(formulae.join("\n"));
            }
        });
        return result.join("\n");
    }

    var tarea = document.getElementById('b64data');

    function b64it() {
        if (typeof console !== 'undefined') console.log("onload", new Date());
        var wb = X.read(tarea.value, {
            type: 'base64',
            WTF: wtf_mode
        });
        process_wb(wb);
    }

    function process_wb(wb) {
        var output = "";
        switch (get_radio_value("format")) {
            case "json":
                output = JSON.stringify(to_json(wb), 2, 2);
                break;
            case "form":
                output = to_formulae(wb);
                break;
            default:
                output = to_csv(wb);
        }
        //转换output格式
        //单元行用"__;__"分隔
        //单元格用"__&__"

        //表与表之间用“SHEET:”区分
        //tables[0]为空
        console.log(output);
        var tables=output.split("SHEET:");
        var tables_arr=new Array(tables.length-1);
        var row;
        for(var i=0,len=tables.length-1;i<len;i++){
         tables_arr[i]={};
         row=tables[i+1].split("__;__");
         for(var j=0,len2=row.length;j<len2;j++){
             row[j]=row[j].split("__&__");
         }
         tables_arr[i].title=row[0].join("");
         row.splice(0,1);
         if(i!==len-1){
             row.splice(row.length-2,2);
         }else{
             row.splice(row.length-1,1);
         }
         tables_arr[i].row=row;
        }
        row=null;
        tables=null;
        var cols=0;
        tables_arr.forEach(function(item,index,arr){
         //item为表
         var thead="",tbody="";
         item.row.forEach(function(item2,index2,arr2){
             //item2为行
             if(index2===0){
                 thead+="<tr>";
                 item2.forEach(function(item3,index3,arr3){
                     //item3为单元格
                     if(cols===0 && item3===""){
                         cols=index3;
                     }else if(cols===0){
                         thead+='<td>'+item3+'</td>';
                     }
                 });
                    cols= cols===0 ? item2.length : cols;
                 thead+="</tr>";
             }else{
                    if(item2[0] !==""){
                     tbody+="<tr>";
                     for(var i=0;i<cols;i++){
                         tbody+='<td contenteditable="true">'+item2[i]+'</td>';
                     }
                     tbody+="</tr>";
                    }
             }
         });
         var _table=$('<table class="table table-bordered">'+
             '<caption>'+item.title+'</caption>'+
             '<thead>'+thead+'</thead>'+
             '<tbody>'+tbody+'</tbody>'+
             '</table>');
         $("#out").append(_table);
        });

        if (typeof console !== 'undefined') console.log("output", new Date());
    }

    var drop = document.getElementById('drop');

    function handleDrop(e) {
        e.stopPropagation();
        e.preventDefault();
        rABS = true;
        use_worker = true;
        var files = e.dataTransfer.files;
        var f = files[0]; {
            var reader = new FileReader();
            var name = f.name;
            reader.onload = function(e) {
                if (typeof console !== 'undefined') console.log("onload", new Date(), rABS, use_worker);
                var data = e.target.result;
                if (use_worker) {
                    xw(data, process_wb);
                } else {
                    var wb;
                    if (rABS) {
                        wb = X.read(data, {
                            type: 'binary'
                        });
                    } else {
                        var arr = fixdata(data);
                        wb = X.read(btoa(arr), {
                            type: 'base64'
                        });
                    }
                    process_wb(wb);
                }
            };
            if (rABS) reader.readAsBinaryString(f);
            else reader.readAsArrayBuffer(f);
        }
    }

    function handleDragover(e) {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    }

    var xlf = document.getElementById('xlf');

    function handleFile(e) {
        rABS = true;
        use_worker = true;
        var files = e.target.files;
        var f = files[0]; {
            var reader = new FileReader();
            var name = f.name;
            reader.onload = function(e) {
                if (typeof console !== 'undefined') console.log("onload", new Date(), rABS, use_worker);
                var data = e.target.result;
                if (use_worker) {
                    xw(data, process_wb);
                } else {
                    var wb;
                    if (rABS) {
                        wb = X.read(data, {
                            type: 'binary'
                        });
                    } else {
                        var arr = fixdata(data);
                        wb = X.read(btoa(arr), {
                            type: 'base64'
                        });
                    }
                    process_wb(wb);
                }
            };
            if (rABS) reader.readAsBinaryString(f);
            else reader.readAsArrayBuffer(f);
        }
    }

    if (xlf.addEventListener) xlf.addEventListener('change', handleFile, false);

  /*商品上传*/
    //上传文件数据
    var out=$("#out");
    var tableJson={};
    $("#upload-file").on("click",function(e){
      var fileJson=[];
      tableJson.data=fileJson;
      var fileName=fileNameJq.val();
      tableJson.fileName=fileName;
      out.children(".table").each(function(index,item){
          var $item=$(item);
          fileJson.push({});
          fileJson[index].title=$item.children("caption").text();
          fileJson[index].thead=[];
          $item.children("thead").find("tr td").each(function(index2,item2){
              fileJson[index].thead.push( $(item2).text() );
          });
          fileJson[index].tbody=[];
          console.log($item.children("tbody").find("tr").length);
          $item.children("tbody").find("tr").each(function(index2,item2){
              var arr_tmp=[];
              $(item2).find("td").each(function(index3,item3){
                  arr_tmp.push( $(item3).text() );
              });
              fileJson[index].tbody.push( arr_tmp );
              arr_tmp=null;
          });
      });

      console.log( JSON.stringify(tableJson) );
      //excel读取成功才发送数据
      if(tableJson.data.length){
         _ajax('/web/data/action/uploadCommodity','POST','application/json;charset=utf-8','json',encodeURI( JSON.stringify(tableJson) ),function (data){
           if( $.type(data) !== "object" ){
             data=JSON.parse(data);
           }
           if(data.success+"" === "true"){
             _ajax('/web/data/action/checkUploadCommodity','GET','','json',{fileName:tableJson.fileName},test,"",function(){});
           }else if(data.success+"" === "false"){
             modalBody.html(data.message);
           }

           function test(data){
             if(data.success+"" === "true"){
                 if(data.message==="wating"){
                   setTimeout(function(){
                     _ajax( '/web/data/action/checkUploadCommodity','GET','','json',{fileName:tableJson.fileName},test,"",function(){} );
                   },2000);
                 }else if(data.message === "ok"){
                   modalBody.html("操作成功");
                   $(".mask").remove();
                   myModal.modal("show");
                   $("#out").empty();
                 }else{
                   modalBody.html(data.message);
                   $(".mask").remove();
                   myModal.modal("show");
                 }
             }
           }
         } , "",function(){} );
      }

    });
    
  })
</script>

<style>

</style>
