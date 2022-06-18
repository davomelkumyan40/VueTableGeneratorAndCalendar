export default {
    state: {
        table: {
            rows: 0,
            columns: 0,
        }
    },
    actions: {
        setTable(ctx, table) {
            ctx.commit("updateTable", table);
        }
    },
    mutations: {
        updateTable(state, table) {
            state.table = table;
        }
    },
    getters: {
        table(state) {
            return state.table;
        }
    },
}