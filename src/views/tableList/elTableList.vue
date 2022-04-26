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
                :currentPage="search.pageno"
                :showPageTotal="true"
                :showAllTotal="true"
                :extendsTotalData="data.data || {}"
                @sizeChange="handleSizeChange"
                @currentChange="handleCurrentChange"
                @refresh="refresh"
            ></base-table-list>
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
    methods:{
        getData(){

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