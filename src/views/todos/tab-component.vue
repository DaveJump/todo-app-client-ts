<template>
  <div class="list-wrap">
    <van-list
      v-model="loadingBottom"
      :finished="editing || loadMoreFinished"
      @load="loadMore">
      <van-search placeholder="输入待办名称搜索" background="none" v-model="searchText"></van-search>
      <van-pull-refresh v-model="loadingTop" @refresh="fetch(true)" :disabled="editing">
        <empty-box v-if="!list.length && !this.loadingBottom">空空如也</empty-box>
        <div class="list-content" v-if="list.length">
          <van-swipe-cell
            v-for="(item, index) in list" :key="item._id"
            :right-width="item.todoStatus === 1 ? 58 : 116"
            :disabled="editing"
            :on-close="handleSwipeClose">
            <van-checkbox-group v-model="selected">
              <van-cell-group>
                <van-cell
                  class="todo-item"
                  :title="item.todoName"
                  @click="handleClickCell(index)"
                  clickable>
                  <div slot="title">
                    <div :class="{'done': +item.todoStatus === 1}">{{item.todoName}}</div>
                    <div class="van-cell__label" :class="{'done': +item.todoStatus === 1}">{{item.desc}}</div>
                  </div>
                  <van-checkbox class="checkbox" v-if="editing" :name="item._id" ref="checkboxes" />
                  <div class="value">
                    <div class="date">{{getTodoDate(item)}}</div>
                    <div class="done-icon"><van-icon name="completed" v-if="+item.todoStatus === 1" /></div>
                  </div>
                </van-cell>
              </van-cell-group>
            </van-checkbox-group>
            <div slot="right" class="slide-buttons__right">
              <span
                style="background: #38f;color: #fff;"
                v-if="item.todoStatus !== 1"
                @click="handleCompleteTodo(item)"
              >
                完成
              </span>
              <!-- <span>编辑</span> -->
              <span style="background: #f44;color: #fff;" @click="handleDelTodo(item)">删除</span>
            </div>
          </van-swipe-cell>
          <div class="no-more" v-if="loadMoreFinished">没有更多啦</div>
        </div>
      </van-pull-refresh>
    </van-list>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch, Emit } from 'vue-property-decorator'
import { State, Action } from 'vuex-class'
import emptyBox from '@/components/empty.vue'
import moment from 'moment'
import { debounce } from 'lodash'
import { Todo, selectedListType } from './vars'
import { Obj } from '@/modules/interfaces'

@Component({
  name: 'TabComponent',
  components: {
    emptyBox
  }
})
class TabComponent extends Vue {
  // props
  @Prop({ type: Function, default: () => () => {} }) fetchMethod!: (val: any) => {}

  list: Todo[] = []
  total = 0
  page = 0
  pageSize = 20
  loadingTop = false
  loadingBottom = false
  loadMoreFinished = false
  selected: selectedListType = []
  searchText = ''
  $refs!: {
    checkboxes: any[]
  }

  @State editing!: boolean

  @Watch('editing')
  onEditStateChange (val: boolean) {
    if (!val) {
      this.selected = []
    }
  }

  @Watch('selected')
  onSelectedChange (val: selectedListType) {
    this.changeSelected(val)
  }

  @Watch('searchText')
  onSearchTextChange (val: string) {
    this.handleSearch(val)
  }

  @Emit('complete-todo')
  handleCompleteTodo<T> (item: T): T {
    return item
  }

  @Emit('delete-todo')
  handleDelTodo<T> (item: T): T {
    return item
  }

  @Action changeSelected!: any
  async fetch (refresh = false) {
    if (refresh) {
      this.page = 1
    }
    try {
      interface Results {
        [index: string]: any,
        list?: Todo[],
        total?: number
      }

      let results: Results = await this.fetchMethod({
        page: this.page,
        page_size: this.pageSize,
        todo_name: this.searchText
      })

      this.loadMoreFinished = false

      let { list = [], total = 0 } = results || {}

      this.total = total
      this.list = this.loadMoreFinished || refresh ? list : [...this.list, ...list]
      this.loadMoreFinished = (this.list.length >= this.total) || !this.list.length
    } catch (e) {
      console.error(e)
      this.loadMoreFinished = true
    } finally {
      this.loadingTop = false
      this.loadingBottom = false
    }
  }
  handleLoadMore () {
    !this.loadMoreFinished && this.page++
    this.fetch()
  }
  loadMore = debounce(this.handleLoadMore, 400)
  getTodoDate (item: Todo): string {
    return moment(new Date(item.createTime)).format('YYYY-MM-DD')
  }
  handleClickCell (index: number) {
    if (!this.editing) {
      console.log('to-detail !!')
    } else {
      this.$refs.checkboxes[index].toggle()
      this.$nextTick(() => {
        this.changeSelected(this.selected)
      })
    }
  }
  handleSwipeClose (clickPosition: string, instance: any) {
    if (['outside', 'cell'].includes(clickPosition)) {
      instance.close()
    }
  }
  handleSearch = debounce(val => {
    this.fetch(true)
  }, 600)
}

export default TabComponent
</script>
