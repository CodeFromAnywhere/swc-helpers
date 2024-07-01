/**

 * DEPRECATED: `simpleCircularDependencyFinder` is better

*/
export declare const getDependencyLayerLevels: (operationNames: string[], removedOperationNames: string[], level: number, dependenciesPerOperation: {
    operationName: string;
    dependencies: string[] | undefined;
}[], operations: {
    [key: string]: string;
}) => Promise<void>;
//# sourceMappingURL=getDependencyLayerLevels.d.ts.map