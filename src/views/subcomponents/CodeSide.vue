<template>
  <div class="codeContainer">
    <div class="editor">
      <textarea
        v-bind="{ value: code }"
        name="codeeditor"
        id="codeditor"
        cols="30"
        rows="20"
      ></textarea>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      code: "",
    };
  },
  computed: mapGetters(["table"]),
  methods: {
    spellcheck(e) {
      e.target.value += "<table>";
      for (let i = 0; i < this.table.rows; i++) {
        e.target.value += "<tr>";
        for (let j = 0; j < this.table.columns; j++) {
          e.target.value += "<td></td>";
        }
        e.target.value += "</tr>";
      }
      e.target.value += "</table>";
      console.log(e.target.value);
    },
  },
  watch: {
    table() {
      let code = "";
      code += `<table>
 `;
      for (let i = 0; i < this.table.rows; i++) {
        code += ` <tr>
  `;
        for (let j = 0; j < this.table.columns; j++) {
          code += `<td>${j}</td>
      `;
        }
        code += `</tr>
  `;
      }
      code += `</table>`;
      this.code = code;
    },
  },
};
</script>

<style scoped>
.codeContainer {
  background-color: #1e1e1e;
  width: 100%;
  height: 100%;
}

.editor {
  height: 100%;
  width: 100%;
  background-color: #1e1e1e;
  overflow: scroll;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.editor::-webkit-scrollbar {
  display: none;
}

@font-face {
  font-family: Consolas;
  src: url("../../assets/fonts/Consolas.ttf") format("ttf");
}

#codeditor {
  border: none;
  background-color: transparent;
  resize: none;
  height: 100%;
  width: 100%;
  color: #fff;
  font-size: 1.2rem;
  font-family: Consolas !important;
}

#codeditor:focus {
  outline: none;
}
</style>
