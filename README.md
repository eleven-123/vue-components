# vue-component

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


#### BaseTableList 组件
*基于`el-table`封装的`tablelist`(表格列表)*

#####关于 `el-table` 无限抖动：
[抖动问题说明及解决方案](https://blog.iwnweb.com/kai-fa/infinite-jitter-of-element-ui-table-and-its-solution/)
[官方 issue 讨论](https://github.com/ElemeFE/element/issues/16167)
>友友们给的方案：
1、设置`table`的样式为`width: 99.9% !important;`，但缩放的时候时还是容易复现；
2、给列设置宽度；

element table源码上来看，列的宽度为自撑开时，为元素添加resize监听器（resizeListener），当元素大小改变时会重新计算列的宽度。
```js
// element-ui/packages/table/src/table.vue
    ...
    bindEvents() {
        this.bodyWrapper.addEventListener('scroll', this.syncPostion, { passive: true });
        if (this.fit) {
          addResizeListener(this.$el, this.resizeListener);
        }
    },

    unbindEvents() {
        this.bodyWrapper.removeEventListener('scroll', this.syncPostion, { passive: true });
        if (this.fit) {
          removeResizeListener(this.$el, this.resizeListener);
        }
    },
    resizeListener() {
        if (!this.$ready) return;
        let shouldUpdateLayout = false;
        const el = this.$el;
        const { width: oldWidth, height: oldHeight } = this.resizeState;

        const width = el.offsetWidth;
        if (oldWidth !== width) {
          shouldUpdateLayout = true;
        }

        const height = el.offsetHeight;
        if ((this.height || this.shouldUpdateHeight) && oldHeight !== height) {
          shouldUpdateLayout = true;
        }

        if (shouldUpdateLayout) {
          this.resizeState.width = width;
          this.resizeState.height = height;
          this.doLayout();
        }
    },

    doLayout() {
        if (this.shouldUpdateHeight) {
          this.layout.updateElsHeight();
        }
        this.layout.updateColumnsWidth();
    },
    ...
```
那么，是不是意味着设置 `fit: false`，并 `table{width: 100% !important;}`也就可以解决了呢?

另一种方案：
移除元素监听器resizeListener，给window添加监听器resize
```js
import { removeResizeListener } from 'element-ui/src/utils/resize-event';
export default {
    methods: {
        resizeTableView(){
            const table = this.$refs.table;
            table.doLayout()
        }
    },
    mounted () {
        const table = this.$refs.table;
        removeResizeListener(table.$el, table.resizeListener)
        window.addEventListener("resize", this.resizeTableView)
    },
    beforeDestroy () {
        window.removeEventListener("resize", this.resizeTableView)
    },
}
```
