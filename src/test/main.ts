import { DataSet } from '../tools/DataSet.js';
import { SQLSession } from '../tools/SQLSession.js';

//测试多个窗口分区函数,每个分区里面有多个分区字段
let sql = `
select
  *, row_number() over()
from
  test
order by id1 asc
`;
let arr = [];
let size = 100000;
for (let i = 0; i < size; i++) {
  arr.push({ id1: i, id2: size - i });
}
let session = new SQLSession();
session.registTableView(new DataSet(arr, 'test'));

console.log(`开始执行`);
console.time('Execution Time');
let ret = session.sql(sql);
console.table(ret.data.slice(0, 10));
console.timeEnd('Execution Time');