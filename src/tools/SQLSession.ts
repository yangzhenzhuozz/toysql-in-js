import { assert } from './assert.js';
import { DataSet, UDF } from './DataSet.js';
import { valueType } from './ExpTree.js';
import { Lexical } from './Lexical.js';
import Parse from './SQLParser.js';
export class SQLSession {
  public tableView: {
    [key: string]: DataSet<any>;
  } = {};
  public udf: UDF = {
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
  public registTableView(dataset: DataSet<any>) {
    let tableName = dataset.name;
    assert(tableName != undefined, '必须注册一个有名字的表');
    if (this.tableView[tableName] != undefined) {
      throw `表:${name}已经存在`;
    } else {
      this.tableView[tableName] = dataset;
      dataset.session = this;
    }
  }
  public reisgerUDF(
    name: string,
    obj:
      | {
          type: 'normal';
          handler: (...args: (valueType | undefined)[]) => valueType | undefined;
        }
      | {
          type: 'aggregate';
          handler: (list: (valueType | undefined)[]) => valueType | undefined;
        }
  ) {
    this.udf[name] = obj;
  }
  public sql(src: string): DataSet<any> {
    return Parse(new Lexical(src), this);
  }
}
