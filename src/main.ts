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
    t1 as t1
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
let code3 = `
select * from (
select
    t1.id,
    1=1,
    id,
    name,
    concat(id,name,1)
from
    t1
) as aaa
 where aaa.id=1
`;

let code4 = `
select
concat(id,gender)
from
    t1
group by id,gender,concat('id_',id,'_haha'),concat('id_',id,'_gender')
`;

let code5 = `
select
gender,id%2,count(),sum(score)
from
    t1
group by gender,id%2
`;
let code6 = `
select
gender,id%2,count(),sum(score)
from
    t1
group by gender,id%2
having gender='男' and sum(score)=30
`;
let code7 = `
select
  *
from
  t1
order by
  score desc
`;
let code8 = `
select
  *
from
  t1
order by
  score,concat(id) desc
`;
let code9 = `
select
  *
from
  t1
order by
  id
limit 1,2
`;
let arr = [
  { id: 1, gender: '男', name: 'john', score: 10 },
  { id: 2, gender: '女', name: 'kelly', score: 10 },
  { id: 3, gender: '男', name: 'danny', score: 10 },
  { id: 4, gender: '男', name: 'white', score: 10 },
  { id: 5, gender: '男', name: 'arm strong', score: 10 },
  { id: 6, gender: '女', name: 'sanndy', score: 20 },
];

let ds = new DataSet(arr, 't1');

let session = new SQLSession();
session.registTableView(ds);

console.time('Execution Time');
let ret = session.sql(code9);
console.table(ret.data);
console.timeEnd('Execution Time');
