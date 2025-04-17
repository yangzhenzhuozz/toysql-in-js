# 安装
npm i web-sql --production
# demo

```js
import { DataSet } from 'web-sql';
import { SQLSession } from 'web-sql';
let testCase: { [key: string]: string } = {
  code0:`select * from t1`,
  code1: `
select
    concat('a','a\\'b'),
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
`,
  code2: `
select
    t1.id,
    1=1,
    id,
    name,
    concat(id,name,1)
from
    t1
where id=1 or name='danny'
`,
  code3: `
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
`,
  code4: `
select
concat(id,gender)
from
    t1
group by id,gender,concat('id_',id,'_haha'),concat('id_',id,'_gender')
`,
  code5: `
select
gender,id%2,count(),sum(score)
from
    t1
group by gender,id%2
`,
  code6: `
select
gender,id%2,count(),sum(score)
from
    t1
group by gender,id%2
having gender='男' and sum(score)=30
`,
  code7: `
select
  *
from
  t1
order by
  score desc
`,
  code8: `
select
  *
from
  t1
order by
  score,concat(id) desc
`,
  code9: `
select
  *
from
  t1
order by
  id
limit 1,2
`,
  code10: `
select
  *
from
  t1 left join t2 on t1.id=t2.id
`,
  code11: `
select
  *
from
  t1 left join t2 on t1.id=1
`,
  code12: `
select
  *
from
  t1 left join t2 on t1.id=idx
`,
  code13: `
select
  *
from
  t1 left join t2 on 1=1
`,
  code14: `
select
  t1.gender
from
  t1 left join t2 on 1=1
`,
  code15: `
select
  t1.gender
from
  t1 left join t2 on 1=1
where t1.gender is null
`,
};

let arr = [
  { id: 1, gender: '男', name: 'john', score: 10 },
  { id: 2, gender: '女', name: 'kelly', score: 11 },
  { id: 12, gender: '女', name: 'danny', score: 15 },
  { id: 12, gender: null, name: 'danny', score: 15 },
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
session.registTableView(ds);
session.registTableView(ds2);

for (let k in testCase) {
  console.log(`开始执行:${testCase[k]}`);
  console.time('Execution Time');
  let ret = session.sql(testCase[k]);
  console.table(ret.data);
  console.timeEnd('Execution Time');
}

```