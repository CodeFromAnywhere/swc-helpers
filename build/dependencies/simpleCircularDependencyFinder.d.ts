export type DependencyOperation = {
    operationName: string;
    dependencies?: string[];
};
/**
   *Takes an additional 20-40ms on top of the ±400ms of `getDependenciesPerOperation` to find the problematic dependencies while also returning a good order of least dependency.
  
   Best until now (much more efficient than other algos)
  
   NB: If I plug the result of this into `findCircularDependencyRecursive` I'll get a perfect result showing exactly what the loops are... But even without that it'll already be easy enough to spot with the result of this
   */
export declare const simpleCircularDependencyFinderRecursive: (operations: {
    [key: string]: string;
}, dependenciesPerOperationLeft?: DependencyOperation[], stack?: string[]) => Promise<{
    dependenciesPerOperation: DependencyOperation[];
    stack: string[] | undefined;
}>;
//# sourceMappingURL=simpleCircularDependencyFinder.d.ts.map