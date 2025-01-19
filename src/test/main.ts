import { DataSet, SQLSession } from '../main.js';
import { assert } from '../tools/assert.js';

let sql = `
select
    max(score) as max
from
    t1 as cc
group by
  1
`;
let arr = [
  { id: 1, gender: '男', name: 'john', score: 10 },
  { id: 2, gender: '女', name: 'kelly', score: 11 },
  { id: 12, gender: '女', name: 'danny', score: 15 },
];
let arr2 = [
  { id: 2, idx: 2, score2: 15 },
  { id: 2, idx: 2, score2: 99 },
  { id: 3, idx: 3, score2: 17 },
];

//创建两个数据集
let ds = new DataSet(arr, 't1');
let ds2 = new DataSet(arr2, 't2');

//把集合注册到Session中
let session = new SQLSession();
session.reisgerUDF('max', {
  type: 'aggregate',
  handler: function (list) {
    assert(typeof list[0] == 'number', 'max只能用于数字');
    return Math.max(...(<number[]>list));
  },
});
session.registTableView(ds);
session.registTableView(ds2);

console.log(`开始执行`);
console.time('Execution Time');
let ret = session.sql(sql);
console.table(ret.data);
console.timeEnd('Execution Time');
