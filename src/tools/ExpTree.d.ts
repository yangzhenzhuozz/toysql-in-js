export interface ExpNode {
  op: 'limit' | 'cast' | '*' | 'group' | 'is_null' | 'is_not_null' | 'order' | 'group_having' | 'call' | 'getfield' | 'getTableField' | 'alias' | 'mod' | 'case' | 'case-exp' | 'when' | 'else' | 'add' | 'sub' | 'mul' | 'div' | 'lt' | 'le' | 'eq' | 'ne' | 'gt' | 'ge' | 'immediate_val' | 'and' | 'or' | 'not';
  targetName: string;
  children?: ExpNode[];
  value?: any;
  cast_type?: 'string' | 'number' | 'boolean';
  order?: 'asc' | 'desc';
  modifier?: 'distinct' | 'all';
  limit?: number[];
}
export interface SelectClause {
  modifier?: 'distinct' | 'all';
  nodes: (ExpNode | WindowFrame)[];
}
export interface WindowFrame {
  windowFunction: ExpNode;
  partition: ExpNode[];
  order?: ExpNode[];
  alias?: string;
  targetName: string;
}
