Blockly.Blocks["bldc.forward"] = {
	init: function () {
		this.appendDummyInput()
			.appendField(Blockly.Msg.BLDC_FORWARD_TITLE);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
		this.setColour(160);
		this.setTooltip(Blockly.Msg.BLDC_FORWARD_TOOLTIP);
		this.setHelpUrl(Blockly.Msg.BLDC_FORWARD_HELPURL);
	}
};

Blockly.Blocks["bldc.backward"] = {
	init: function () {
		this.appendDummyInput()
			.appendField(Blockly.Msg.BLDC_BACKWARD_TITLE);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
		this.setColour(160);
		this.setTooltip(Blockly.Msg.BLDC_BACKWARD_TOOLTIP);
		this.setHelpUrl(Blockly.Msg.BLDC_BACKWARD_HELPURL);
	}
};

//Blockly.Blocks["bldc.start"] = {
//	init: function () {
//		this.appendDummyInput()
//			.appendField(Blockly.Msg.BLDC_START_TITLE);
//		this.setPreviousStatement(true);
//		this.setNextStatement(true);
//		this.setColour(160);
//		this.setTooltip(Blockly.Msg.BLDC_START_TOOLTIP);
//		this.setHelpUrl(Blockly.Msg.BLDC_START_HELPURL);
//	}
//};

Blockly.Blocks["bldc.stop"] = {
	init: function () {
		this.appendDummyInput()
			.appendField(Blockly.Msg.BLDC_STOP_TITLE);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
		this.setColour(160);
		this.setTooltip(Blockly.Msg.BLDC_STOP_TOOLTIP);
		this.setHelpUrl(Blockly.Msg.BLDC_STOP_HELPURL);
	}
};
