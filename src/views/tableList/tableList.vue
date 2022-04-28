<template>
    <div>
        <h4 class="page_title">基于 Table 进行封装的组件</h4>
        <div class="page_content">
            <base-table-List
                :marginTop="10"
                :list="data.list || []"
                :columns="tableConfig.columns"
                :total="data.amount"
                :pageSize="search.pagesize"
                :hasPagination="tableConfig.hasPagination"
                :defaultSort="tableConfig.defaultSort"
                :currentPage="search.pageno"
                :showPageTotal="true"
                :showAllTotal="true"
                :extendsTotalData="data.data || {}"
                @sizeChange="handleSizeChange"
                @currentChange="handleCurrentChange"
                @refresh="refresh"
                @sortChange="sortChange"
            >
                <!-- 插槽 -->
                <template v-slot:status="slotData">
                    <el-button type="text">{{slotData.data.row.status | filterStatus}}</el-button>
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
import BaseTableList from '@/components/BaseTableList'
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
                defaultSort: {prop: 'nodeNum', order: 'descending'}
            },
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
            this.p_post('/api/tablelist.json').then(res => {
                let data = res || {};
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
        sortChange(val){
            console.log(val)
        }
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
            margin: 0;
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