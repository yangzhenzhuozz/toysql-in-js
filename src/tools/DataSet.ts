import { assert } from './assert.js';
import { ExpNode, valueType } from './ExpTree.js';
import { SQLSession } from './SQLSession.js';

export interface FieldType {
  name: string;
  type: 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function';
}
export type UDF = {
  [key: string]:
    | {
        type: 'normal';
        handler: (...args: (valueType | undefined)[]) => valueType | undefined;
      }
    | {
        type: 'aggregate';
        handler: (list: (valueType | undefined)[]) => valueType | undefined;
      };
};

export class DataSet<T extends { [key: string]: any }> {
  public data: T[] = [];
  public name?: string;
  public session: SQLSession | undefined;

  /**
   * 通过表名.字段形式索引时，得到在数据集中的真实id，假设当前表名是t1，数据集里面的真实记录是[{id:1,name:john}],
   * 则通过 t1.name真实访问的是name
   */
  private tableNameToField: {
    [key: string]: {
      [key: string]: string;
    };
  } = {};
  private fiels: Set<string> = new Set();
  public constructor(arr: T[], name?: string, session?: SQLSession) {
    this.name = name;
    this.data = arr;
    this.fiels = new Set(Object.keys(arr[0]));
    if (name != undefined) {
      this.tableNameToField = this.createTableNameToField(arr, name);
    }
    if (session != undefined) {
      this.session = session;
    }
  }

  //用于创建t1.c1 => c1 t2.id=>t2.id 的映射(id在两个表中都有,c1只在t1中有,所以映射结果不同)
  private createTableNameToField(arr: any[], t: string, duplicateKey?: Set<string>) {
    let tableNameToField: {
      [key: string]: {
        [key: string]: string;
      };
    } = { [t]: {} };
    for (let k in arr[0]) {
      if (duplicateKey == undefined || !duplicateKey.has(k)) {
        tableNameToField[t][k] = k;
      } else {
        tableNameToField[t][k] = `${this.name}.${k}`;
      }
    }
    return tableNameToField;
  }
  //笛卡尔积
  private cross(f1: any[], f2: any, t1: string, t2: string, duplicateKey: Set<string>) {
    let ret = [];
    for (let r1 of f1) {
      for (let r2 of f2) {
        let tmpRow = {} as any;
        for (let k in r1) {
          if (duplicateKey.has(k)) {
            tmpRow[`${t1}.${k}`] = r1[k];
          } else {
            tmpRow[k] = r1[k];
          }
        }
        for (let k in r2) {
          if (duplicateKey.has(k)) {
            tmpRow[`${t2}.${k}`] = r2[k];
          } else {
            tmpRow[k] = r2[k];
          }
        }
        ret.push(tmpRow);
      }
    }
    return ret;
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
    if (row[exp.targetName] != undefined && exp.op != 'immediate_val') {
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
        let [tableName, fieldName] = (<string>exp.value).split('.');
        if (this.tableNameToField[tableName][fieldName] == undefined) {
          throw `Invalid field name: ${tableName}.${fieldName},if you select a field before group,the field must in group keys`;
        }
        result = row[this.tableNameToField[tableName][fieldName]];
        break;
      case 'getfield':
        let fieldName2 = exp.value as string;
        if (!this.fiels.has(fieldName2)) {
          throw `Table: ${this.name} does not have field: ${fieldName2}`;
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
      case 'not':
        l_Child = this.execExp(children![0], row);
        result = !l_Child.value!;
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
          let condition = this.execExp(children![i], row);
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
        if (this.session!.udf[fun_name] == undefined) {
          throw `未定义函数:${fun_name}`;
        }
        if (this.session!.udf[fun_name].type == 'aggregate') {
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
              result = this.session!.udf[fun_name].handler(list);
            } else {
              result = this.session!.udf[fun_name].handler(row['@totalGroupValues']);
            }
          }
        } else {
          let args: (valueType | undefined)[] = [];
          for (let c of children!) {
            args.push(this.execExp(c, row).value);
          }
          result = this.session!.udf[fun_name].handler(...args);
        }
        break;
      default:
        throw `Undefined opcode: ${op}`;
    }
    return {
      op: 'immediate_val',
      value: result,
      targetName: exp.targetName,
    };
  }
  //排序连接
  private sortMergeJoin(
    other: DataSet<any>,
    option: {
      k1: string;
      k2: string;
      t1: string;
      t2: string;
      duplicateKey: Set<string>;
    }
  ): any[] {
    let compare = (ka: string, kb: string) => {
      return (a: any, b: any) => {
        if (a[ka] < b[kb]) {
          return -1;
        } else if (a[ka] > b[kb]) {
          return 1;
        } else {
          return 0;
        }
      };
    };
    //搜索窗口区间
    let windowFrame = (arr: any[], start: number, k: string) => {
      if (start >= arr.length) {
        return 0;
      }
      let v = arr[start][k];
      let idx = start + 1;
      for (; idx < arr.length && arr[idx][k] == v; idx++) {}
      return idx - start;
    };

    let arr1 = Array.from(this.data);
    let arr2 = Array.from(other.data);

    arr1.sort(compare(option.k1, option.k1)); //a集合排序
    arr2.sort(compare(option.k2, option.k2)); //b集合排序

    //开始进行连接
    let idx1 = 0;
    let idx2 = 0;

    let ret = [] as any[];
    //arr2没有和arr1配得上的时候使用
    let empty2 = {} as any;
    for (let obj_k in arr2[0]) {
      empty2[obj_k] = null;
    }
    for (; idx1 < arr1.length; ) {
      let cmp: number;

      //arr2已经走完了
      if (idx2 < arr2.length) {
        cmp = compare(option.k1, option.k2)(arr1[idx1], arr2[idx2]);
      } else {
        cmp = 1;
      }

      let w1 = windowFrame(arr1, idx1, option.k1);
      let w2 = windowFrame(arr2, idx2, option.k2);
      let f1 = arr1.slice(idx1, idx1 + w1);
      if (cmp < 0 || w2 == 0) {
        ret.push(...this.cross(f1, [empty2], option.t1, option.t2, option.duplicateKey));
        idx1 += w1;
      } else if (cmp > 0) {
        idx2 += w2;
      } else {
        let f2 = arr2.slice(idx2, idx2 + w2);
        ret.push(...this.cross(f1, f2, option.t1, option.t2, option.duplicateKey));
        idx1 += w1;
        idx2 += w2;
      }
    }
    return ret;
  }
  public alias(name: string): DataSet<T> {
    return new DataSet(this.data, name, this.session);
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
    return new DataSet(ret, this.name, this.session);
  }
  public where(exp: ExpNode): DataSet<T> {
    let ret = [] as any[];
    for (let row of this.data) {
      let condition = this.execExp(exp, row);
      if (condition.value) {
        ret.push(row);
      }
    }
    return new DataSet(ret, this.name, this.session);
  }
  public group(exps: ExpNode[]): DataSet<any> {
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
    let groupBy = (array: any[], key: string) => {
      return array.reduce((result, currentValue) => {
        (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
        return result;
      }, {});
    };
    let groupObj = groupBy(ds, '@totalGroupValues');
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

    let ret = new DataSet(groupDs, this.name, this.session);
    ret.tableNameToField = this.tableNameToField;
    return ret;
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
    return new DataSet(ds, this.name, this.session);
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
    return new DataSet(ds, this.name, this.session);
  }
  public leftJoin(other: DataSet<any>, exp: ExpNode): DataSet<any> {
    let retArr = [] as any[];

    assert(this.name != undefined);
    assert(other.name != undefined);

    //构造key
    let tableKey: {
      [key: string]: {
        table: string;
        id: string;
      };
    } = {}; //把a.c1映射到a.c1

    let keyTable: {
      [key: string]: {
        table: string;
        id: string;
      };
    } = {}; //把c1映射到a.c1
    //上面两个映射用于快速判断这个join是否可以进行优化

    let duplicateKey = new Set<string>(); //两个表重复的id

    for (let k in this.data[0]) {
      tableKey[`${this.name}.${k}`] = {
        table: this.name,
        id: k,
      };
      keyTable[k] = {
        table: this.name!,
        id: k,
      };
    }
    for (let k in other.data[0]) {
      tableKey[`${other.name}.${k}`] = {
        table: other.name,
        id: k,
      };
      if (keyTable[k] == undefined) {
        keyTable[k] = {
          table: other.name!,
          id: k,
        };
      } else {
        duplicateKey.add(k);
        delete keyTable[k]; //两个表都有同样的字段，直接删除，不能再直接使用id取字段
      }
    }

    if (exp.op == 'eq') {
      let [exp1, exp2] = exp.children!;
      let f1 = exp1.op == 'getfield' ? keyTable[exp1.value as string] : tableKey[exp1.value as string];
      let f2 = exp2.op == 'getfield' ? keyTable[exp2.value as string] : tableKey[exp2.value as string];

      if (f1 != undefined && f2 != undefined && f1.table != f2.table) {
        //开始连接
        retArr = this.sortMergeJoin(other, {
          t1: this.name,
          t2: other.name,
          k1: f1.id,
          k2: f2.id,
          duplicateKey,
        });
        let ret = new DataSet(retArr, undefined, this.session);
        ret.tableNameToField = { ...this.createTableNameToField(this.data, this.name, duplicateKey), ...this.createTableNameToField(other.data, other.name, duplicateKey) };
        return ret;
      }
    }
    //只有左右表各直接选择一个字段进行等值连接才能优化
    console.warn(`只有从两个表各取一个字段等值连接有优化,其他情况使用笛卡尔积连接，请考虑优化`);
    retArr = this.cross(this.data, other.data, this.name, other.name, duplicateKey);
    let crossResult = new DataSet(retArr, undefined, this.session);
    let result = crossResult.where(exp);
    result.name = `@crossResult`;
    result.tableNameToField = { ...this.createTableNameToField(this.data, this.name, duplicateKey), ...this.createTableNameToField(other.data, other.name, duplicateKey) };
    return result;
  }
}
