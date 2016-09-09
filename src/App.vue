<template>
  <!-- 左侧导航栏 -->
  <side-nav :pages.sync="pages" :activepage.sync="activepage"></side-nav>

  <div id="sideNav-content" class="tab-content">
    <!-- 商品管理 ：商品上传 -->
    <commodity-upload :activepage="activepage"></commodity-upload>
    <!-- 商品管理 ：商品编辑 -->
    <commodity-edit :activepage="activepage"></commodity-edit>
    <!-- 订单管理 -->
    <order-manage :activepage="activepage"></order-manage>
    <!-- 商家管理 -->
    <provider-manage :activepage="activepage"></provider-manage>
    <!-- 品牌管理 -->
    <brand-manage :activepage="activepage"></brand-manage>

    <!-- 模态框 -->
    <modal :fade.sync="modal_fade" :show.sync="modal_show" :title.sync="modal_title" :body.sync="modal_body" :footer.sync="modal_footer" ></modal>
  </div>

</template>
<script>
/*组件注册和引用*/
//页面组件
import sideNav from './components/sideNav';
import commodityUpload from "./components/commodityUpload";
import commodityEdit from "./components/commodityEdit";
import orderManage from './components/orderManage';
import providerManage from './components/providerManage';
import brandManage from './components/brandManage';
//功能组件
import modal from './components/thumbs/modal';

export default {
  components: {
    sideNav,commodityUpload,commodityEdit,orderManage,providerManage,brandManage,modal
  },
  data () {
    return{
      //各页面信息
      //有二级菜单的项有open和dropdown属性
      pages:[
              { id:"page1",text:"商品管理",open:false,dropdown:[ {id:"page1_1",text:"商品上传"},{ id:"page1_2",text:"商品编辑" } ] } ,
              { id:"page2",text:"订单管理" } ,
              { id:"page3",text:"商家管理" } ,
              { id:"page4",text:"品牌管理" } ,
              { id:"page5",text:"营销" }
            ],
      //当前显示页的id
      activepage:"page1_1",
      //模态框参数
      modal_fade:"",
      modal_show:"",
      modal_title:"",
      modal_body:"",
      modal_footer:""
    }
  },
  events:{

    'modal-show':function(msg){
      // debugger;
      console.log(msg);
      for(var key in msg){
        this["modal_"+key]=msg[key];
      }
    }

  }
}



</script>

<style lang="scss">
  .page-nav,.page-navs{
    cursor: pointer;
    color:#337ab7;
    &.active{
      background:#337ab7 !important;
      color:#fff !important;
    }
    &:not(.active):hover{
      background:#669fcc !important;
    }
  }
  .dropdown-menu{
    &.show{
      display: block !important;
    }
  }

</style>
