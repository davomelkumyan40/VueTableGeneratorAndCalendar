<template>
  <div class="table" :style="{ height: tWidth + 'px' }">
    <div class="row" v-for="r in rows" :key="r">
      <div
        @click="colClick(r - 1, c - 1)"
        @mouseenter="select(r - 1, c - 1)"
        @mouseleave="deselect"
        class="col"
        v-for="c in columns"
        :key="c"
      >
        <p class="title" v-if="c === 1 && r === 1">{{ c }}</p>
        <p class="title" v-if="r > 1 && c === 1">{{ r }}</p>
        <p class="title" v-if="c > 1 && r === 1">{{ c }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isSelected: false,
      selectedRow: -1,
      selectedCol: -1,
      style: {
        selectionColor: "rgb(175, 175, 175)",
      },
      tWidth: 0,
      percent: 70,
    };
  },
  props: {
    rows: Number,
    columns: Number,
  },
  methods: {
    resize(e) {
      this.tWidth = (((e.target.innerWidth * 50) / 100) * this.percent) / 100;
    },
    colClick(row, col) {
      if (this.selectedRow === row && this.selectedCol === col) {
        this.isSelected = false;
        this.selectedRow = -1;
        this.selectedCol = -1;
        return;
      }
      this.isSelected = true;
      this.selectedRow = row;
      this.selectedCol = col;
      this.select(row, col);
      this.$store.dispatch("setTable", {
        rows: this.selectedRow + 1,
        columns: this.selectedCol + 1,
      });
    },
    select(row, col) {
      if (this.isSelected) {
        for (let i = 0; i < this.$props.rows; i++) {
          for (let j = 0; j < this.$props.columns; j++) {
            if (i > this.selectedRow || j > this.selectedCol) {
              if (i < row + 1 && j < col + 1)
                this.$el.children[i].children[j].style.backgroundColor =
                  this.style.selectionColor;
              else this.$el.children[i].children[j].style.backgroundColor = "";
            } else {
              if (i < row + 1 && j < col + 1)
                this.$el.children[i].children[j].style.backgroundColor =
                  "#ebebeb";
              else
                this.$el.children[i].children[j].style.backgroundColor =
                  this.style.selectionColor;
            }
          }
        }
      } else {
        for (let i = 0; i < this.$props.rows; i++) {
          for (let j = 0; j < this.$props.columns; j++) {
            if (i < row + 1 && j < col + 1)
              this.$el.children[i].children[j].style.backgroundColor =
                this.style.selectionColor;
            else this.$el.children[i].children[j].style.backgroundColor = "";
          }
        }
      }
    },
    deselect() {
      if (this.isSelected) return;
      for (let i = 0; i < this.$props.rows; i++) {
        for (let j = 0; j < this.$props.columns; j++) {
          this.$el.children[i].children[j].style.backgroundColor = "";
        }
      }
    },
  },
  created() {
    window.addEventListener("resize", this.resize);
    this.tWidth = (((window.innerWidth * 50) / 100) * this.percent) / 100;
  },
};
</script>


<style scoped>
.table {
  width: 70%;
  cursor: pointer;
  background-color: #3f3f41;
  position: relative;
}

.row {
  display: flex;
  width: 100%;
  height: 10%;
}

.col {
  flex-basis: 30%;
  height: 100%;
  background-color: rgb(114, 113, 113);
  border: 1px solid rgb(41, 41, 41);
  border-radius: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.title {
  color: #252525;
  font-size: 1.2rem;
  font-weight: bold;
}
</style>