export type valueType = string | number | boolean;
export interface ExpNode {
  op: 'group' | 'group_having' | 'call' | 'if-else' | 'if-elseif-else' | 'getfield' | 'getTableField' | 'alias' | 'add' | 'sub' | 'mul' | 'div' | 'lt' | 'le' | 'eq' | 'gt' | 'ge' | 'immediate_val' | 'and' | 'or';
  targetName: string;
  children?: ExpNode[];
  value?: valueType;
}
export interface SelectList {
  type: '*' | 'nodes';
  nodes?: ExpNode[];
}
