<template>
  <div class="g_order_container">
    <Card class="m_order_content" shadow bordered>
      <Tabs>
        <TabPane label="我的待办" name="my-todo">
          <my-todo />
        </TabPane>
        <TabPane label="我的处理" name="my-handle">
          <my-handle />
        </TabPane>
        <TabPane label="我的创建" name="my-create">
          <my-create />
        </TabPane>
      </Tabs>
    </Card>
  </div>
</template>

<script>
import MyCreate from '_c/order/my-create'
import MyTodo from '_c/order/my-todo'
import MyHandle from '_c/order/my-handle'
import './order.less'
export default {
  name: 'MyOrderList',
  components: {
    MyCreate,
    MyTodo,
    MyHandle
  }
}
</script>

<style>
</style>
