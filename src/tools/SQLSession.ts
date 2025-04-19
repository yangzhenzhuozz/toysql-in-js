import { assert } from './assert.js';
import { DataSet, UDF, UDFHanler } from './DataSet.js';
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
        assert(typeof list[0][0] == 'number', 'sum只能累加数字');
        return list.map((item) => item[0]).reduce((p, c) => <number>p + <number>c); //只取第一列的值累加
      },
    },
    row_number: {
      type: 'windowFrame',
      handler: (list) => {
        let ret = [] as number[];
        for (let i = 1; i < list.length + 1; i++) {
          ret.push(i);
        }
        return ret; //只取第一列的值累加
      },
    },
  };
  public registTableView(dataset: DataSet<any>) {
    let tableName = dataset.name;
    assert(tableName != undefined, '必须注册一个有名字的表');
    if (this.tableView[tableName] != undefined) {
      throw `表:${tableName}已经存在`;
    } else {
      this.tableView[tableName] = dataset;
      dataset.session = this;
    }
  }
  public reisgerUDF(name: string, obj: UDFHanler) {
    this.udf[name] = obj;
  }
  public sql(src: string): DataSet<any> {
    return Parse(new Lexical(src), this);
  }
}
