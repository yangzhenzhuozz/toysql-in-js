export interface ExpNode {
  op: 'getfield' | 'getTableField' | 'alias' | 'add' | 'sub' | 'mul' | 'div' | 'lt' | 'le' | 'eq' | 'gt' | 'ge' | 'if' | 'immediate_num' | 'immediate_string' | 'immediate_bool' | 'immediate_null' | 'and' | 'or';
  targetName?: string;
  children?: ExpNode[];
  value?: string | number | boolean;
}
export interface SelectList {
  type: '*' | 'nodes';
  nodes?: ExpNode[];
}
