import { DataSet, SQLSession } from '../main.js';

let sql = `
select
  t1.id,max(score),t1.id as v1
from
  t1 left join t2 as B on t1.id=B.idx
group by t1.id
order by max(score)
`;
let arr = [
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
];
let arr2 = [
  { idx: 2, score: 5 },
  { idx: 2, score: 8 },
  { idx: 3, score: 10 },
];

//创建两个数据集
let ds = new DataSet(arr, 't1');
let ds2 = new DataSet(arr2, 't2');

//把集合注册到Session中
let session = new SQLSession();
session.reisgerUDF('max', {
  type: 'aggregate',
  handler: function (list: number[]) {
    let ret = list[0];
    for (let v of list) {
      if (v == undefined) {
        return null;
      }
      ret = Math.max(ret, v);
    }
    return ret;
  },
});
session.registTableView(ds);
session.registTableView(ds2);

console.log(`开始执行`);
console.time('Execution Time');
let ret = session.sql(sql);
console.table(ret.data);
console.timeEnd('Execution Time');
