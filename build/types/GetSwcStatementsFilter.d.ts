export type GetSwcStatementsFilter = {
    /**
     * Find a statement by looking at the name index.
     *
     * TODO: The name index should lead to the path of the statement.
     * If the name isn't in the index or if the path can't be found, a re-indexation function should be ran to re-create the index.
     * This way, we don't need to run a watcher to develop, and the function-db will always work.
     */
    name?: string | string[];
    /**
     * if true, will parse directly. If not, will look for the statements in statements.json in the root of the operation.
     */
    isCacheDisabled?: boolean;
    /**
     * NB: in case of cache it may get more than just this file/files because it will get all statements fo the entire operation.
     */
    projectRelativeBasePath?: string | string[];
};
//# sourceMappingURL=GetSwcStatementsFilter.d.ts.map