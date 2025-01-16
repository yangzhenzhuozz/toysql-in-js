import fs from 'fs';
import { Grammar, default as TSCC } from 'tscc';
import { ExpNode, SelectList } from './ExpTree.js';
import { DataSet } from './DataSet.js';
import { SQLSession } from './SQLSession.js';
declare let Context: SQLSession;
function gen() {
  let grammar: Grammar = {
    userCode: `//这个文件用SQLParserGen.ts生成的`,
    tokens: ['.', 'from', 'id', 'select', 'where', ',', 'as', '<', '<=', '>', '>=', '=', '+', '-', '*', '/', '(', ')', 'if', 'then', 'else', 'elseif', 'end', 'and', 'or', 'order', 'group', 'by', 'asc', 'desc', 'having', 'limit', 'number', 'string'],
    association: [
      { left: ['or'] },
      { left: ['and'] },
      { nonassoc: ['<', '<=', '=', '>', '>='] },
      { left: ['+', '-'] },
      { left: ['*', '/'] },
      { nonassoc: ['low_as'] }, //比as优先级低一些
      { nonassoc: ['as'] },
    ],
    accept: function ($) {
      return $[0] as DataSet<any>;
    },
    BNF: [
      {
        'program:query': {
          action: function ($) {
            return $[0] as DataSet<any>;
          },
        },
      },
      {
        'query:select_clause from tableView where_clause group_clause order_clause limit_clause': {
          action: function ($): DataSet<any> {
            let select_clause = $[0] as SelectList;
            let tableView = $[2] as DataSet<any>;
            if (select_clause.type == '*') {
              return tableView;
            } else {
              return tableView.select(select_clause.nodes!);
            }
          },
        },
      },
      {
        'select_clause:select select_list': {
          action: function ($): SelectList {
            return {
              type: 'nodes',
              nodes: $[1] as ExpNode[],
            };
          },
        },
      },
      {
        'select_clause:select *': {
          action: function (): SelectList {
            return {
              type: '*',
            };
          },
        },
      },
      {
        'select_list:select_list , select_item': {
          action: function ($): ExpNode[] {
            let select_list = $[0] as ExpNode[];
            let select_item = $[2] as ExpNode;
            select_list.push(select_item);
            return select_list;
          },
        },
      },
      {
        'select_list:select_item': {
          action: function ($) {
            return [$[0] as ExpNode];
          },
        },
      },
      {
        'select_item:exp': {
          action: function ($) {
            return $[0] as ExpNode;
          },
        },
      },
      {
        'select_item:alias_exp': {
          action: function ($) {
            return $[0] as ExpNode;
          },
        },
      },
      {
        'alias_exp:exp as id': {
          action: function ($): ExpNode {
            let exp = $[0] as ExpNode;
            let id = $[2] as string;
            return {
              op: 'alias',
              targetName: id,
              children: [exp],
            };
          },
        },
      },
      {
        'tableView:id': {
          action: function ($): DataSet<any> {
            let id = $[0] as string;
            if (Context.tableView[id] == undefined) {
              throw `表"${id}"不存在`;
            }
            return Context.tableView[id];
          },
        },
      },
      {
        'tableView:id as id': {
          action: function ($): DataSet<any> {
            let id = $[0] as string;
            let alias = $[2] as string;
            if (Context.tableView[id] == undefined) {
              throw `表"${id}"不存在`;
            }
            return Context.tableView[id].alias(alias);
          },
        },
      },
      { 'tableView:( query ) as  id': {} },
      { 'where_clause:': {} },
      { 'where_clause:where where_condition': {} },
      { 'where_condition:exp': {} },
      { 'group_clause:': {} },
      { 'group_clause:group by group_list having_clause': {} },
      { 'group_list:group_item , group_list': {} },
      { 'group_list:group_item': {} },
      { 'group_item:exp': {} }, //这里可能会导致性能问题，如:from t group by f1(t.v1) select f1(t.v1)，甚至是非常复杂的表达式计算，实在没时间做优化了
      { 'having_clause:': {} },
      { 'having_clause:having exp': {} },
      { 'order_clause:': {} },
      { 'order_clause:order by order_by_list': {} },
      { 'order_by_list:order_by_item , order_by_list': {} },
      { 'order_by_list:order_by_item order_key': {} },
      { 'order_key:': {} },
      { 'order_key:asc': {} },
      { 'order_key:desc': {} },
      { 'order_by_item:id': {} },
      { 'limit_clause:': {} },
      { 'limit_clause:limit number': {} },
      { 'limit_clause:limit number , number': {} },
      {
        'exp:number': {
          action: function ($): ExpNode {
            let n = $[0] as number;
            return {
              op: 'immediate_num',
              value: n,
              children: [],
            };
          },
        },
      },
      {
        'exp:string': {
          action: function ($): ExpNode {
            let n = $[0] as string;
            return {
              op: 'immediate_string',
              value: n,
              children: [],
            };
          },
        },
      },
      {
        'exp:id . id': {
          action: function ($): ExpNode {
            let tableName = $[0] as string;
            let fieldName = $[2] as string;
            return {
              op: 'getTableField',
              value: `${tableName}.${fieldName}`,
            };
          },
        },
      },
      {
        'exp:id': {
          action: function ($): ExpNode {
            let fieldName = $[0] as string;
            return {
              op: 'getfield',
              value: `${fieldName}`,
            };
          },
        },
      },
      {
        'exp:exp + exp': {
          action: function ($): ExpNode {
            let e1 = $[0] as ExpNode;
            let e2 = $[2] as ExpNode;
            return {
              op: 'add',
              children: [e1, e2],
            };
          },
        },
      },
      {
        'exp:exp - exp': {
          action: function ($): ExpNode {
            let e1 = $[0] as ExpNode;
            let e2 = $[2] as ExpNode;
            return {
              op: 'sub',
              children: [e1, e2],
            };
          },
        },
      },
      {
        'exp:exp * exp': {
          action: function ($): ExpNode {
            let e1 = $[0] as ExpNode;
            let e2 = $[2] as ExpNode;
            return {
              op: 'mul',
              children: [e1, e2],
            };
          },
        },
      },
      {
        'exp:exp < exp': {
          action: function ($): ExpNode {
            let e1 = $[0] as ExpNode;
            let e2 = $[2] as ExpNode;
            return {
              op: 'lt',
              children: [e1, e2],
            };
          },
        },
      },
      {
        'exp:exp <= exp': {
          action: function ($): ExpNode {
            let e1 = $[0] as ExpNode;
            let e2 = $[2] as ExpNode;
            return {
              op: 'le',
              children: [e1, e2],
            };
          },
        },
      },
      {
        'exp:exp > exp': {
          action: function ($): ExpNode {
            let e1 = $[0] as ExpNode;
            let e2 = $[2] as ExpNode;
            return {
              op: 'gt',
              children: [e1, e2],
            };
          },
        },
      },
      {
        'exp:exp >= exp': {
          action: function ($): ExpNode {
            let e1 = $[0] as ExpNode;
            let e2 = $[2] as ExpNode;
            return {
              op: 'ge',
              children: [e1, e2],
            };
          },
        },
      },
      {
        'exp:exp = exp': {
          action: function ($): ExpNode {
            let e1 = $[0] as ExpNode;
            let e2 = $[2] as ExpNode;
            return {
              op: 'eq',
              children: [e1, e2],
            };
          },
        },
      },
      {
        'exp:exp / exp': {
          action: function ($): ExpNode {
            let e1 = $[0] as ExpNode;
            let e2 = $[2] as ExpNode;
            return {
              op: 'div',
              children: [e1, e2],
            };
          },
        },
      },
      {
        'exp:( exp )': {
          action: function ($): ExpNode {
            return $[1] as ExpNode;
          },
        },
      },
      {
        'exp:exp and exp': {
          action: function ($): ExpNode {
            let e1 = $[0] as ExpNode;
            let e2 = $[2] as ExpNode;
            return {
              op: 'and',
              children: [e1, e2],
            };
          },
        },
      },
      {
        'exp:exp or exp': {
          action: function ($): ExpNode {
            let e1 = $[0] as ExpNode;
            let e2 = $[2] as ExpNode;
            return {
              op: 'or',
              children: [e1, e2],
            };
          },
        },
      },
      { 'exp:if exp then exp else exp end': {} },
      { 'exp:if exp then exp elseif_list else exp end': {} },
      { 'elseif_list:elseif_list elseif_item': {} },
      { 'elseif_list:elseif_item': {} },
      { 'elseif_item:elseif exp then exp': {} },
      { 'exp:id ( argu_list )': {} },
      { 'argu_list:ε': {} },
      { 'argu_list:argu_item , argu_list': {} },
      { 'argu_list:argu_item': {} },
      { 'argu_item:exp': {} },
    ],
  };
  let tscc = new TSCC(grammar, { debug: false, language: 'zh-cn' });
  let compilerSorce = tscc.generate();
  fs.writeFileSync('./src/tools/SQLParser.ts', compilerSorce!);
  console.log('geneate end');
}
gen();
