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
  public registTableView(dataset: DataSet<any>, name: string) {
    let tableName = name;
    assert(tableName != undefined);
    if (this._tableView[tableName] != undefined) {
      throw `表:${name}已经存在`;
    } else {
      this._tableView[tableName] = new DataSet(dataset.data);
    }
  }
  public sql(src: string): DataSet<any> {
    return Parse(new Lexical(src), this);
  }
}
