<template>
  <!-- 左侧导航栏 -->
  <side-nav :pages="pages"></side-nav>

  <div id="sideNav-content" class="tab-content">
    <!-- 商品管理 -->
    <commodity-manage></commodity-manage>
    <!-- 订单管理 -->
    <order-manage></order-manage>
    <!-- 商家管理 -->
    <provider-manage></provider-manage>
    <!-- 品牌管理 -->
    <brand-manage></brand-manage>
    <!-- bootstrap模态框 -->
    <div class="modal fade" id="myModal" tabindex="-1" role="dialog"
       aria-labelledby="myModalLabel" aria-hidden="true">
       <div class="modal-dialog">
          <div class="modal-content">
             <div class="modal-header">
                <button type="button" class="close"
                   data-dismiss="modal" aria-hidden="true">
                      &times;
                </button>
                <h4 class="modal-title" id="myModalLabel">
                   提交状态
                </h4>
             </div>
             <div class="modal-body">
             </div>
             <div class="modal-footer">
                <button type="button" class="btn btn-default"
                   data-dismiss="modal">确认
                </button>
             </div>
          </div>
        </div>
    </div>

  </div>

</template>

<script>
//组件注册和引用
import sideNav from './components/sideNav';
import commodityManage from './components/commodityManage';
import orderManage from './components/orderManage';
import providerManage from './components/providerManage';
import brandManage from './components/brandManage';
export default {
  components: {
    sideNav,commodityManage,orderManage,providerManage,brandManage
  },
  data () {
    return{
      pages:[
              { id:"page1",text:"商品管理",dropdown:[ {id:"page1_1",text:"商品上传"},{ id:"page1_2",text:"商品编辑" } ] } ,
              { id:"page2",text:"订单管理" } ,
              { id:"page3",text:"商家管理" } ,
              { id:"page4",text:"品牌管理" } ,
              { id:"page5",text:"营销" }
            ]
    }
  }
}
//当前组件脚本
$(function(){


});
</script>

<style>

</style>
