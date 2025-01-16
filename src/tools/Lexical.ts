import { YYTOKEN } from './SQLParser.js';
import { DFAAutomaton } from 'tslex/dist/automaton.js';
import lexicalRules from './lexicalRules.js';
export class Lexical {
  private dfa: DFAAutomaton;
  private finished = false;
  constructor(src: string) {
    let dfaObj = lexicalRules;
    this.dfa = DFAAutomaton.deserialize(dfaObj);
    this.dfa.setSource(src);
    this.dfa.endHandler = () => {
      this.finished = true;
    };
  }
  yylex(): YYTOKEN {
    let genRet = (arg: YYTOKEN): YYTOKEN => {
      if (this.finished) {
        return {
          yytext: '',
          type: '$',
          value: '',
        };
      } else if (arg.type == 'space') {
        return this.yylex();
      } else {
        return arg;
      }
    };
    let ret = this.dfa.run() as YYTOKEN;
    return genRet(ret);
  }
  yyerror(msg: string) {
    console.error(`${msg}`);
  }
}
