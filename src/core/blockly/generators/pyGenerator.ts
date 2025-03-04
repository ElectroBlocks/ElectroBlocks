import Blockly, { Block } from "blockly";
import _ from "lodash";
import { getBlockByType } from "../helpers/block.helper";

// Python Code generator
Blockly["Python"] = new Blockly.Generator("Arduino");


// Python Equivalent ReservedWords
Blockly["Python"].addReservedWords(
  // Python keywords
  "False,None,True,and,as,assert,async,await,break,class,continue,def," +
  "del,elif,else,except,finally,for,from,global,if,import,in,is,lambda," +
  "nonlocal,not,or,pass,raise,return,try,while,with,yield," +
  // Common builtins
  "abs,all,any,bin,bool,bytearray,bytes,chr,complex,dict,dir,divmod," +
  "enumerate,eval,exec,filter,float,format,frozenset,getattr,globals," +
  "hasattr,hash,hex,id,input,int,isinstance,issubclass,iter,len,list,locals," +
  "map,max,memoryview,min,next,object,oct,open,ord,pow,print,property,range," +
  "repr,reversed,round,set,setattr,slice,sorted,staticmethod,str,sum,super," +
  "tuple,type,vars,zip," +
  // MicroPython specific
  "board,digitalio,analogio,time,neopixel,servo,busio,math,random," +
  "pin,pin_in,pin_out,analog_read,analog_write,digital_read,digital_write," +
  "sleep,sleep_ms,ticks_ms,ticks_us," +
  // Constants commonly used in Arduino that might be used in Python too
  "HIGH,LOW,INPUT,OUTPUT,INPUT_PULLUP,true,false"
);

// Python Order of Operation
// https://neil.fraser.name/blockly/custom-blocks/operator-precedence
// Much simpler than JavaScript, but here for reference.
// https://docs.python.org/3/reference/expressions.html#operator-precedence

Blockly["Python"].ORDER_ATOMIC = 0;         // 0 "" 1234 'abc' True False None
Blockly["Python"].ORDER_COLLECTION = 1;     // tuples, lists, dictionaries
Blockly["Python"].ORDER_STRING_CONVERSION = 1; // `expression...`
Blockly["Python"].ORDER_MEMBER = 2;         // . []
Blockly["Python"].ORDER_FUNCTION_CALL = 2;  // ()
Blockly["Python"].ORDER_EXPONENTIATION = 3; // **
Blockly["Python"].ORDER_UNARY_SIGN = 4;     // + -
Blockly["Python"].ORDER_BITWISE_NOT = 4;    // ~
Blockly["Python"].ORDER_MULTIPLICATIVE = 5; // * / // %
Blockly["Python"].ORDER_ADDITIVE = 6;       // + -
Blockly["Python"].ORDER_BITWISE_SHIFT = 7;  // << >>
Blockly["Python"].ORDER_BITWISE_AND = 8;    // &
Blockly["Python"].ORDER_BITWISE_XOR = 9;    // ^
Blockly["Python"].ORDER_BITWISE_OR = 10;    // |
Blockly["Python"].ORDER_COMPARISON = 11;    // in, not in, is, is not, <, <=, >, >=, <>, !=, ==
Blockly["Python"].ORDER_LOGICAL_NOT = 12;   // not
Blockly["Python"].ORDER_LOGICAL_AND = 13;   // and
Blockly["Python"].ORDER_LOGICAL_OR = 14;    // or
Blockly["Python"].ORDER_CONDITIONAL = 15;   // if else
Blockly["Python"].ORDER_LAMBDA = 16;        // lambda
Blockly["Python"].ORDER_ASSIGNMENT = 17;    // =
Blockly["Python"].ORDER_NONE = 99;          // (...)

Blockly["Python"].init = function(workspace) {
    if(!this.nameDB_){
        this.nameDB_ = new Blockly.Names(this.RESERVED_WORDS_);
    }else{
        this.nameDB_.reset();
    }
    
    this.nameDB_.setVariableMap(workspace.getVariableMap());
    this.nameDB_.populateVariables(workspace);
    this.nameDB_.populateProcedures(workspace);

    // Create a dictionary of definitions to be printed before the code.
    Blockly["Python"].imports_ = Object.create(null);
    Blockly["Python"].definitions_ = Object.create(null);
    Blockly["Python"].functions_ = Object.create(null);
    Blockly["Python"].setupCode_ = Object.create(null);
};