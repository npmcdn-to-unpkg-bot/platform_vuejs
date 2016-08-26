<template>
  <!-- 商品上传 -->
  <commodity-upload></commodity-upload>
  <!-- 商品编辑 -->
  <commodity-edit></commodity-edit>
</template>

<script>
  import commodityUpload from "./commodityUpload";
  import commodityEdit from "./commodityEdit";
  export default {
    components: {
      commodityUpload,commodityEdit
    }
  }

</script>

<style>

</style>
