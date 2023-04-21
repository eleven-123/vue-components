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
                :options="tableConfig.options"
                @sizeChange="handleSizeChange"
                @currentChange="handleCurrentChange"
                @refresh="refresh"
                @sortChange="sortChange"
                @selectAll="selectAll"
                @handleSelectionChange="handleSelectionChange"
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
                defaultSort: {prop: 'nodeNum', order: 'descending'},
                options:{
                    mutiSelect: true
                }
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
    computed:{
        // 多行选中
        multipleSelection(){
            let multipleSelected = this.data.list.filter(item => item.isChecked)
            return multipleSelected
        }
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
                
                if(this.tableConfig.options.mutiSelect){
                   data.list.forEach(item => item.isChecked = false) 
                }
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
        },
        selectAll(val){
            this.data.list.forEach(item => item.isChecked = val)
            console.log('选中的行===', this.multipleSelection)
        },
        handleSelectionChange(){
            console.log('选中的行===', this.multipleSelection)
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