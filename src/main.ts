import { DataSet } from './tools/DataSet.js';
import { SQLSession } from './tools/SQLSession.js';
let code1 = `
select
    concat(),
    concat(1),
    concat(1,2),
    id,
    if id=1 then 'id是1' elseif id=2 then 'id是2' elseif id=3 then 'id是3' else 'id不是1，2，3' end,
    if id=1 then 'id是1' else 'id 不是 1' end as _c,
    t1.id as c0,
    id as c1,
    t1.id as cc,
    name as c2
from
    aaa as t1
`;
let code2 = `
select
    t1.id,
    1=1,
    id,
    name,
    concat(id,name,1)
from
    t1
where id=1 or name='danny'
`;

let arr: { id: number; name: string }[] = [
  { id: 1, name: 'john' },
  { id: 2, name: 'kelly' },
  { id: 3, name: 'danny' },
];
for (let i = 0; i < 3; i++) {
  arr.push({ id: i, name: 'id_' + i });
}


let ds = new DataSet(arr, 't1');

let session = new SQLSession();
session.registTableView(ds);

console.time('Execution Time');
let ret = session.sql(code2);
console.table(ret.data);
console.timeEnd('Execution Time');
