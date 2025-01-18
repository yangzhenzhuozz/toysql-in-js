import { assert } from './assert.js';
import { DataSet } from './DataSet.js';
import { Lexical } from './Lexical.js';
import Parse from './SQLParser.js';
export class SQLSession {
  private _tableView: {
    [key: string]: DataSet<any>;
  } = {};
  get tableView(): {
    [key: string]: DataSet<any>;
  } {
    return this._tableView;
  }
  public registTableView(dataset: DataSet<any>) {
    let tableName = dataset.name;
    assert(tableName != undefined, '必须注册一个有名字的表');
    if (this._tableView[tableName] != undefined) {
      throw `表:${name}已经存在`;
    } else {
      this._tableView[tableName] = dataset;
    }
  }
  public sql(src: string): DataSet<any> {
    return Parse(new Lexical(src), this);
  }
}
