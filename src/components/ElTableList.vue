<template>
    <div
        :style="{ marginTop: marginTop + 'px' }"
        class="base_table_list_container"
    >
        <el-table
            :data="list"
            :default-sort="defaultSort"
            :header-cell-style="{
                background: '#eee',
                color: '#666',
                fontWeight: 'normal',
            }"
            :height="height === 'removeHeight' ? null : height"
            :maxHeight="maxHeight"
            :stripe="stripe"
            :show-summary="showAllTotal || showPageTotal && list.length > 0"
            :summary-method="(showAllTotal || showPageTotal && list.length > 0) ? getSummaries : null"
            @select-all="selectAll"
            @selection-change="handleSelectionChange"
            @sort-change="sortChange"
            ref="table"
        >
            <!--region 选择框-->
            <el-table-column
                v-if="options.mutiSelect"
                type="selection"
                width="50"
            ></el-table-column>
            <!-- 数据列 -->
            <template v-for="(column, index) in columns">
                <el-table-column
                    v-if="column.columnType === 'slot'"
                    :prop="column.prop"
                    :key="column.prop"
                    :label="column.label"
                    :align="column.align"
                    :min-width="column.width"
                    :width="column.realWidth"
                >
                    <template slot="header" slot-scope="scope">
                        <template v-if="column.customHeader">
                            <slot
                                :name="column.slotHeadName"
                                :data="column.label"
                            />
                        </template>
                        <template v-else>
                            <span>{{ column.label }}</span>
                        </template>
                    </template>
                    <template slot-scope="scope">
                        <slot :name="column.slotName" :data="scope" />
                    </template>
                </el-table-column>
                <el-table-column
                    v-else
                    :prop="column.prop"
                    :key="column.prop"
                    :label="column.label"
                    :align="column.align"
                    :min-width="column.width"
                    :width="column.realWidth"
                    :sortable="column.sortable"
                    :sort-orders="column.sortOrders"
                >
                    <template slot="header" slot-scope="scope">
                        <template v-if="column.customHeader">
                            <slot
                                :name="column.slotHeadName"
                                :data="column.label"
                            />
                        </template>
                        <template v-else>
                            <span>{{ column.label }}</span>
                        </template>
                    </template>
                    <template slot-scope="scope">
                        <template v-if="!column.render">
                            <template v-if="column.formatter">
                                <span
                                    v-html="column.formatter(scope.row, column)"
                                ></span>
                            </template>
                            <template v-else>
                                <span>{{ scope.row[column.prop] }}</span>
                            </template>
                        </template>
                        <template v-else>
                            <expand-dom
                                :column="column"
                                :row="scope.row"
                                :render="column.render"
                                :index="index"
                            ></expand-dom>
                        </template>
                    </template>
                </el-table-column>
            </template>
            <!-- 按钮操作组 -->
            <el-table-column
                :label="operates.label"
                :align="operates.align"
                :min-width="operates.width"
                :width="operates.realWidth"
                :fixed="operates.fixed"
                v-if="operates && operates.list.length > 0"
            >
                <template slot-scope="scope">
                    <el-popover
                        :trigger="operates.trigger"
                        placement="left-start"
                        popper-class="btl_operate_popper"
                    >
                        <el-button class="blue" type="text" slot="reference">{{
                            operates.label
                        }}</el-button>
                        <template v-for="(btn, key) in operates.list">
                            <div
                                class="btl_operate_item"
                                v-if="
                                    typeof btn.show == 'function'
                                        ? btn.show(key, scope.row)
                                        : btn.show
                                "
                                :key="btn.id"
                            >
                                <el-button
                                    v-if="!btn.isPopover"
                                    class="btl_operate_item_btn"
                                    :type="btn.type"
                                    :size="btn.size || 'small'"
                                    :icon="btn.icon"
                                    :disabled="btn.disabled"
                                    :plain="btn.plain"
                                    @click.native.prevent="
                                        btn.method(key, scope.row)
                                    "
                                >
                                    {{
                                        typeof btn.label == "function"
                                            ? btn.label(key, scope.row)
                                            : btn.label
                                    }}
                                </el-button>
                                <el-popover
                                    v-else
                                    trigger="hover"
                                    placement="right"
                                >
                                    <div
                                        style="
                                            display: flex;
                                            flex-direction: column;
                                            justify-content: center;
                                            align-items: center;
                                        "
                                    >
                                        <el-button
                                            v-for="(
                                                popoverItem, popoverIndex
                                            ) in btn.popoverList || []"
                                            :key="popoverIndex"
                                            style="margin-bottom: 10px"
                                            @click.native.prevent="
                                                btn.method(
                                                    popoverItem,
                                                    scope.row
                                                )
                                            "
                                            size="small"
                                        >
                                            {{ popoverItem.label }}
                                        </el-button>
                                    </div>
                                    <el-button slot="reference">{{
                                        btn.label
                                    }}</el-button>
                                </el-popover>
                            </div>
                        </template>
                    </el-popover>
                </template>
            </el-table-column>
        </el-table>
        <div
            class="btl_pagination"
            v-if="hasPagination"
            :class="paginationclass"
        >
            <Pagination 
                :currentPage="currentPage"
                :pageSize="pageSize"
                :pageSizes="pageSizes"
                :total="total"
                @handleCurrentChange="handleCurrentChange"
                @handleSizeChange="handleSizeChange"
            ></Pagination>
        </div>
    </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import { removeResizeListener } from "element-ui/src/utils/resize-event";

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
        Pagination,
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
            default: () => {},
        },
        options: {
            type: Object,
            default: () => ({
                stripe: false, // 是否为斑马纹 table
                highlightCurrentRow: false, // 是否要高亮当前行
                mutiSelect: false, //是否有选择框
            }),
        }, // table 表格的控制参数

        /* 分页 */
        total: {
            type: Number,
            default: 0,
        },
        currentPage: {
            type: Number,
            default: 1,
        },
        pageSize: {
            type: Number,
            default: 10,
        },
        pageSizes: {
            type: Array,
            default: () => [10, 20, 50, 100],
        },
        hasPagination: {
            type: Boolean,
            default: true,
        },
        marginTop: {
            type: [Number, String],
            default: 20,
        },
        maxHeight: {
            type: [Number, String],
            default: "auto",
        },
        height: {
            type: [Number, String],
            default: "removeHeight",
        },
        defaultSort: {
            type: Object,
            default: () => {},
        },
        paginationclass: {
            type: Object,
            default: () => {},
        },
        stripe: {
            type: Boolean,
            default: true,
        },
        // 合计、本页合计数据
        extendsTotalData: {
            type: Object,
            default: () => {},
        },
        showAllTotal: {
            type: Boolean,
            default: false
        },
        showPageTotal: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            pageIndex: 1,
            multipleSelection: [], // 多行选中
        };
    },
    methods: {
        //自定义 合计 (根据接口字段数据合计)
        getSummaries(param) {
            const { columns, data } = param;
            const sums = [];
            columns.forEach((column, index) => {                
                let obj = this.columns.find(
                    (item) => item.prop === column.property
                );
                let newIndex = this.options.mutiSelect ? 1 : 0
                if (index === newIndex) {
                    column.colSpan = this.options.mutiSelect ? 2 : 1
                    sums[index] = (() => {
                        let summaryPage, summaryTotal;
                        if(this.showPageTotal){
                            summaryPage = <div class='summary_page'>本页合计</div>
                        }
                        if(this.showAllTotal){
                            summaryTotal = <div class="summary_total">合计</div>
                        }
                        return <div>{summaryPage}{summaryTotal}</div>
                    })();
                    return;
                }else{
                    if (obj) {
                        sums[index] = (() => {
                            let summaryPage, summaryTotal;
                            if(this.showPageTotal){
                                summaryPage = <div class='summary_page'>{this.formatterTotal(obj, this.extendsTotalData[obj.pageTotalProp])}</div>
                            }
                            if(this.showAllTotal){
                                summaryTotal = <div class="summary_total">{this.formatterTotal(obj, this.extendsTotalData[obj.totalProp])}</div>
                            }
                            return <div>{summaryPage}{summaryTotal}</div>
                        })();
                    } else {
                        sums[index] = "";
                    }
                }
            });
            return sums;
        },
        handleSelectionChange(val) {
            console.log('选中行---', val)
            this.multipleSelection = val;
            this.$emit("handleSelectionChange", this.multipleSelection);
        },
        handleSizeChange(pageSize) {
            this.$emit("sizeChange", pageSize);
        },
        handleCurrentChange(currentPage) {
            this.$emit("currentChange", currentPage);
        },
        refresh() {
            this.$emit("refresh");
        },
        selectAll(val) {
            this.$emit("selectAll", val);
        },
        sortChange(val) {
            this.$emit("sortChange", val);
        },
        resizeMainView() {
            const table = this.$refs.table;
            table.doLayout();
        },
        // 合计数据-格式化
        formatterTotal(column, data){
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
    },
    mounted() {
        const table = this.$refs.table;
        removeResizeListener(table.$el, table.resizeListener);
        window.addEventListener("resize", this.resizeMainView);        
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.resizeMainView);
    },
    watch: {
        list() {
            this.$nextTick(this.resizeMainView);
        },
        columns(){
            this.$nextTick(this.resizeMainView);
        },
    },
};
</script>
<style lang="scss">
.blue,
.blue:hover {
    color: #0a83ff !important;
}
.btl_operate_popper {
    min-width: auto;
    padding: 0 !important;
    box-shadow: 1px 1px 5px 0px #aaa;
    .btl_operate_item {
        border-top: 1px solid #ddd;
        &:first-child {
            border: 0;
        }
    }
    .btl_operate_item:hover .el-button {
        color: #333;
        background: #eee;
    }
    .btl_operate_item_btn {
        padding: 0 15px;
        line-height: 40px;
        font-size: 14px;
        border: 0;
    }
}
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
}
.pr0 {
    padding-right: 0;
}

.base_table_list_container {
    .el-table {
        width: 99.9% !important;
    }
    .el-table .el-table__body {
        width: 100% !important;
    }
    .el-table th {
        background: #f8f9fb !important;
    }
    // 排序图标
    .el-table .sort-caret {
        display: none !important;
    }
    .el-table .caret-wrapper {
        width: 18px !important;
        height: 36px !important;
        margin-bottom: -15px;
        font-family: "element-icons" !important;
        &::after {
            content: "";
            width: 8px;
            height: 18px;
            font-weight: 600;
            font-size: 12px;
            color: #eee;
            background: url(~@/assets/image/index/icon_sort.png) no-repeat
                center;
            background-size: contain;
        }
    }
    .el-table .ascending .caret-wrapper {
        &::after {
            background: url(~@/assets/image/index/icon_sort_up.png) no-repeat
                center;
        }
    }
    .el-table .descending .caret-wrapper {
        &::after {
            background: url(~@/assets/image/index/icon_sort_down.png) no-repeat
                center;
        }
    }
    .el-table .el-table__cell .cell {
        word-break: break-word;
    }
    .el-table .el-table__body-wrapper .cell {
        line-height: 16px;
    }

    .el-table__footer{
        .el-table-column--selection{
            display: none;
        }
        .el-table__cell{
            padding: 0;
            background: #fff;
        }
        .cell{
            padding: 0;
        }
    }
    .summary_page{
        padding: 12px 10px;
        border-bottom: 1px solid #EBEEF5;
    }
    .summary_total{
        padding: 12px 10px;
    }
}
</style>
