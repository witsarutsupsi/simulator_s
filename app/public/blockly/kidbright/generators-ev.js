Blockly.JavaScript['bldc.forward'] = function (block) {
	//return 'DEV_IO.BLDC().forward();\n';
	return 'kb_ev.evMovement(1, 20);\n';
};

Blockly.JavaScript['bldc.backward'] = function (block) {
	//return 'DEV_IO.BLDC().backward();\n';
	return 'kb_ev.evMovement(2, 20);\n';
};

//Blockly.JavaScript['bldc.start'] = function (block) {
//	return 'DEV_IO.BLDC().start();\n';
//};

Blockly.JavaScript['bldc.stop'] = function (block) {
	//return 'DEV_IO.BLDC().stop();\n';
	return 'kb_ev.evMovement(0, 0);\n';
};
