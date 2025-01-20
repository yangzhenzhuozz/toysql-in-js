export type valueType = string | number | boolean | null;
export interface ExpNode {
  op: 'limit' | 'group' | 'order' | 'group_having' | 'call' | 'if-else' | 'if-elseif-else' | 'getfield' | 'getTableField' | 'alias' | 'mod' | 'add' | 'sub' | 'mul' | 'div' | 'lt' | 'le' | 'eq' | 'gt' | 'ge' | 'immediate_val' | 'and' | 'or' | 'not';
  targetName: string;
  children?: ExpNode[];
  value?: valueType;
  order?: 'asc' | 'desc';
  limit?: number[];
}
export interface SelectList {
  type: '*' | 'nodes';
  nodes?: ExpNode[];
}
