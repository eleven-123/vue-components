<template>
  <div class="block btl_pagination" v-if="pageMessage.totalPage > 0">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageMessage.currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageMessage.pageSize"
       layout="total, prev, pager, next, sizes"
      :total="pageMessage.totalPage"
    >
    </el-pagination>
      <div>
          {{p_exchangeLang('跳至')}}
          <input @keyup="inputChange" class="input" v-model="pageIndex"/>
          {{p_exchangeLang('页')}}
      </div>
  </div>
</template>
<script>
export default {
  methods: {
    handleSizeChange(val) {
      this.pageMessage.pageSize = val;
      this.$emit("getListData");
    },
    handleCurrentChange(val) {
      this.pageMessage.currentPage = val;
      this.$emit("getListData");
    },
    inputChange(val) {
      if (val.key == 'Enter') {
        this.handleCurrentChange(Number(this.pageIndex))
        this.pageIndex = ''
        // top.$('.input').blur()
        // top.mainIframe.window.scrollTo(0, 0);
        return
      }
      this.pageIndex = this.pageIndex.replace(/[^\d]/g, '')
      if (this.pageCount > 0) {
        if (this.pageIndex > this.pageCount) {
          this.pageIndex = this.pageCount
        } else if (this.pageIndex < 1) {
          this.pageIndex = ''
        }
      } else {
        this.pageIndex = ''
      }
    }
  },
  data() {
    return {
      pageIndex:''
    };
  },
  props: {
    pageMessage: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {
    pageCount() {
      return this.pageMessage.totalPage ? Math.ceil(this.pageMessage.totalPage / this.pageMessage.pageSize) : 0
    }
  },
};
</script>
<style lang="scss">
.btl_pagination {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  flex-wrap: wrap;
  .btl_refresh_icon {
    margin: 0 20px;
    font-size: 20px;
    color: #2aba65;
    cursor: pointer;
  }
  padding-right: 20px;
  .el-pagination {
    .el-pager {
      .number {
        border: 1px solid #dadbdf;
        border-radius: 4px;
        margin: 0 5px;
        min-width: 28px;
      }
    }
    .el-pagination__jump {
      display: inline-flex !important;
      .el-input {
        min-width: 50px;
      }
    }
  }
    .input {
        margin: 0 2px;
        width: 50px;
        border-radius: 4px;
        border: 1px solid #DCDFE6;
        box-sizing: border-box;
        color: #606266;
        height: 28px;
        line-height: 28px;
        padding: 0 12px;
    }
}
</style>
