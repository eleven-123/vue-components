<template>
    <div :style="{marginTop: marginTop+'px'}" class="base_table_list_container">
        <div class="el-table base_table">
            <table border="0">
                <!-- 表头 -->
                <thead class="el-table__header-wrapper">
                    <tr>
                        <th class="inputCheck el-table__cell" v-if="options.mutiSelect">
                            <div class="cell">
                                <el-checkbox :value="isAllChecked" @change="selectAll"></el-checkbox>
                            </div>
                        </th>
                        <th class="el-table__cell" v-for="column in columns" :key="column.prop" :style="formatterStyleObj(column)">
                            <div class="cell" :class="sortOrderProp == column.prop ? sortOrderType :''" v-if="column.customHeader"  @click="column.sortable ? sortChange(column) : ''"> {{column.order}}
                                <slot :name="column.slotHeadName" :data="column.label" />
                                <span v-if="column.sortable" class="caret-wrapper" >
                                    <i class="sort-caret ascending"></i>
                                    <i class="sort-caret descending"></i>
                                </span>
                            </div>
                            <div v-else class="cell" :class="sortOrderProp == column.prop ? sortOrderType : ''" @click="column.sortable ? sortChange(column) : ''">{{column.order}}
                                {{column.label}}
                                <span v-if="column.sortable" class="caret-wrapper" >
                                    <i class="sort-caret ascending"></i>
                                    <i class="sort-caret descending"></i>
                                </span>
                                <span v-if="column.sortable" class="sortImg" >
                                    <i class="icon_sort_bottom" v-if="column.sortType == 1"></i>
                                    <i class="icon_sort_top" v-else-if="column.sortType == 2"></i>
                                    <i class="icon_sort" v-else ></i>
                                </span>
                            </div>
                        </th>
                        <!-- 操作列 -->
                        <th class="el-table__cell" v-if="operates && operates.list.length > 0" :style="formatterStyleObj(operates)">
                            <div class="cell">{{'操作'}}</div>
                        </th>
                    </tr>
                </thead>
                <!-- 列表 -->
                <tbody class="el-table__body-wrapper">
                    <tr v-for="(item, index) in list" :key="index">
                        <td v-if="options.mutiSelect" class="el-table__cell inputCheck" >
                            <div class="cell">
                                <el-checkbox v-model="item.isChecked" @change="handleSelectionChange"></el-checkbox>
                            </div>
                        </td>
                        <td class="el-table__cell" :style="formatterStyleObj(column)" v-for="column in columns" :key="column.prop">
                            <div class="cell" v-if="column.columnType === 'slot'">
                                <slot :name="column.slotName" :data="{row:item}" />
                            </div>
                            <div v-else class="cell">
                                <template v-if="!column.render">
                                    <template v-if="column.formatter">
                                        <span
                                            v-html="column.formatter(item, column)"
                                        ></span>
                                    </template>
                                    <template v-else>
                                        <span>{{ item[column.prop] }}</span>
                                    </template>
                                </template>
                                <template v-else>
                                    <expand-dom
                                        :column="column"
                                        :row="item"
                                        :render="column.render"
                                        :index="index"
                                    ></expand-dom>
                                </template>
                            </div>
                        </td>
                        <td class="el-table__cell" v-if="operates && operates.list.length > 0" :style="formatterStyleObj(operates)">
                            <div class="cell">
                                <el-popover
                                    :trigger="operates.trigger"
                                    placement="left-start"
                                    popper-class="btl_operate_popper"
                                >
                                    <el-button class="blue" type="text" slot="reference">{{operates.label}}</el-button>
                                    <template v-for="(btn, key) in operates.list">
                                        <div class="btl_operate_item" v-if="typeof btn.show == 'function' ? btn.show(key, item) : btn.show" :key='btn.id'>
                                            <el-button
                                                v-if="!btn.isPopover"
                                                class="btl_operate_item_btn"
                                                :type="btn.type"
                                                :size="btn.size || 'small'"
                                                :icon="btn.icon"
                                                :disabled="btn.disabled"
                                                :plain="btn.plain"
                                                @click.native.prevent="btn.method(key, item)"
                                            > {{ typeof btn.label == 'function' ? btn.label(key, item): btn.label }}
                                            </el-button>
                                        <el-popover v-else trigger="hover" placement="right">
                                            <div style="display: flex;flex-direction: column;justify-content: center;align-items: center">
                                            <el-button
                                                v-for="(popoverItem, popoverIndex) in  (btn.popoverList || [])" :key="popoverIndex"
                                                style="margin-bottom: 10px"
                                                @click.native.prevent="btn.method(popoverItem, item)"
                                                size="small">
                                                {{popoverItem.label}}
                                            </el-button>
                                            </div>
                                            <el-button slot="reference">{{ btn.label }}</el-button>
                                        </el-popover>
                                        </div>
                                    </template>
                                </el-popover>
                            </div>
                        </td>
                    </tr>
                </tbody>
                <!-- 本页合计、合计 -->
                <tfoot>
                    <tr v-if="isShowPageTotal">
                        <td class="el-table__cell" v-for="(column, index) in columns" :key="column.prop" :colspan="options.mutiSelect && index === 0 ? 2 : 1" :style="formatterStyleObj(column)">
                            <div class="cell" v-if="index===0">{{'本页合计'}}</div>
                            <div class="cell" v-else>{{formatterTotal(column, extendsTotalData[column.pageTotalProp])}}</div>
                        </td>
                    </tr>
                    <tr v-if="isShowAllTotal">
                        <td class="el-table__cell" v-for="(column, index) in columns" :key="column.prop" :colspan="options.mutiSelect && index === 0 ? 2 : 1" :style="formatterStyleObj(column)">
                            <div class="cell" v-if="index===0">{{'合计'}}</div>
                            <div class="cell" v-else>{{formatterTotal(column, extendsTotalData[column.totalProp])}}</div>
                        </td>
                    </tr>
                </tfoot>
            </table>
            <!-- 无数据 -->
            <div class="el-table__empty-block" v-if="list.length < 1">
                <span class="el-table__empty-text">{{'暂无数据'}}</span>
            </div>
        </div>
        <div class="btl_pagination" v-if="hasPagination" :class="paginationclass">
            <Pagination :currentPage="currentPage" :pageSize="pageSize" :pageSizes="pageSizes" :total="total" @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange"></Pagination>
        </div>
    </div>
</template>
<script>
import Pagination from '@/components/Pagination'
export default {
    components: {
        expandDom: {
            functional: true,
            props: {
                row: Object,
                render: Function,
                index: Number,
                column: {
                    type: Object,
                    default: null,
                },
            },
            render: (ele, ctx) => {
                const params = {
                    row: ctx.props.row,
                    index: ctx.props.index,
                };
                if (ctx.props.column) params.column = ctx.props.column;
                return ctx.props.render(ele, params);
            },
        },
        Pagination
    },
    props: {
        list: {
            type: Array,
            default: () => [],
        },
        /*
            columns - 需要展示的列
            prop：列数据对应的属性
            label：列名
            align：对齐方式
            width：列宽
            formatter: 格式化
            columnType: 'slot', 列的类型-插槽
            slotName: 插槽名(Srting)
            sortable: 列是否排序(Boolean)
            pageTotalProp: 本页合计对应的属性
            totalProp: 合计对应的属性
            formatterTotal: 本页合计/合计数据类型：number-数字(默认)、money-金额、percent-百分比(金额)、float-浮点数(金额)、function
        */
        columns: {
            type: Array,
            default: [],
        },
        /***
            operates - 操作按钮组
            list:
                label: 文本
                type :类型（primary / success / warning / danger / info / text），
                show：是否显示
                icon：按钮图标
                plain：是否朴素按钮
                disabled：是否禁用
                method：回调方法
        ***/
        operates: {
            type: Object,
            default: () => {}
        },
        options: {
            type: Object,
            default: () => ({
                stripe: false, // 是否为斑马纹 table
                highlightCurrentRow: false, // 是否要高亮当前行
                mutiSelect: false //是否有选择框
            }),
        }, // table 表格的控制参数

        /* 分页 */
        total:{
            type: Number,
            default: 0
        },
        currentPage:{
            type: Number,
            default: 1
        },
        pageSize:{
            type: Number,
            default: 10
        },
        pageSizes:{
            type: Array,
            default: () => [10, 20, 30, 40]
        },
        selectable:{
            type: Function,
            default: function () {}
        },
        hasPagination:{
            type: Boolean,
            default: true
        },
        marginTop: {
            type: [Number, String],
            default: 20
        },
        maxHeight: {
            type: [Number, String],
            default: 'auto'
        },
        height: {
            type: [Number, String],
            default: 'removeHeight'
        },
        // 默认的排序列
        defaultSort: {
            type: Object,
            default: () => {
                /* 
                 * prop: 'classtime', //列的属性,即 column.prop
                 * order: 'descending' //升序ascending or 降序descending
                */
            }
        },
        paginationclass: {
            type: Object,
            default: () => {}
        },
        stripe:{
            type: Boolean,
            default: true
        },
        showSummaryArr:{ // 合计的字段数组 （接口数据合计）
            type: Array,
            default: () => []
        },
        //是否显示本页合计
        showPageTotal:{
            type: Boolean,
            default: false
        },
        //是否显示合计
        showAllTotal:{
            type: Boolean,
            default: false
        },
        // 本页合计、合计数据
        extendsTotalData:{
            type: Object,
            default: () => {}
        }
    },
    computed:{
        // 是否显示本页合计
        isShowPageTotal() {
            return this.showPageTotal && this.list.length > 0
        },
        // 是否显示合计
        isShowAllTotal() {
            return this.showAllTotal && this.list.length > 0
        },
        // 全选
        isAllChecked(){
            let multipleSelected = this.list.filter(item => item.isChecked)
            return multipleSelected.length > 0
        }
    },
    data() {
        return {
            pageIndex: 1,
            sortOrderType: '', //排序的类型：ascending descending
            sortOrderProp: '', //排序的项
        };
    },
    methods: {
        handleSizeChange(pageSize){
            this.$emit('sizeChange', pageSize)
        },
        handleCurrentChange(currentPage){
            this.$emit('currentChange', currentPage)
        },
        refresh(){
            this.$emit('refresh')
        },
        // 全选
        selectAll(val){
            this.$emit('selectAll', val)
        },
        // 单选
        handleSelectionChange(val){
            this.$emit('handleSelectionChange', val)
        },
        // 排序
        sortChange(val){
            let sortOrders = ['descending', 'ascending'];
            if(this.sortOrderProp !== val.prop){
                this.sortOrderType = ''
                this.sortOrderProp = val.prop
            }
            if(!this.sortOrderType){
                this.sortOrderType = sortOrders[0]
            }else{
                this.sortOrderType = this.sortOrderType === sortOrders[0] ? sortOrders[1] : sortOrders[0]
            }
            let obj = {
                column: val,
                order: this.sortOrderType
            }
            this.$emit('sortChange', obj)
        },
        // 单元格样式
        formatterStyleObj(column){
            let obj = {
                textAlign: column.align || 'left'
            }
            if(column.width && isNaN(column.width)){  //百分比
                obj.width = column.width
            }else{
                if(column.width){
                    obj.minWidth = column.width + 'px'
                }
                if(column.realWidth){
                    obj.width = column.realWidth + 'px'
                }
                obj.maxWidth = (column.realWidth || column.width) + 'px'
            }
            return obj
        },
        // 合计数据-格式化
        formatterTotal(column, data){
            if((this.isShowAllTotal && column.totalProp) || (this.isShowPageTotal && column.pageTotalProp)){
                column.formatterTotal = column.formatterTotal || 'number';
                let type = typeof(column.formatterTotal)
                if(type === 'function'){
                    return column.formatterTotal(data || '222')
                }else{
                    if(column.formatterTotal === 'money'){
                        return this.p_formatMoney(data || 0)
                    }else if(column.formatterTotal === 'percent'){
                        return this.p_showPrice(data || 0) + '%'
                    }else if(column.formatterTotal === 'float'){
                        return this.p_showPrice(data || 0)
                    }else{ // number
                        return data
                    }
                }
            }
        }
    },
    mounted(){
        if(this.defaultSort.prop){
            this.sortOrderProp = this.defaultSort.prop
            this.sortOrderType = this.defaultSort.order
        }
    }
};
</script>
<style lang="scss">
.blue,.blue:hover { color: #0A83FF !important }
.btl_operate_popper{
    min-width: auto;
    padding: 0 !important;
    box-shadow: 1px 1px 5px 0px #aaa;
    .btl_operate_item{
        border-top: 1px solid #ddd;
        &:first-child{
            border: 0;
        }
    }
    .btl_operate_item:hover .el-button{
        color: #333;
        background: #eee;
    }
    .btl_operate_item_btn{
        padding: 0 15px;
        line-height: 40px;
        font-size: 14px;
        border:0
    }
}
.btl_pagination{
    margin-top: 24px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width:100%;
    flex-wrap: wrap;
    .btl_refresh_icon{
        margin: 0 20px;
        font-size: 20px;
        color: #2aba65;
        cursor: pointer;
    }
    padding-right: 20px;
    .el-pagination{
        /*.btn-prev,.btn-next{*/
        /*    border: 1px solid #DADBDF;*/
        /*    border-radius: 4px;*/
        /*    min-width: 28px;*/
        /*}*/
        .el-pager{
            .number{
                border: 1px solid #DADBDF;
                border-radius: 4px;
                margin: 0 5px;
                min-width: 28px;
            }
        }
        .el-pagination__jump{
            display: inline-flex !important;
            .el-input{
                min-width: 50px;
            }
        }
    }
}
.pr0 { padding-right: 0; }

.base_table_list_container{
    overflow-x: hidden;
    table{
        width: 99.9% !important;
    }
.el-table .el-table__body{
    width: 100% !important;
}
.el-table th {
    font-weight: normal;
    color: #666;
    background: #F8F9FB !important
}
// 排序图标
.el-table .sort-caret {
    display: none !important;
}
.el-table .caret-wrapper{
    width: 18px !important;
    height: 36px !important;
    margin-bottom: -15px;
    font-family: 'element-icons' !important;
    &::after {
        content: "";
        width: 8px;
        height: 18px;
        font-weight: 600;
        font-size: 12px;
        color: #eee;
        background: url(~@/assets/image/index/icon_sort.png) no-repeat center;
        background-size: contain;
    }
}
.el-table .ascending .caret-wrapper{
    &::after {
        background: url(~@/assets/image/index/icon_sort_up.png) no-repeat center;
    }
}
.el-table .descending .caret-wrapper{
    &::after {
        background: url(~@/assets/image/index/icon_sort_down.png) no-repeat center;
    }
}
.el-table .el-table__cell .cell{
    word-break: break-word;
}
.el-table .el-table__body-wrapper .cell {
    line-height: 16px;
}

.base_table{
    min-width: 100%;
    overflow-x: auto;
    .el-table__cell{
        min-width: 80px;
        max-width: 120px;
    }
    .el-table__body-wrapper tr:hover {
        background-color: #eee;
    }
}
.inputCheck{
    min-width: auto !important;
    width: 50px !important;
}
}
</style>
