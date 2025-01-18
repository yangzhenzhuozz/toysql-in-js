import { assert } from './assert.js';
import { ExpNode, valueType } from './ExpTree.js';

export interface FieldType {
  name: string;
  type: 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function';
}
let udf: {
  [key: string]:
    | {
        type: 'normal';
        handler: (...args: (valueType | undefined)[]) => valueType | undefined;
      }
    | {
        type: 'aggregate';
        handler: (list: (valueType | undefined)[]) => valueType | undefined;
      };
} = {
  concat: {
    type: 'normal',
    handler: (...args) => {
      return args.reduce((p, c) => `${p}${c}`);
    },
  },
  count: {
    type: 'aggregate',
    handler: (list) => {
      return list.length;
    },
  },
  sum: {
    type: 'aggregate',
    handler: (list) => {
      assert(typeof list[0] == 'number', 'sum只能累加数字');
      return list.reduce((p, c) => <number>p + <number>c);
    },
  },
};
export class DataSet<T extends { [key: string]: any }> {
  private schemaIdx: { [key: string]: string } = {};
  public data: T[] = [];
  public name?: string;

  public constructor(arr: T[], name?: string) {
    this.name = name;
    for (let k in arr[0]) {
      let fieldName = `${name ?? ''}.${k}`;
      this.schemaIdx[fieldName] = k;
    }
    this.data = arr;
  }
  public alias(name: string): DataSet<T> {
    return new DataSet(this.data, name);
  }

  //深度遍历执行
  private execExp(exp: ExpNode, row: T): ExpNode {
    /**
     * 直接从缓存结果返回数据(比如用group by做了一次函数计算),
     * select
     *  left(name,4),//这里直接使用group by的计算结果
     *  left(name,4)+'a' //这里可以使用前一列的计算结果
     * from
     *  table
     * group by
     *  left(name,4)
     */
    if (row[exp.targetName] != undefined) {
      return {
        op: 'immediate_val',
        targetName: exp.targetName,
        value: row[exp.targetName],
      };
    }

    let { op, children } = exp;
    let result: valueType | undefined = undefined;
    let l_Child: ExpNode;
    let r_Child: ExpNode;
    switch (op) {
      case 'immediate_val':
        result = exp.value;
        break;
      case 'alias':
        result = this.execExp(children![0], row).value;
        break;
      case 'getTableField':
        let fieldName = exp.value as string;
        let idx = this.schemaIdx[fieldName];
        if (idx == undefined) {
          throw `Invalid field name: ${fieldName},if you select a field before group,the field must in group keys`;
        }
        result = row[idx];
        break;
      case 'getfield':
        let fieldName2 = exp.value as string;
        if (row[fieldName2] == undefined) {
          throw `Table: ${this.name} does not have field: ${fieldName2},if you select a field before group,the field must in group keys`;
        }
        result = row[fieldName2];
        break;
      case 'mod':
        l_Child = this.execExp(children![0], row);
        r_Child = this.execExp(children![1], row);
        if (typeof l_Child.value === 'number' && typeof r_Child.value === 'number') {
          result = l_Child.value! % r_Child.value!;
        } else {
          throw 'Unsupported type';
        }
        break;
      case 'add':
        l_Child = this.execExp(children![0], row);
        r_Child = this.execExp(children![1], row);
        if (typeof l_Child.value !== 'number' || typeof r_Child.value !== 'number') {
          result = l_Child.value!.toString() + r_Child.value!.toString();
        } else {
          result = l_Child.value! + r_Child.value!;
        }
        break;
      case 'sub':
        l_Child = this.execExp(children![0], row);
        r_Child = this.execExp(children![1], row);
        if (typeof l_Child.value === 'number' && typeof r_Child.value === 'number') {
          result = l_Child.value! - r_Child.value!;
        } else {
          throw 'Unsupported type';
        }
        break;
      case 'mul':
        l_Child = this.execExp(children![0], row);
        r_Child = this.execExp(children![1], row);
        if (typeof l_Child.value === 'number' && typeof r_Child.value === 'number') {
          result = l_Child.value! * r_Child.value!;
        } else {
          throw 'Unsupported type';
        }
        break;
      case 'div':
        l_Child = this.execExp(children![0], row);
        r_Child = this.execExp(children![1], row);
        if (typeof l_Child.value === 'number' && typeof r_Child.value === 'number') {
          result = l_Child.value! / r_Child.value!;
        } else {
          throw 'Unsupported type';
        }
        break;
      case 'gt':
        l_Child = this.execExp(children![0], row);
        r_Child = this.execExp(children![1], row);
        result = l_Child.value! > r_Child.value!;
        break;
      case 'ge':
        l_Child = this.execExp(children![0], row);
        r_Child = this.execExp(children![1], row);
        result = l_Child.value! >= r_Child.value!;
        break;
      case 'lt':
        l_Child = this.execExp(children![0], row);
        r_Child = this.execExp(children![1], row);
        result = l_Child.value! < r_Child.value!;
        break;
      case 'le':
        l_Child = this.execExp(children![0], row);
        r_Child = this.execExp(children![1], row);
        result = l_Child.value! <= r_Child.value!;
        break;
      case 'eq':
        l_Child = this.execExp(children![0], row);
        r_Child = this.execExp(children![1], row);
        result = l_Child.value! == r_Child.value!;
        break;
      case 'and':
        l_Child = this.execExp(children![0], row);
        r_Child = this.execExp(children![1], row);
        result = l_Child.value! && r_Child.value!;
        break;
      case 'or':
        l_Child = this.execExp(children![0], row);
        r_Child = this.execExp(children![1], row);
        result = l_Child.value! || r_Child.value!;
        break;
      case 'if-else':
        let if_else_condition = this.execExp(children![0], row);
        if (if_else_condition.value!) {
          result = this.execExp(children![1], row).value;
        } else {
          result = this.execExp(children![2], row).value;
        }
        break;
      case 'if-elseif-else':
        for (let i = 0; i < children!.length - 2; i += 2) {
          let condition = (children![i], row);
          if (condition.value!) {
            result = this.execExp(children![i + 1], row).value;
            break;
          }
        }
        if (result == undefined) {
          result = this.execExp(children![children!.length - 1], row).value;
        }
        break;
      case 'call':
        let fun_name = exp.value as string;
        if (udf[fun_name] == undefined) {
          throw `未定义函数:${fun_name}`;
        }
        if (udf[fun_name].type == 'aggregate') {
          if (row['@totalGroupValues'] == undefined) {
            throw `还没有group by的表不能使用聚合函数${fun_name}`;
          } else if (children!.length > 1) {
            throw `聚合函数目前只支持0个或者1个参数`;
          } else {
            let list = [] as valueType[];
            if (children!.length == 1) {
              for (let subLine of row['@totalGroupValues']) {
                let arg = this.execExp(children![0], subLine).value!;
                list.push(arg);
              }
              result = udf[fun_name].handler(list);
            } else {
              result = udf[fun_name].handler(row['@totalGroupValues']);
            }
          }
        } else {
          let args: (valueType | undefined)[] = [];
          for (let c of children!) {
            args.push(this.execExp(c, row).value);
          }
          result = udf[fun_name].handler(...args);
        }
        break;
      default:
        throw `Undefined opcode: ${op}`;
    }
    assert(result != undefined, '有bug,没有返回正确的值');
    return {
      op: 'immediate_val',
      value: result,
      targetName: exp.targetName,
    };
  }
  public select(exps: ExpNode[]): DataSet<any> {
    let ret = [] as any[];
    for (let row of this.data) {
      let tmpRow = {} as any;
      for (let i = 0; i < exps.length; i++) {
        let cell = this.execExp(exps[i], row);
        if (tmpRow[cell.targetName!] != undefined) {
          throw `select重复属性:${cell.targetName!}`;
        }
        tmpRow[cell.targetName!] = cell.value!;
      }
      ret.push(tmpRow);
    }
    return new DataSet(ret, this.name);
  }
  public where(exp: ExpNode) {
    let ret = [] as any[];
    for (let row of this.data) {
      let condition = this.execExp(exp, row);
      if (condition.value) {
        ret.push(row);
      }
    }
    return new DataSet(ret, this.name);
  }
  public group(exps: ExpNode[]) {
    let ds = [] as any[];
    let groupKeys = new Set<string>();
    for (let i = 0; i < this.data.length; i++) {
      let row = this.data[i];
      let tmpRow = { ...row } as any;
      let groupValues = [] as valueType[];
      for (let exp of exps) {
        let cell = this.execExp(exp, row);

        //只在第一行判断group key
        if (i == 0) {
          if (groupKeys.has(cell.targetName!)) {
            throw `group重复属性:${cell.targetName!}`;
          }
          groupKeys.add(cell.targetName);
        }

        tmpRow[cell.targetName!] = cell.value!;
        groupValues.push(cell.value!);
      }
      tmpRow['@totalGroupValues'] = groupValues.map((item) => item.toString()).reduce((p, c) => p + ',' + c);
      ds.push(tmpRow);
    }

    let groupObj = Object.groupBy(ds, (row) => row['@totalGroupValues']);
    let groupDs = [] as any[];
    for (let gk in groupObj) {
      let tmpRow = {} as any;
      let group = groupObj[gk]!;
      for (let k of groupKeys) {
        tmpRow[k] = group[0][k];
      }
      tmpRow['@totalGroupValues'] = group;
      groupDs.push(tmpRow);
    }

    return new DataSet(groupDs, this.name);
  }
  public orderBy(exps: ExpNode[]) {
    let ds = [] as any[];
    let orderKeys = [] as { name: string; order: 'asc' | 'desc' }[];
    for (let i = 0; i < this.data.length; i++) {
      let row = this.data[i];
      let tmpRow = { ...row } as any;
      for (let exp of exps) {
        let ret = this.execExp(exp.children![0], row);
        if (exp.order !== 'asc') {
        } else {
        }
        let orderKey = exp.targetName;
        tmpRow[orderKey] = ret.value;

        //只在第一行判断group key
        if (i == 0) {
          orderKeys.push({
            name: orderKey,
            order: exp.order!,
          });
        }
      }
      ds.push(tmpRow);
    }
    let compare = (a: any, b: any): number => {
      for (let k of orderKeys) {
        if (k.order == 'asc') {
          if (a[k.name] < b[k.name]) {
            return -1;
          } else if (a[k.name] > b[k.name]) {
            return 1;
          }
        } else {
          if (a[k.name] < b[k.name]) {
            return 1;
          } else if (a[k.name] > b[k.name]) {
            return -1;
          }
        }
      }
      return 0;
    };
    ds.sort(compare);
    return new DataSet(ds, this.name);
  }
  public limit(exp: ExpNode): DataSet<any> {
    let n1 = exp.limit![0];
    let n2 = exp.limit![1];
    let ds = this.data;
    if (n2 == undefined) {
      ds = ds.slice(0, n1);
    } else {
      ds = ds.slice(n1 - 1, n2);
    }
    return new DataSet(ds, this.name);
  }
  public leftJoin(rt: DataSet<any>, exp: ExpNode): DataSet<any> {
    if(exp.op=='eq'){//确认下面只有一层,而且是getField或者是getTableField

    }else{
      console.warn(`非等值连接得上笛卡尔积，你可以考虑换成等值连接`);
    }
    throw 'unimpliment';
  }
}
