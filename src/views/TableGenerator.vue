<template>
  <div class="container">
    <div class="tableContainer">
      <h2 class="headTitle">Just select your pattern</h2>
      <Table :rows="10" :columns="10" />
    </div>
    <div class="codeContainer">
      <h2 class="headTitle">And get the html code</h2>
      <CodeSide />
    </div>
  </div>
</template>

<script>
import Table from "./subcomponents/Table.vue";
import CodeSide from "./subcomponents/CodeSide.vue";

export default {
  methods: {},
  components: {
    Table,
    CodeSide,
  },
  watch: {},
  computed: {},
  data() {
    return {
      x: 0,
      y: 0,
      leftWidth: 0,
      resizer: undefined,
    };
  },
};
</script>

<style scoped>
.container {
  height: calc(100vh - 60px);
  background-color: rgb(98, 98, 98);
  color: #fff;
  display: flex;
}

.tableContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 5%;
  flex-grow: 1;
  flex-basis: 50%;
  background-color: #252526;
}

.codeContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  flex-basis: 50%;
  padding-top: 5%;
  background-color: #252526;
}

.headTitle {
  text-transform: uppercase;
  margin-bottom: 5%;
}

.resize {
  cursor: col-resize;
  height: 100%;
  width: 5px;
}

.resize:hover {
  background-color: #007acc;
}
</style>
