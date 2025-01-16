export default [
  {
    edges: [
      { start: 9, end: 9, target: 1 },
      { start: 10, end: 10, target: 1 },
      { start: 13, end: 13, target: 1 },
      { start: 32, end: 32, target: 1 },
      { start: 34, end: 34, target: 2 },
      { start: 40, end: 40, target: 3 },
      { start: 41, end: 41, target: 4 },
      { start: 42, end: 42, target: 5 },
      { start: 43, end: 43, target: 6 },
      { start: 44, end: 44, target: 7 },
      { start: 45, end: 45, target: 8 },
      { start: 46, end: 46, target: 9 },
      { start: 47, end: 47, target: 10 },
      { start: 48, end: 57, target: 11 },
      { start: 60, end: 60, target: 12 },
      { start: 61, end: 61, target: 13 },
      { start: 62, end: 62, target: 14 },
      { start: 95, end: 95, target: 15 },
      { start: 97, end: 97, target: 16 },
      { start: 98, end: 98, target: 17 },
      { start: 99, end: 99, target: 15 },
      { start: 100, end: 100, target: 18 },
      { start: 101, end: 101, target: 19 },
      { start: 102, end: 102, target: 20 },
      { start: 103, end: 103, target: 21 },
      { start: 104, end: 104, target: 22 },
      { start: 105, end: 105, target: 23 },
      { start: 106, end: 107, target: 15 },
      { start: 108, end: 108, target: 24 },
      { start: 109, end: 110, target: 15 },
      { start: 111, end: 111, target: 25 },
      { start: 112, end: 114, target: 15 },
      { start: 115, end: 115, target: 26 },
      { start: 116, end: 116, target: 27 },
      { start: 117, end: 118, target: 15 },
      { start: 119, end: 119, target: 28 },
      { start: 120, end: 122, target: 15 },
    ],
    handlers: [],
  },
  {
    edges: [
      { start: 9, end: 9, target: 29 },
      { start: 10, end: 10, target: 29 },
      { start: 13, end: 13, target: 29 },
      { start: 32, end: 32, target: 29 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: 'space', type: 'space', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 0, end: 33, target: 30 },
      { start: 34, end: 34, target: 31 },
      { start: 35, end: 91, target: 30 },
      { start: 92, end: 92, target: 32 },
      { start: 93, end: 65535, target: 30 },
    ],
    handlers: [],
  },
  {
    edges: [],
    handlers: [
      function (text: string) {
        return { yytext: '\\(', type: text, value: text };
      },
    ],
  },
  {
    edges: [],
    handlers: [
      function (text: string) {
        return { yytext: '\\)', type: text, value: text };
      },
    ],
  },
  {
    edges: [],
    handlers: [
      function (text: string) {
        return { yytext: '*', type: text, value: text };
      },
      function (text: string) {
        return { yytext: '\\*', type: text, value: text };
      },
    ],
  },
  {
    edges: [],
    handlers: [
      function (text: string) {
        return { yytext: '\\+', type: text, value: text };
      },
    ],
  },
  {
    edges: [],
    handlers: [
      function (text: string) {
        return { yytext: ',', type: text, value: text };
      },
    ],
  },
  {
    edges: [],
    handlers: [
      function (text: string) {
        return { yytext: '\\-', type: text, value: text };
      },
    ],
  },
  {
    edges: [],
    handlers: [
      function (text: string) {
        return { yytext: '.', type: text, value: text };
      },
    ],
  },
  {
    edges: [],
    handlers: [
      function (text: string) {
        return { yytext: '/', type: text, value: text };
      },
    ],
  },
  {
    edges: [
      { start: 46, end: 46, target: 33 },
      { start: 48, end: 57, target: 34 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: text, type: 'number', value: Number(text) };
      },
    ],
  },
  {
    edges: [{ start: 61, end: 61, target: 35 }],
    handlers: [
      function (text: string) {
        return { yytext: '<', type: text, value: text };
      },
    ],
  },
  {
    edges: [],
    handlers: [
      function (text: string) {
        return { yytext: '=', type: text, value: text };
      },
    ],
  },
  {
    edges: [{ start: 61, end: 61, target: 36 }],
    handlers: [
      function (text: string) {
        return { yytext: '>', type: text, value: text };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 109, target: 37 },
      { start: 110, end: 110, target: 38 },
      { start: 111, end: 114, target: 37 },
      { start: 115, end: 115, target: 39 },
      { start: 116, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 120, target: 37 },
      { start: 121, end: 121, target: 40 },
      { start: 122, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 100, target: 37 },
      { start: 101, end: 101, target: 41 },
      { start: 102, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 107, target: 37 },
      { start: 108, end: 108, target: 42 },
      { start: 109, end: 109, target: 37 },
      { start: 110, end: 110, target: 43 },
      { start: 111, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 113, target: 37 },
      { start: 114, end: 114, target: 44 },
      { start: 115, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 113, target: 37 },
      { start: 114, end: 114, target: 45 },
      { start: 115, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 97, target: 46 },
      { start: 98, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 101, target: 37 },
      { start: 102, end: 102, target: 47 },
      { start: 103, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 104, target: 37 },
      { start: 105, end: 105, target: 48 },
      { start: 106, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 113, target: 37 },
      { start: 114, end: 114, target: 49 },
      { start: 115, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 100, target: 37 },
      { start: 101, end: 101, target: 50 },
      { start: 102, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 103, target: 37 },
      { start: 104, end: 104, target: 51 },
      { start: 105, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 103, target: 37 },
      { start: 104, end: 104, target: 52 },
      { start: 105, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 9, end: 9, target: 29 },
      { start: 10, end: 10, target: 29 },
      { start: 13, end: 13, target: 29 },
      { start: 32, end: 32, target: 29 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: 'space', type: 'space', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 0, end: 33, target: 30 },
      { start: 34, end: 34, target: 31 },
      { start: 35, end: 91, target: 30 },
      { start: 92, end: 92, target: 32 },
      { start: 93, end: 65535, target: 30 },
    ],
    handlers: [],
  },
  {
    edges: [],
    handlers: [
      function (text: string) {
        return { yytext: text, type: 'string', value: text.slice(1, -1) };
      },
    ],
  },
  {
    edges: [
      { start: 0, end: 33, target: 30 },
      { start: 34, end: 34, target: 53 },
      { start: 35, end: 91, target: 30 },
      { start: 92, end: 92, target: 32 },
      { start: 93, end: 65535, target: 30 },
    ],
    handlers: [],
  },
  { edges: [{ start: 48, end: 57, target: 54 }], handlers: [] },
  {
    edges: [
      { start: 46, end: 46, target: 33 },
      { start: 48, end: 57, target: 34 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: text, type: 'number', value: Number(text) };
      },
    ],
  },
  {
    edges: [],
    handlers: [
      function (text: string) {
        return { yytext: '<=', type: text, value: text };
      },
    ],
  },
  {
    edges: [],
    handlers: [
      function (text: string) {
        return { yytext: '>=', type: text, value: text };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 99, target: 37 },
      { start: 100, end: 100, target: 55 },
      { start: 101, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 98, target: 37 },
      { start: 99, end: 99, target: 56 },
      { start: 100, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: 'as', type: text, value: text };
      },
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: 'by', type: text, value: text };
      },
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 114, target: 37 },
      { start: 115, end: 115, target: 57 },
      { start: 116, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 114, target: 37 },
      { start: 115, end: 115, target: 58 },
      { start: 116, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 99, target: 37 },
      { start: 100, end: 100, target: 59 },
      { start: 101, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 110, target: 37 },
      { start: 111, end: 111, target: 60 },
      { start: 112, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 110, target: 37 },
      { start: 111, end: 111, target: 61 },
      { start: 112, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 117, target: 37 },
      { start: 118, end: 118, target: 62 },
      { start: 119, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: 'if', type: text, value: text };
      },
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 108, target: 37 },
      { start: 109, end: 109, target: 63 },
      { start: 110, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 99, target: 37 },
      { start: 100, end: 100, target: 64 },
      { start: 101, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: 'or', type: text, value: text };
      },
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 107, target: 37 },
      { start: 108, end: 108, target: 65 },
      { start: 109, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 100, target: 37 },
      { start: 101, end: 101, target: 66 },
      { start: 102, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 100, target: 37 },
      { start: 101, end: 101, target: 67 },
      { start: 102, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 0, end: 33, target: 30 },
      { start: 34, end: 34, target: 31 },
      { start: 35, end: 91, target: 30 },
      { start: 92, end: 92, target: 32 },
      { start: 93, end: 65535, target: 30 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: text, type: 'string', value: text.slice(1, -1) };
      },
    ],
  },
  {
    edges: [{ start: 48, end: 57, target: 68 }],
    handlers: [
      function (text: string) {
        return { yytext: text, type: 'number', value: Number(text) };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: 'and', type: text, value: text };
      },
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: 'asc', type: text, value: text };
      },
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 98, target: 37 },
      { start: 99, end: 99, target: 69 },
      { start: 100, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 100, target: 37 },
      { start: 101, end: 101, target: 70 },
      { start: 102, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: 'end', type: text, value: text };
      },
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 108, target: 37 },
      { start: 109, end: 109, target: 71 },
      { start: 110, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 116, target: 37 },
      { start: 117, end: 117, target: 72 },
      { start: 118, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 104, target: 37 },
      { start: 105, end: 105, target: 73 },
      { start: 106, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 104, target: 37 },
      { start: 105, end: 105, target: 74 },
      { start: 106, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 100, target: 37 },
      { start: 101, end: 101, target: 75 },
      { start: 102, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 100, target: 37 },
      { start: 101, end: 101, target: 76 },
      { start: 102, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 109, target: 37 },
      { start: 110, end: 110, target: 77 },
      { start: 111, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 113, target: 37 },
      { start: 114, end: 114, target: 78 },
      { start: 115, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [{ start: 48, end: 57, target: 68 }],
    handlers: [
      function (text: string) {
        return { yytext: text, type: 'number', value: Number(text) };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: 'desc', type: text, value: text };
      },
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 104, target: 37 },
      { start: 105, end: 105, target: 79 },
      { start: 106, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: 'else', type: text, value: text };
      },
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: 'from', type: text, value: text };
      },
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 111, target: 37 },
      { start: 112, end: 112, target: 80 },
      { start: 113, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 109, target: 37 },
      { start: 110, end: 110, target: 81 },
      { start: 111, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 115, target: 37 },
      { start: 116, end: 116, target: 82 },
      { start: 117, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 113, target: 37 },
      { start: 114, end: 114, target: 83 },
      { start: 115, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 98, target: 37 },
      { start: 99, end: 99, target: 84 },
      { start: 100, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: 'then', type: text, value: text };
      },
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 100, target: 37 },
      { start: 101, end: 101, target: 85 },
      { start: 102, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 101, target: 37 },
      { start: 102, end: 102, target: 86 },
      { start: 103, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: 'group', type: text, value: text };
      },
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 102, target: 37 },
      { start: 103, end: 103, target: 87 },
      { start: 104, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: 'limit', type: text, value: text };
      },
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: 'order', type: text, value: text };
      },
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 115, target: 37 },
      { start: 116, end: 116, target: 88 },
      { start: 117, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: 'where', type: text, value: text };
      },
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: 'elseif', type: text, value: text };
      },
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: 'having', type: text, value: text };
      },
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
  {
    edges: [
      { start: 48, end: 57, target: 37 },
      { start: 65, end: 90, target: 37 },
      { start: 97, end: 122, target: 37 },
    ],
    handlers: [
      function (text: string) {
        return { yytext: 'select', type: text, value: text };
      },
      function (text: string) {
        return { yytext: text, type: 'id', value: text };
      },
    ],
  },
];
