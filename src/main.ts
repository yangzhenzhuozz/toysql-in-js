import { DataSet } from './tools/DataSet.js';
import { SQLSession } from './tools/SQLSession.js';
let code = `
select
    id,
    id=2 or id=1 as _c,
    t1.id as c0,
    id as c1,
    t1.id as cc,
    name as c2
from
    aaa as t1
`;

let arr: { id: number; name: string }[] = [
  { id: 1, name: 'john' },
  { id: 2, name: 'kelly' },
];
for (let i = 0; i < 3; i++) {
  arr.push({ id: i, name: 'id_' + i });
}
let ds = new DataSet(arr);
let session = new SQLSession();
session.registTableView(ds, 'aaa');
console.time('Execution Time');
let ret = session.sql(code).data;
console.table(ret);
console.timeEnd('Execution Time');
