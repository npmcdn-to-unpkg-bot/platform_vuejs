import Vue from 'vue'
import App from './App'

/* eslint-disable no-new */
new Vue({
  el: 'html',
  components: { App },
  methods:{
    bodyclick:function(){
      console.log(11111);
    }
  }
})

/*原型方法*/

/**
 * trim兼容
 */

//trim的兼容 （IE9+原生支持）
if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };
}

/***全局函数
 *
 * serialize：对象序列化
 * timeToDigit: 将时间转化为14位数字字符串
 * timeFormat: 将14位数值字符串转为对象: timeObj--时间对象 ,timeStr--指定格式时间字符串
 */

//对象序列化
window.serialize=function(obj){
  var str="";
  for(var key in obj){
    str+=key+"="+obj[key]+"&";
  }
  return str.slice(0,-1);
}
//将时间转化为14位数值字符串
window.timeToDigit=function(dateStr){
  dateStr=dateStr.replace(/[^\d]+/g,"");
  var len=dateStr.length;
  if(len<14){
    dateStr=dateStr+( new Array(14-len+1).join("0"));
  }
  return dateStr;
}

/***将14位数值字符串转为对象: timeObj--时间对象 ,timeStr--指定格式时间字符串
 *
 * @params opts(对象): type--输出时间格式  time--需要转换的纯数值字符串（14位）
 */
window.timeFormat=function(opts){
  var type=opts.type;
  var time=opts.time+"";
  //type必须为格式字符串，形似 "yyyy-mm-dd hh:ff:ss"
  type=type.trim();
  //提取分隔符 separators为分隔符数组
  var separators=[];
  separators.push( type.match( /[^ymdhfs]*(?=yyyy)/ ) ? type.match( /[^ymdhfs]*(?=yyyy)/ ).join("") : "" );
  separators.push( type.match( /[^ymdhfs]*(?=mm)/ ) ? type.match( /[^ymdhfs]*(?=mm)/ ).join("") : "" );
  separators.push( type.match( /[^ymdhfs]*(?=dd)/ ) ? type.match( /[^ymdhfs]*(?=dd)/ ).join("") : "" );
  separators.push( type.match( /[^ymdhfs]*(?=hh)/ ) ? type.match( /[^ymdhfs]*(?=hh)/ ).join("") : "" );
  separators.push( type.match( /[^ymdhfs]*(?=ff)/ ) ? type.match( /[^ymdhfs]*(?=ff)/ ).join("") : "" );
  separators.push( type.match( /[^ymdhfs]*(?=ss)/ ) ? type.match( /[^ymdhfs]*(?=ss)/ ).join("") : "" );
  separators.push( type.split("ss")[1] );
  //需要返回的时间单位 units为时间单位字符串
  var units=type.split(/[^a-zA-Z]+/).join("");
  //提取各单位时间
  var year=units.indexOf("y") !== -1 ? time.substr(0,4) : "";
  var month=units.indexOf("m") !== -1 ? time.substr(4,2) : "";
  var day=units.indexOf("d") !== -1 ? time.substr(6,2) : "";
  var hour=units.indexOf("h") !== -1 ? time.substr(8,2) : "";
  var min=units.indexOf("m") !== -1 ? time.substr(10,2) : "";
  var sec=units.indexOf("s") !== -1 ? time.substr(12,2) : "";
  var timeStr=separators[0]+year+separators[1]+month+separators[2]+day+separators[3]+hour+separators[4]+min+separators[5]+sec+separators[6];
  return {
    timeObj:{
      year:year,
      month:month,
      day:day,
      hour:hour,
      min:min,
      sec:sec
    },
    timeStr:timeStr
  }

}
