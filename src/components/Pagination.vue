<template>
  <div class="block btl_pagination" v-if="total > 0">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="pageSizes"
      :page-size="pageSize"
       layout="total, prev, pager, next, sizes"
      :total="total"
    >
    </el-pagination>
      <div>
          跳至
          <input @keyup="inputChange" class="input" v-model="pageIndex"/>
          页
      </div>
  </div>
</template>
<script>
export default {
  methods: {
    handleSizeChange(val) {
      this.$emit("handleSizeChange", val)
    },
    handleCurrentChange(val) {
      this.$emit("handleCurrentChange", val)
    },
    inputChange(val) {
      if (val.key == 'Enter') {
        this.handleCurrentChange(Number(this.pageIndex))
        this.pageIndex = ''
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
    currentPage: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    pageSizes: {
      type: Array,
      default: [10, 20, 50, 100]
    },
    total: {
      type: Number,
      default: 0
    },
  },
  computed: {
    pageCount() {
      return this.total ? Math.ceil(this.total / this.pageSize) : 0
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
