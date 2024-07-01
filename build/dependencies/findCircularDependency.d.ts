/**
 * WORKS!!!!!
 *
 * DEPRECATED: `simpleCircularDependencyFinder` is better
 */
export declare const findCircularDependency: (startOperationName: string, operations: {
    [key: string]: string;
}) => Promise<string[] | undefined>;
export declare const findCircularDependencyRecursive: (dependenciesPerOperationObject: {
    [x: string]: string[];
}, stack: string[]) => string[];
//# sourceMappingURL=findCircularDependency.d.ts.map