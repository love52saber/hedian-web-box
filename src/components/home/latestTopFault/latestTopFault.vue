<style lang="less">
.g_latest_top_fault {
  .ivu-card-body {
    padding: 10px;
  }
  .m_top_fault_list {
    list-style: none;
    height: 200px;
    li.u_top_fault_item {
      height: 34px;
      line-height: 34px;
      margin-bottom: 8px;
      background: #0b5f61;
      letter-spacing: 0;
      .cell {
        display: inline-block;
        width: 20%;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        &:nth-child(2) {
          width: 50%;
        }
        &:nth-child(3) {
          width: 30%;
        }
      }
    }
    .nodata {
      text-align: center;
      height: 100%;
    }
  }
}
</style>

<template>
  <info-card class="g_latest_top_fault" title="最新TOP故障">
    <span slot="extra" @click.stop='toMore' style="cursor:pointer">更多</span>
    <ul class="m_top_fault_list">
      <li class="nodata" v-if="data.length === 0">没有故障数据</li>
      <li v-for="(item,index) in data" :key="index + '-' +item.resAbnormalId" :title="item.resAbnormaldesc" class="u_top_fault_item">
        <div class="cell" :title="item.resAbnormaldesc">
          <Tag :color="item.resAbnormallevel.resAbnormallevelColor" v-text="item.resAbnormallevel.resAbnormallevelName"></Tag>
        </div>
        <div class="cell"> {{item.resAbnomaltime|formatTime}}</div>
        <div class="cell" :title="item.resAbnormalName" v-text="item.resAbnormalName"></div>
      </li>
    </ul>
  </info-card>
</template>
<script>
import InfoCard from '_c/card'
export default {
  name: 'LatestTopFault',
  components: {
    InfoCard
  },
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    toMore () {
      alert('你点击了更多按钮')
    }
  }
}
</script>
