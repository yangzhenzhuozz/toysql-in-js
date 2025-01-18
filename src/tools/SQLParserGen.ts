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
            let where_clause = $[3] as ExpNode | undefined;
            if (where_clause) {
              tableView = tableView.where(where_clause);
            }
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
              targetName: `${exp.targetName} as ${id}`,
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
      {
        'tableView:( query ) as  id': {
          action: function ($): DataSet<any> {
            let query = $[1] as DataSet<any>;
            let id = $[4] as string;
            return query.alias(id);
          },
        },
      },
      {
        'where_clause:': {
          action: function () {
            //什么也不做
          },
        },
      },
      {
        'where_clause:where where_condition': {
          action: function ($, stack): ExpNode {
            return $[1] as ExpNode;
          },
        },
      },
      {
        'where_condition:exp': {
          action: function ($): ExpNode {
            return $[0] as ExpNode;
          },
        },
      },
      {
        'group_clause:': {
          action: function () {
            //什么也不做
          },
        },
      },
      {
        'group_clause:group by group_list having_clause': {
          action: function ($): ExpNode {
            let group_list = $[2] as ExpNode[];
            let having_clause = $[3] as ExpNode | undefined;
            let targetName = '';
            for (let i = 0; i < group_list.length; i++) {
              if (i == 0) {
                targetName += group_list[i].targetName;
              } else {
                targetName += ',' + group_list[i].targetName;
              }
            }
            if (having_clause != undefined) {
              targetName += 'having ' + having_clause?.targetName;
              return {
                op: 'group_having',
                children: [...group_list, having_clause],
                targetName: targetName,
              };
            } else {
              return {
                op: 'group',
                children: [...group_list],
                targetName: targetName,
              };
            }
          },
        },
      },
      {
        'group_list:group_list , group_item': {
          action: function ($): ExpNode[] {
            let group_list = $[0] as ExpNode[];
            let group_item = $[2] as ExpNode;
            return [...group_list, group_item];
          },
        },
      },
      {
        'group_list:group_item': {
          action: function ($): ExpNode[] {
            let group_item = $[0] as ExpNode;
            return [group_item];
          },
        },
      },
      {
        'group_item:exp': {
          action: function ($): ExpNode {
            let group_item = $[0] as ExpNode;
            return group_item;
          },
        },
      }, //这里可能会导致性能问题，如:from t group by f1(t.v1) select f1(t.v1)，甚至是非常复杂的表达式计算，实在没时间做优化了
      { 'having_clause:': {} },
      { 'having_clause:having exp': {} },
      { 'order_clause:': {} },
      { 'order_clause:order by order_by_list': {} },
      { 'order_by_list:order_by_list , order_by_item': {} },
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
              op: 'immediate_val',
              value: n,
              targetName: n.toString(),
            };
          },
        },
      },
      {
        'exp:string': {
          action: function ($): ExpNode {
            let n = $[0] as string;
            return {
              op: 'immediate_val',
              value: n,
              targetName: n,
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
              targetName: `${tableName}.${fieldName}`,
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
              targetName: fieldName,
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
              targetName: `${e1.targetName} + ${e2.targetName}`,
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
              targetName: `${e1.targetName} - ${e2.targetName}`,
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
              targetName: `${e1.targetName} * ${e2.targetName}`,
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
              targetName: `${e1.targetName} < ${e2.targetName}`,
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
              targetName: `${e1.targetName} <= ${e2.targetName}`,
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
              targetName: `${e1.targetName} > ${e2.targetName}`,
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
              targetName: `${e1.targetName} >= ${e2.targetName}`,
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
              targetName: `${e1.targetName} = ${e2.targetName}`,
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
              targetName: `${e1.targetName} / ${e2.targetName}`,
            };
          },
        },
      },
      {
        'exp:( exp )': {
          action: function ($): ExpNode {
            let exp = $[1] as ExpNode;
            exp.targetName = `(${exp.targetName})`;
            return exp;
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
              targetName: `${e1.targetName} and ${e2.targetName}`,
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
              targetName: `${e1.targetName} or ${e2.targetName}`,
            };
          },
        },
      },
      {
        'exp:if exp then exp else exp end': {
          action: function ($): ExpNode {
            let condition = $[1] as ExpNode;
            let exp1 = $[3] as ExpNode;
            let exp2 = $[5] as ExpNode;
            return {
              op: 'if-else',
              children: [condition, exp1, exp2],
              targetName: `if ${condition.targetName} then ${exp1.targetName} else ${exp2.targetName}`,
            };
          },
        },
      },
      {
        'exp:if exp then exp elseif_list else exp end': {
          action: function ($): ExpNode {
            let condition = $[1] as ExpNode;
            let exp1 = $[3] as ExpNode;
            let elseif_list = $[4] as ExpNode[];
            let else_exp = $[6] as ExpNode;
            let elseif_list_name = '';
            for (let i = 0; i < elseif_list.length; i += 2) {
              elseif_list_name += `elseif ${elseif_list[i].targetName} then ${elseif_list[i + 1].targetName}`;
            }
            return {
              op: 'if-elseif-else',
              children: [condition, exp1, ...elseif_list, else_exp],
              targetName: `if ${condition.targetName} then ${exp1.targetName} ${elseif_list_name} else ${else_exp.targetName}`,
            };
          },
        },
      },
      {
        'elseif_list:elseif_list elseif_item': {
          action: function ($): ExpNode[] {
            let elseif_list = $[0] as ExpNode[];
            let elseif_item = $[1] as ExpNode[];
            return [...elseif_list, ...elseif_item];
          },
        },
      },
      {
        'elseif_list:elseif_item': {
          action: function ($): ExpNode[] {
            return $[0] as ExpNode[];
          },
        },
      },
      {
        'elseif_item:elseif exp then exp': {
          action: function ($): ExpNode[] {
            let exp = $[1] as ExpNode;
            let else_exp = $[3] as ExpNode;
            return [exp, else_exp];
          },
        },
      },
      {
        'exp:id ( argu_list )': {
          action: function ($): ExpNode {
            let id = $[0] as string;
            let args = $[2] as ExpNode[];
            let argNames = '';
            for (let i = 0; i < args.length; i++) {
              if (i == 0) {
                argNames += args[i].targetName;
              } else {
                argNames += ',' + args[i].targetName;
              }
            }
            return {
              op: 'call',
              value: id,
              children: args,
              targetName: `${id}(${argNames})`,
            };
          },
        },
      },
      {
        'argu_list:ε': {
          action: function ($): ExpNode[] {
            return [];
          },
        },
      },
      {
        'argu_list:argu_list , exp': {
          action: function ($): ExpNode[] {
            let argu_list = $[0] as ExpNode[];
            let exp = $[2] as ExpNode;
            return [...argu_list, exp];
          },
        },
      },
      {
        'argu_list:exp': {
          action: function ($): ExpNode[] {
            return [$[0] as ExpNode];
          },
        },
      },
    ],
  };
  let tscc = new TSCC(grammar, { debug: false, language: 'zh-cn' });
  let compilerSorce = tscc.generate();
  fs.writeFileSync('./src/tools/SQLParser.ts', compilerSorce!);
  console.log('geneate end');
}
gen();
