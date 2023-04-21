<template>
    <div>
        <h4 class="page_title">基于 Element Table 进行封装的组件</h4>
        <div class="page_content">
            <base-table-List
                :marginTop="10"
                :list="data.list || []"
                :columns="tableConfig.columns"
                :total="data.amount"
                :pageSize="search.pagesize"
                :hasPagination="tableConfig.hasPagination"
                :options="tableConfig.options"
                :currentPage="search.pageno"
                :showPageTotal="showPageTotal"
                :showAllTotal="showAllTotal"
                :extendsTotalData="data.data || {}"
                @sizeChange="handleSizeChange"
                @currentChange="handleCurrentChange"
                @refresh="refresh"
            >
                <!-- 插槽 -->
                <template v-slot:status="slotData">
                    <el-button type="text" >{{slotData.data.row.status | filterStatus}}</el-button>
                </template>
                
                <!-- 操作 -->
                <template v-slot:operation="slotData">
                    <el-popover ref="operationPop" placement="left-start" popper-class="operate_popper" v-if="!slotData.data.row._isPageTotal">
                        <div class="op_content">
                            <el-button type="text" class="op_content_btn" size="small" >操作一</el-button>
                            <el-button type="text" class="op_content_btn" size="small" >操作二</el-button>
                        </div>
                        <el-button type="text" slot="reference">操作</el-button>
                    </el-popover>
                </template>
            </base-table-list>
        </div>
    </div>
</template>
<script>
import BaseTableList from '@/components/ElTableList'
import Template from "./template";
export default {
    components:{
        BaseTableList
    },
    data(){
        return {
            data: {},
            tableConfig:{
                columns: Template.columns,
                hasPagination: true,
                options:{
                    mutiSelect: true
                }
            },
            showPageTotal: true,
            showAllTotal: true,
            search:{
                pagesize: 10,
                pageno: 1
            }
        }
    },
    created(){
        this.getData()
    },
    filters:{
        filterStatus(status){
            return ['在学', '休学', '结业', '流失', '退费'][status] || ''
        }
    },
    methods:{
        getData(){
            const { pagesize, pageno } = this.search
            this.p_post('/api/tablelist', {
                pagesize,
                pageno
            }).then(res => {
                let data = res || {};
                const list = res.list || []
                data.list = list.slice((pageno-1)*pagesize, pagesize*pageno)
                this.data = data
            })
        },
        handleSizeChange(val){
            this.search.pagesize = val;
            this.handleCurrentChange(1);
        },
        handleCurrentChange(val){
            this.search.pageno = val;
            this.getData();
        },
        refresh(){
            this.getData();
        },
    }
}
</script>
<style lang="scss">
.operate_popper{
    padding: 0 5px;
    min-width: 100px;
    .op_content{
        display: flex;
        flex-direction: column;
        .op_content_btn{
            flex: 1;
            line-height: 24px;
            font-size: 14px;
            color: #606266;
            border-bottom: 1px solid #e5e5e5;
            &:last-child{
                border: 0;
            }
        }
    }
}
</style>