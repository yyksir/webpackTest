<template>
    <div>
        <div id="box">
            {{data1}}
        </div>
        <button>111111</button>
    </div>
</template>
<script>
export default {
    name:'home',
    data() {
        return {
            data1:'开发'
        }
    }
}
</script>
<style lang="less" scoped>
#box{
    height: 100%;
    width: 100%;
    background: red;
}
</style>