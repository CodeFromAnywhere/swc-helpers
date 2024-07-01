import swcCore from "@swc/core";
import { tsModuleToFunctionSchemas } from "./tsModuleToFunctionSchemas.js";

const script = `interface Xyz {
    a:string;
}
    
type Example = {
    a:string;
    b?:number;
    c:"a"|"b";
    d: X
}

// export const normalFunction = (a: Example): { thing?: string, thang?: Example } => {

//     return {}
    
// }

// export const promiseFunction = async (a: T): Promise<{ thing?: string, thang: T }> => {

//     return { thang: a }
    
// }

// export const unionFunctionInPromise = async (a: T): Promise<{ thing?: string, thang: T } & {unionType?:number}> => {

//     return { thang: a }
    
// }

export const unionFunction = async (a: T): { thing?: string, thang: T } & {unionType?:number} & Example => {

    return { thang: a }
    
}

`;

// const ast = {
//   type: "Module",
//   span: {
//     start: 0,
//     end: 167,
//     ctxt: 0,
//   },
//   body: [
//     {
//       type: "TsInterfaceDeclaration",
//       span: {
//         start: 0,
//         end: 29,
//         ctxt: 0,
//       },
//       id: {
//         type: "Identifier",
//         span: {
//           start: 10,
//           end: 11,
//           ctxt: 2,
//         },
//         value: "X",
//         optional: false,
//       },
//       declare: false,
//       typeParams: null,
//       extends: [],
//       body: {
//         type: "TsInterfaceBody",
//         span: {
//           start: 12,
//           end: 29,
//           ctxt: 0,
//         },
//         body: [
//           {
//             type: "TsPropertySignature",
//             span: {
//               start: 18,
//               end: 27,
//               ctxt: 0,
//             },
//             readonly: false,
//             key: {
//               type: "Identifier",
//               span: {
//                 start: 18,
//                 end: 19,
//                 ctxt: 0,
//               },
//               value: "a",
//               optional: false,
//             },
//             computed: false,
//             optional: false,
//             init: null,
//             params: [],
//             typeAnnotation: {
//               type: "TsTypeAnnotation",
//               span: {
//                 start: 19,
//                 end: 26,
//                 ctxt: 0,
//               },
//               typeAnnotation: {
//                 type: "TsKeywordType",
//                 span: {
//                   start: 20,
//                   end: 26,
//                   ctxt: 0,
//                 },
//                 kind: "string",
//               },
//             },
//             typeParams: null,
//           },
//         ],
//       },
//     },
//     {
//       type: "TsTypeAliasDeclaration",
//       span: {
//         start: 35,
//         end: 100,
//         ctxt: 0,
//       },
//       declare: false,
//       id: {
//         type: "Identifier",
//         span: {
//           start: 40,
//           end: 41,
//           ctxt: 2,
//         },
//         value: "T",
//         optional: false,
//       },
//       typeParams: null,
//       typeAnnotation: {
//         type: "TsTypeLiteral",
//         span: {
//           start: 44,
//           end: 100,
//           ctxt: 0,
//         },
//         members: [
//           {
//             type: "TsPropertySignature",
//             span: {
//               start: 50,
//               end: 59,
//               ctxt: 0,
//             },
//             readonly: false,
//             key: {
//               type: "Identifier",
//               span: {
//                 start: 50,
//                 end: 51,
//                 ctxt: 0,
//               },
//               value: "a",
//               optional: false,
//             },
//             computed: false,
//             optional: false,
//             init: null,
//             params: [],
//             typeAnnotation: {
//               type: "TsTypeAnnotation",
//               span: {
//                 start: 51,
//                 end: 58,
//                 ctxt: 0,
//               },
//               typeAnnotation: {
//                 type: "TsKeywordType",
//                 span: {
//                   start: 52,
//                   end: 58,
//                   ctxt: 0,
//                 },
//                 kind: "string",
//               },
//             },
//             typeParams: null,
//           },
//           {
//             type: "TsPropertySignature",
//             span: {
//               start: 64,
//               end: 74,
//               ctxt: 0,
//             },
//             readonly: false,
//             key: {
//               type: "Identifier",
//               span: {
//                 start: 64,
//                 end: 65,
//                 ctxt: 0,
//               },
//               value: "b",
//               optional: false,
//             },
//             computed: false,
//             optional: true,
//             init: null,
//             params: [],
//             typeAnnotation: {
//               type: "TsTypeAnnotation",
//               span: {
//                 start: 66,
//                 end: 73,
//                 ctxt: 0,
//               },
//               typeAnnotation: {
//                 type: "TsKeywordType",
//                 span: {
//                   start: 67,
//                   end: 73,
//                   ctxt: 0,
//                 },
//                 kind: "number",
//               },
//             },
//             typeParams: null,
//           },
//           {
//             type: "TsPropertySignature",
//             span: {
//               start: 79,
//               end: 89,
//               ctxt: 0,
//             },
//             readonly: false,
//             key: {
//               type: "Identifier",
//               span: {
//                 start: 79,
//                 end: 80,
//                 ctxt: 0,
//               },
//               value: "c",
//               optional: false,
//             },
//             computed: false,
//             optional: false,
//             init: null,
//             params: [],
//             typeAnnotation: {
//               type: "TsTypeAnnotation",
//               span: {
//                 start: 80,
//                 end: 88,
//                 ctxt: 0,
//               },
//               typeAnnotation: {
//                 type: "TsUnionType",
//                 span: {
//                   start: 81,
//                   end: 88,
//                   ctxt: 0,
//                 },
//                 types: [
//                   {
//                     type: "TsLiteralType",
//                     span: {
//                       start: 81,
//                       end: 84,
//                       ctxt: 0,
//                     },
//                     literal: {
//                       type: "StringLiteral",
//                       span: {
//                         start: 81,
//                         end: 84,
//                         ctxt: 0,
//                       },
//                       value: "a",
//                       raw: '"a"',
//                     },
//                   },
//                   {
//                     type: "TsLiteralType",
//                     span: {
//                       start: 85,
//                       end: 88,
//                       ctxt: 0,
//                     },
//                     literal: {
//                       type: "StringLiteral",
//                       span: {
//                         start: 85,
//                         end: 88,
//                         ctxt: 0,
//                       },
//                       value: "b",
//                       raw: '"b"',
//                     },
//                   },
//                 ],
//               },
//             },
//             typeParams: null,
//           },
//           {
//             type: "TsPropertySignature",
//             span: {
//               start: 94,
//               end: 98,
//               ctxt: 0,
//             },
//             readonly: false,
//             key: {
//               type: "Identifier",
//               span: {
//                 start: 94,
//                 end: 95,
//                 ctxt: 0,
//               },
//               value: "d",
//               optional: false,
//             },
//             computed: false,
//             optional: false,
//             init: null,
//             params: [],
//             typeAnnotation: {
//               type: "TsTypeAnnotation",
//               span: {
//                 start: 95,
//                 end: 98,
//                 ctxt: 0,
//               },
//               typeAnnotation: {
//                 type: "TsTypeReference",
//                 span: {
//                   start: 97,
//                   end: 98,
//                   ctxt: 0,
//                 },
//                 typeName: {
//                   type: "Identifier",
//                   span: {
//                     start: 97,
//                     end: 98,
//                     ctxt: 2,
//                   },
//                   value: "X",
//                   optional: false,
//                 },
//                 typeParams: null,
//               },
//             },
//             typeParams: null,
//           },
//         ],
//       },
//     },
//     {
//       type: "ExportDeclaration",
//       span: {
//         start: 102,
//         end: 167,
//         ctxt: 0,
//       },
//       declaration: {
//         type: "VariableDeclaration",
//         span: {
//           start: 109,
//           end: 167,
//           ctxt: 0,
//         },
//         kind: "const",
//         declare: false,
//         declarations: [
//           {
//             type: "VariableDeclarator",
//             span: {
//               start: 115,
//               end: 167,
//               ctxt: 0,
//             },
//             id: {
//               type: "Identifier",
//               span: {
//                 start: 115,
//                 end: 119,
//                 ctxt: 2,
//               },
//               value: "func",
//               optional: false,
//               typeAnnotation: null,
//             },
//             init: {
//               type: "ArrowFunctionExpression",
//               span: {
//                 start: 122,
//                 end: 167,
//                 ctxt: 0,
//               },
//               params: [
//                 {
//                   type: "Identifier",
//                   span: {
//                     start: 123,
//                     end: 127,
//                     ctxt: 3,
//                   },
//                   value: "a",
//                   optional: false,
//                   typeAnnotation: {
//                     type: "TsTypeAnnotation",
//                     span: {
//                       start: 124,
//                       end: 127,
//                       ctxt: 0,
//                     },
//                     typeAnnotation: {
//                       type: "TsTypeReference",
//                       span: {
//                         start: 126,
//                         end: 127,
//                         ctxt: 0,
//                       },
//                       typeName: {
//                         type: "Identifier",
//                         span: {
//                           start: 126,
//                           end: 127,
//                           ctxt: 2,
//                         },
//                         value: "T",
//                         optional: false,
//                       },
//                       typeParams: null,
//                     },
//                   },
//                 },
//               ],
//               body: {
//                 type: "BlockStatement",
//                 span: {
//                   start: 144,
//                   end: 167,
//                   ctxt: 3,
//                 },
//                 stmts: [
//                   {
//                     type: "ReturnStatement",
//                     span: {
//                       start: 151,
//                       end: 160,
//                       ctxt: 0,
//                     },
//                     argument: {
//                       type: "ObjectExpression",
//                       span: {
//                         start: 158,
//                         end: 160,
//                         ctxt: 0,
//                       },
//                       properties: [],
//                     },
//                   },
//                 ],
//               },
//               async: false,
//               generator: false,
//               typeParameters: null,
//               returnType: {
//                 type: "TsTypeAnnotation",
//                 span: {
//                   start: 128,
//                   end: 140,
//                   ctxt: 0,
//                 },
//                 typeAnnotation: {
//                   type: "TsTypeReference",
//                   span: {
//                     start: 130,
//                     end: 140,
//                     ctxt: 0,
//                   },
//                   typeName: {
//                     type: "Identifier",
//                     span: {
//                       start: 130,
//                       end: 137,
//                       ctxt: 1,
//                     },
//                     value: "Partial",
//                     optional: false,
//                   },
//                   typeParams: {
//                     type: "TsTypeParameterInstantiation",
//                     span: {
//                       start: 137,
//                       end: 140,
//                       ctxt: 0,
//                     },
//                     params: [
//                       {
//                         type: "TsTypeReference",
//                         span: {
//                           start: 138,
//                           end: 139,
//                           ctxt: 0,
//                         },
//                         typeName: {
//                           type: "Identifier",
//                           span: {
//                             start: 138,
//                             end: 139,
//                             ctxt: 2,
//                           },
//                           value: "T",
//                           optional: false,
//                         },
//                         typeParams: null,
//                       },
//                     ],
//                   },
//                 },
//               },
//             },
//             definite: false,
//           },
//         ],
//       },
//     },
//   ],
//   interpreter: null,
// };

const astParsed = await swcCore.parse(script, {
  syntax: "typescript",
  tsx: true,
});
const res = tsModuleToFunctionSchemas(astParsed);
console.log(res);
