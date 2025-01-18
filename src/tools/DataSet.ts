import { assert } from './assert.js';
import { ExpNode, valueType } from './ExpTree.js';

export interface FieldType {
  name: string;
  type: 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function';
}
let udf: { [key: string]: (...args: (valueType | undefined)[]) => valueType | undefined } = {
  concat: (...args: (valueType | undefined)[]): valueType | undefined => {
    return args.reduce((p, c) => `${p},${c}`);
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
    let { op, children } = exp;
    let result: valueType | undefined = undefined;
    let targetName = exp.targetName;
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
          throw `Invalid field name: ${fieldName}`;
        }
        result = row[idx];
        break;
      case 'getfield':
        let fieldName2 = exp.value as string;
        if (row[fieldName2] == undefined) {
          throw `Table: ${this.name} does not have field: ${fieldName2}`;
        }
        result = row[fieldName2];
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
          result = l_Child.value! - l_Child.value!;
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
        let args: (valueType | undefined)[] = [];
        for (let c of children!) {
          args.push(this.execExp(c, row).value);
        }
        result = udf[fun_name](...args);
        break;
      default:
        throw `Undefined opcode: ${op}`;
    }
    assert(result != undefined, '有bug,没有返回正确的值');
    return {
      op: 'immediate_val',
      value: result,
      targetName,
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
}
