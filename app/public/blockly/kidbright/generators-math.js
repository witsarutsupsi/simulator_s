Blockly.JavaScript['math_random_int'] = function(block) {
    var num1 = block.getFieldValue('FROM') || '0';
    var num2 = block.getFieldValue('TO') || '0';
	
	console.log(num1, num2)
	if (num2 > num1){
        //var code = 'rand() % ' + num2 + ' + ' + num1;
        var code = 'Math.floor((Math.random() *' + num2 + ')+' + num1 + ')';
    }
    else{
        var code = '0';
	}
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['math_pow'] = function(block) {
    var arg1 = Blockly.JavaScript.valueToCode(block, 'NUM1', Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
    var arg2 = Blockly.JavaScript.valueToCode(block, 'NUM2', Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
    //var code =  'pow(' + arg1 +',' + arg2 + ')';
	var code =  'Math.pow(' + arg1 +',' + arg2 + ')';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['math_single'] = function(block) {
    // Math operators with single operand.
    var operator = block.getFieldValue('OP');
    var code;
    var arg = Blockly.JavaScript.valueToCode(block, 'NUM', Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';

    switch (operator) {
        case 'ABS':
          //code = 'fabs(' + arg + ')';
          code = 'Math.abs(' + arg + ')';
          break;
        case 'ROOT':
          //code = 'sqrt(' + arg + ')';
          code = 'Math.sqrt(' + arg + ')';
          break;
        case 'LN':
          //code = 'log(' + arg + ')';
          code = 'Math.log(' + arg + ')';
          break;
        case 'LOG10':
          //code = 'log10(' + arg + ')';
          code = 'kb_math._log10(' + arg + ')';
          break;
        case 'EXP':
          //code = 'exp(' + arg + ')';
          code = 'Math.exp(' + arg + ')';
          break;
        case 'POW10':
          //code = 'pow(10,' + arg + ')';
          code = 'Math.pow(10,' + arg + ')';
          break;
		case 'NEG':
		  //code = '(-' + arg + ')';
		  code = '(-' + arg + ')';
          break;
      }

    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['math_trig'] = function(block) {
	// Math operators with single operand.
	var operator = block.getFieldValue('OP');
	var code;
	var arg = Blockly.JavaScript.valueToCode(block, 'NUM', Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';

    switch (operator) {
        case 'SIN':
          	//code = 'sin (' + arg + ' * PI/180.0)';
          	code = 'Math.sin (' + arg + ' * 3.141594/180)';
          	break;
        case 'COS':
          	//code = 'cos (' + arg + ' * PI/180.0)';
          	code = 'Math.cos (' + arg + ' * 3.141594/180)';
          	break;
        case 'TAN':
          	//code = 'tan (' + arg + ' * PI/180.0)';
          	code = 'Math.tan (' + arg + ' * 3.141594/180)';
		  	break;
		case 'ASIN':
			//code = 'asin(' + arg + ') * 180.0 / PI';
			code = 'Math.asin(' + arg + ') * 180/3.141594)';
			break;
		case 'ACOS':
			//code = 'acos(' + arg + ') * 180.0 / PI';
			code = 'Math.acos(' + arg + ') * 180/3.141594)';
			break;
		case 'ATAN':
			//code = 'atan(' + arg + ') * 180.0 / PI';
			code = 'Math.atan(' + arg + ') * 180/3.141594)';
			break;
		}

	return [code, Blockly.JavaScript.ORDER_ATOMIC];
}

Blockly.JavaScript['math_round'] = function(block) {
	// Math operators with single operand.
	var operator = block.getFieldValue('OP');
    var code;
	var arg = Blockly.JavaScript.valueToCode(block, 'NUM', Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
	
	switch (operator) {
		case 'ROUND':
			//code = '(double)round(' + arg + ')';
			code = 'Math.round(' + arg + ')';
			break;
		case 'ROUNDUP':
			//code = '(double)ceil(' + arg + ')';
			code = 'Math.ceil(' + arg + ')';
			break;
		case 'ROUNDDOWN':
			//code = '(double)floor(' + arg + ')';
			code = 'Math.floor(' + arg + ')';
			break;
	}
	return [code, Blockly.JavaScript.ORDER_ATOMIC];
}

Blockly.JavaScript['math_number_property'] = function(block) {
	// Math operators with single operand.
	var operator = block.getFieldValue('PROPERTY');
	var code;
	var arg = Blockly.JavaScript.valueToCode(block, 'NUMBER_TO_CHECK', Blockly.JavaScript.ORDER_ASSIGNMENT) || '0' ;

	switch (operator) {
		case 'EVEN':
			code = '( (int)' + arg + ' % 2 == 0 )';
			break;
		case 'ODD':
			code = '( (int)' + arg + ' % 2 != 0)';
			break;
		case 'PRIME':
			code = 'check_is_prime( (int)' + arg + ')';
			break;
		case 'POSITIVE':
			code = '( ' + arg + ' > 0)';
			break;
		case 'NEGATIVE':
			code = '( ' + arg + ' < 0)';
			break;
	}
	return [code, Blockly.JavaScript.ORDER_ATOMIC];
}

Blockly.JavaScript['convert_ra_de'] = function(block) {
	// Math operators with single operand.
	var operator = block.getFieldValue('OP');
    var code;
	var arg = Blockly.JavaScript.valueToCode(block, 'NUM', Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';

	switch (operator) {
		case 'RA_TO_DE':
			//code = '( ' + arg + ' * 180 ) / PI' ;
			code = '( ' + arg + ' * 180 ) /3.141594' ;
			break;
		case 'DE_TO_RA':
			//code = '( ' + arg + ' * PI ) / 180.0' ;
			code = '( ' + arg + ' * 3.141594 ) / 180' ;
			break;
	}
	return [code, Blockly.JavaScript.ORDER_ATOMIC];
}