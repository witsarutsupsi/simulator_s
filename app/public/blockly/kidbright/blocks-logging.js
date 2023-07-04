

var x = 0;
const handle_logging = function(WS, Json) {

    //console.log(Json);

    var AE_data;
    var status;
    var date_time = new Date();
    var time_stamp = '' + date_time.getFullYear() +'-'+ (date_time.getMonth() + 1) +'-'+ date_time.getDate()
    +'_'+ date_time.getHours() +'-'+  date_time.getMinutes() +'-'+ date_time.getSeconds() +'';

    var ws = WS;
    var blockId = Json.blockId
    var block = ws.getBlockById(Json.blockId);
    var blockconnect = ws.getBlockById(Json.newParentId);

    filtering.updateChange(Json,block,ws);


    /*switch(Json.type){
        case 'delete':
            AE_data = "IDE  " + time_stamp + "  delete  Block:" + block + " Data:" + Json.newValue;
            break;
        case 'create':
            AE_data = "IDE  " + time_stamp + "  create  Block:" + block + " Data:" + Json.newValue;
            break;
        case 'change':
            AE_data = "IDE  " + time_stamp + "  change  Block:" + block + " Data:" + Json.newValue;
            break;
        case 'ui':
            if(block != null)
                AE_data = "IDE  " + time_stamp + "  click   Block:" + block + " Data:" + Json.newValue;
            else
                AE_data = "IDE  " + time_stamp + "  click   UI:" + Json.newValue;
            break;
         case 'move':
            if(Json.newCoordinate != null)
                AE_data = "IDE  " + time_stamp + "  move    Block:" + block + " Data:" + Json.newValue;// + Json.newCoordinat;
            else
                AE_data = "IDE  " + time_stamp + "  connect Block:" + block + "__" + blockconnect;
            break;
        default:
            break;
    }*/
    switch(Json.type){
        case 'delete':
            status = "delete";
            break;
        case 'create':
            status = "create";
            break;
        case 'change':
            status = "change";
            break;
        case 'ui':
            status = "click";
            break;
        case 'move':
            if(Json.newCoordinate != null)
            {
                status = "move";
                //blockconnect = "null";
            }
            else
            {
                status = "connect";
                //blockconnect = ws.getBlockById(Json.newParentId);
            }
            break;
        default:
            break;
    }
    if(x == 0)
    {
        AE_data = 'IDE  TimeStamp   Status  BlockName   BlockID NewCoordinate   NewParentID Group   NewValue    Element Name    NewInputName' + '\r\n' +
    'IDE    ' + time_stamp + '  ' + status + '  ' + block + '   ' + Json.blockId + 
    '   ' + Json.newCoordinate + '  ' + Json.newParentId + '    ' + Json.group + 
    '   ' + Json.newValue + '   ' + Json.element + '    ' + Json.name + '   ' + Json.newInputName;
        x = 1;
    }
    else if(x > 0)
    {
    AE_data = 'IDE  ' + time_stamp + '  ' + status + '  ' + block + '   ' + Json.blockId + 
    '   ' + Json.newCoordinate + '  ' + Json.newParentId + '    ' + Json.group + 
    '   ' + Json.newValue + '   ' + Json.element + '    ' + Json.name + '   ' + Json.newInputName;
    }
    //if(block != null)
        //AE_data = "IDE    " + time_stamp + "  " + status + "  block:" + block + " id:" + Json.blockId + " __" + blockconnect;
    //else
        //AE_data = "IDE    " + time_stamp + "  " + status + "  ui:" + Json.newValue + "    id:null __" + blockconnect;
    
    if(AE_data != null)
        $.ajax({type: 'POST',url: '/AE',data: {logAE: AE_data}});

}

class logText
{
    constructor(url){
        this.debug = true;
        this.date_time = new Date();
        this.row_count = 0
        this.url = url;
        this.delimeter = '  ';
        this.column = {
            "IDE"       :"IDE",
            "TimeStamp" : "",
            "Status"    :"",
            "BlockName" :"",
            "BlockID"   :"",
            "ID"        :"",
            "NewParentID":"",
            "Element"   :"",
            "NewInputName":"",
            "Node"      :"",
        };
    }

    _ajaxPost(Datastring){
        $.ajax({type: 'POST',url:this.url,data: {logAE: Datastring}});
        if(this.debug){console.log(Datastring)}
    }

    _List2PostColumn(DataList){
        var _data_string = "";
        for(var i = 0; i < DataList.length; i++){
            _data_string += DataList[i] + this.delimeter;
        }
        _data_string = _data_string.slice(0, -1); // delete last delimeter 
        return _data_string;
    }

    _getTimestamp(){
        this.date_time = new Date();
        var date_time = this.date_time;
        var time_stamp = '' + date_time.getFullYear() +'-'+ (date_time.getMonth() + 1) +'-'+ date_time.getDate()+'_'+ date_time.getHours() +'-'+  date_time.getMinutes() +'-'+ date_time.getSeconds() +'';
        return time_stamp;
    }

    record(jsonData){
        // Post header
        if(this.row_count == 0 ){
            this._ajaxPost(this._List2PostColumn(Object.keys(this.column))); // Post Header
            this.row_count++;
        }

        // Post row
        var ordered_object  = Object.assign({}, this.column);
        for (const property in jsonData) {
            if(property == "Element"){
                ordered_object[property] = JSON.stringify(jsonData[property]);
            }
            else if(property == "Node"){
                ordered_object[property] = jsonData[property]+ "";
            }
            else{
                ordered_object[property] = jsonData[property]; // feed exist json into object
            }
        }
        ordered_object["TimeStamp"] = this._getTimestamp(); // always add new Timestamp
        this._ajaxPost(this._List2PostColumn(Object.values(ordered_object)));
        this.row_count++;
    }



}

class block
{
    constructor(ID,BlockName){
        this.ID         = ID;       // key assigned to block
        this.type       = BlockName;     // block type (ex* Basic 16x4 led)
        this.BlockID    = "";
        this.element    = {
            "field":{},
            "mutation":""
        };                          // Detail of block
        this.node       = []        // Connection Point 
        this.newParentId= "";       // Block that connected to (by ID)
        this.newInputName="";       // Block place that connected      
    }
}

class variable
{
    constructor(ID,type,varId,varName,varType){
        this.ID         = ID;           //ID for Variable (ordering with block)
        this.varID      = varId;        // Record varID
        this.varName    = varName;      // Variable Name (Changable)
        this.element    = {
            "name":"",
        };
        this.varType    = varType;      // Variable Type
        this.type       = type;         // Event type
    }
}

class Log_filter{
    
    constructor(){ // Initialize
        this.debug = false;
        this.running_ID = 0

        //blockly record
        this.blocks = {}
        this.matchBlockID_2_ID ={}

        //variable record
        this.variables = {}
        this.matchvariableID_2_ID ={}
        this.logger = new logText('/FAE');
    };

    _get_all_NodeAndElementValue(block){
        var element    = {  // same format of element in class block
            "field":{},
            "mutation":""
        };   
        var InputFound= {};
        var ConnectPoint= [];
        var InputList = block.inputList;
        //var Input     = InputList[0];

        //console.log(InputList);

        // Get Next Connection (if exist) (*** hat at below block)
        if(block.nextConnection != null){
            ConnectPoint.push("CHILD"); 
        }

        // Get possible Connection and Field
        for(let i=0; i< InputList.length; i++){
            if(InputList[i].name != ""){
                ConnectPoint.push(InputList[i].name); 
                //console.log("Point add:",InputList[i].name);
            }
            if(InputList[i].fieldRow.length >0){
                for(let j=0; j< InputList[i].fieldRow.length; j++){
                    var focus_Ob = InputList[i].fieldRow[j];
                    if(focus_Ob.name != undefined && focus_Ob.colour_ != undefined){ // FieldColor
                        //console.log("Color",focus_Ob.name,focus_Ob.colour_);
                        InputFound[focus_Ob.name] = focus_Ob.colour_;
                    }
                    else if(focus_Ob.name != undefined && focus_Ob.text_ != undefined && focus_Ob.state_ == undefined && focus_Ob.value_ == undefined){ // FieldTextInput, Number
                        //console.log("Input",focus_Ob.name,focus_Ob.text_);
                        InputFound[focus_Ob.name] = focus_Ob.text_;
                    }
                    else if(focus_Ob.name != undefined && focus_Ob.state_ != undefined){ // FieldCheckbox
                        //console.log("checkbox",focus_Ob.name,focus_Ob.state_);
                        InputFound[focus_Ob.name] = focus_Ob.state_;
                    }
                    else if(focus_Ob.name != undefined && focus_Ob.text_ != undefined && focus_Ob.value_ != undefined){ // dropdown
                        //console.log("Inputdropdown",focus_Ob.name,focus_Ob.value_);
                        InputFound[focus_Ob.name] = focus_Ob.value_;
                    }
                    //console.log("fieldrow",InputList[i].fieldRow[j]);
                }
            }
        }
        //console.log("Point=",ConnectPoint);
        //console.log("Input=",InputFound);
        element["field"] =  InputFound;

        return [ConnectPoint, element];
    }

    _getBlockID_by_block(block,event)
    {
        var blockName = block.type;
        var blockField= block.element["field"];
        var blockNodeArray = block.node;
        var blockID   = "";

        // BASIC TOOLBOXS
        blockID = "BS"
        if(blockName == "basic_led16x8"){               blockID += "0100";  return blockID;}
        else if(blockName == "basic_led16x8_clr"){      blockID += "0200";  return blockID;}
        else if(blockName == "basic_led16x8_2chars"){   blockID += "0300";  return blockID;}
        else if(blockName == "basic_led16x8_scroll"){   blockID += "0400";  return blockID;}
        else if(blockName == "basic_led16x8_scroll_when_ready"){blockID += "0500";  return blockID;}
        else if(blockName == "basic_delay"){            blockID += "0600";  return blockID;}
        else if(blockName == "basic_forever"){          blockID += "0700";  return blockID;}
        else if(blockName == "basic_string"){           blockID += "0800";  return blockID;}

        // MATH TOOLBOXS
        blockID = "MA"
        if(blockName == "math_number"){
            blockID += "0100";
            return blockID;
        }
        else if(blockName == "math_arithmetic"){
            blockID += "02";
            if(blockField["OP"] == "ADD"){              blockID += "01";}
            else if(blockField["OP"] == "MINUS"){       blockID += "02";}
            else if(blockField["OP"] == "MULTIPLY"){    blockID += "03";}
            else if(blockField["OP"] == "DIVIDE"){      blockID += "04";}
            else if(blockField["OP"] == "MODULO"){      blockID += "05";}
            return blockID;
        }
        else if(blockName == "math_variable_set"){       blockID += "0300";  return blockID;}
        else if(blockName == "math_variables_get"){      blockID += "0400";  return blockID;}
        else if(blockName == "math_pow"){                blockID += "0500";  return blockID;}
        else if(blockName == "math_single"){
            blockID += "06";
            if(blockField["OP"] == "ROOT"){              blockID += "01";}
            else if(blockField["OP"] == "ABS"){          blockID += "02";}
            else if(blockField["OP"] == "NEG"){          blockID += "03";}
            else if(blockField["OP"] == "LN"){           blockID += "04";}
            else if(blockField["OP"] == "LOG10"){        blockID += "05";}
            else if(blockField["OP"] == "EXP"){          blockID += "06";}
            else if(blockField["OP"] == "POW10"){        blockID += "07";}
            return blockID;
        }
        else if(blockName == "math_trig"){
            blockID += "07";
            if(blockField["OP"] == "SIN"){               blockID += "01";}
            else if(blockField["OP"] == "COS"){          blockID += "02";}
            else if(blockField["OP"] == "TAN"){          blockID += "03";}
            else if(blockField["OP"] == "ASIN"){         blockID += "04";}
            else if(blockField["OP"] == "ACOS"){         blockID += "05";}
            else if(blockField["OP"] == "ATAN"){         blockID += "06";}
            return blockID;
        }
        else if(blockName == "math_round"){
            blockID += "08";
            if(blockField["OP"] == "ROUND"){            blockID += "01";}
            else if(blockField["OP"] == "ROUNDUP"){     blockID += "02";}
            else if(blockField["OP"] == "ROUNDDOWN"){   blockID += "03";}
            return blockID;
        }
        else if(blockName == "convert_ra_de"){
            blockID += "09";
            if(blockField["OP"] == "RA_TO_DE"){         blockID += "01";}
            else if(blockField["OP"] == "DE_TO_RA"){    blockID += "02";}
            return blockID;
        }
        else if(blockName == "math_random_int"){        blockID += "1000";  return blockID;}
        else if(blockName == "math_number_property"){
            blockID += "11";
            if(blockField["PROPERTY"] == "EVEN"){       blockID += "01";}
            else if(blockField["PROPERTY"] == "ODD"){   blockID += "02";}
            else if(blockField["PROPERTY"] == "PRIME"){ blockID += "03";}
            else if(blockField["PROPERTY"] == "POSITIVE"){blockID += "04";}
            else if(blockField["PROPERTY"] == "NEGATIVE"){blockID += "05";}
            return blockID;
        }

        //LOGIC TOOLBOXS
        blockID = "LG"
        if(blockName == "controls_if"){ // This contain some special case
            var IF_count = 0;
            var DO_count = 0;
            var ELSE_count = 0;
            var node = "";
            for(let i=0; i<blockNodeArray.length; i++){
                var node = blockNodeArray[i];
                if(node.slice(0, 2) == "IF"){IF_count+=1;}
                else if(node.slice(0, 2) == "DO"){DO_count++;}
                else if(node.slice(0, 4) == "ELSE"){ELSE_count++;}
            }
            if(event == "create"){ // new object
                if(ELSE_count>0){blockID += "0200"}
                else{blockID += "0100"}
                return blockID;
            }
            else
            {
                return block.BlockID // return previous BlockID name
            }
        }
        if(blockName == "logic_compare"){
            blockID += "03";
            if(blockField["OP"] == "EQ"){              blockID += "01";}
            else if(blockField["OP"] == "NEQ"){        blockID += "02";}
            else if(blockField["OP"] == "LT"){         blockID += "03";}
            else if(blockField["OP"] == "LTE"){        blockID += "04";}
            else if(blockField["OP"] == "GT"){         blockID += "05";}
            else if(blockField["OP"] == "GTE"){        blockID += "06";}
            return blockID;
        }
        else if(blockName == "logic_operation"){
            blockID += "04";
            if(blockField["OP"] == "AND"){              blockID += "01";}
            else if(blockField["OP"] == "OR"){          blockID += "02";}
            return blockID;
        }
        else if(blockName == "logic_negate"){           blockID += "0500";  return blockID;}
        else if(blockName == "logic_boolean"){
            blockID += "06";
            if(blockField["BOOL"] == "TRUE"){           blockID += "01";}
            else if(blockField["BOOL"] == "FALSE"){     blockID += "02";}    
            return blockID;        
        }
        else if(blockName == "logic_led16x8_scroll_ready"){blockID += "0700";  return blockID;}
        else if(blockName == "logic_sw1_pressed"){      blockID += "0800";  return blockID;}
        else if(blockName == "logic_sw1_released"){     blockID += "0900";  return blockID;}
        else if(blockName == "logic_sw2_pressed"){      blockID += "1000";  return blockID;}
        else if(blockName == "logic_sw2_released"){     blockID += "1100";  return blockID;}
        

        // LOOP TOOLBOXS
        blockID = "LO"
        if(blockName == "controls_whileUntil"){
            blockID += "01";
            if(blockField["MODE"] == "WHILE"){          blockID += "01";}
            else if(blockField["MODE"] == "UNTIL"){     blockID += "02";}
            return blockID;
        }
        else if(blockName == "loop_break"){
            blockID += "0200";
            return blockID;
        }
        else if(blockName == "loop_continue"){
            blockID += "0300";
            return blockID;
        }

        // WAIT TOOLBOXS
        blockID = "WA"
        if(blockName == "wait_led_matrix_ready"){       blockID += "0100";  return blockID;}
        else if(blockName == "wait_sw1_pressed"){       blockID += "0200";  return blockID;}
        else if(blockName == "wait_sw1_released"){      blockID += "0300";  return blockID;}
        else if(blockName == "wait_sw2_pressed"){       blockID += "0400";  return blockID;}
        else if(blockName == "wait_sw2_released"){      blockID += "0500";  return blockID;}

        // MUSIC TOOLBOXS
        blockID = "MS"
        if(blockName == "music_note"){
            blockID += "0100";
            return blockID;
        }
        else if(blockName == "music_rest"){
            blockID += "0200";
            return blockID;
        }
        else if(blockName == "music_scale"){
            blockID += "0300";
            return blockID;
        }
        else if(blockName == "music_set_volume"){blockID += "0400"; return blockID;}
        else if(blockName == "music_get_volume"){blockID += "0500"; return blockID;}

        // SENSOR TOOLBOXS
        blockID = "SS"
        if(blockName == "sensor_ldr"){          blockID += "0100"; return blockID;}
        else if(blockName == "sensor_lm73"){    blockID += "0200"; return blockID;}
        else if(blockName == "sensor_switch1"){ blockID += "0300"; return blockID;}
        else if(blockName == "sensor_switch2"){ blockID += "0400"; return blockID;}

        // CLOCK TOOLBOXS
        blockID = "CL"
        if(blockName == "rtc_get"){             blockID += "0100"; return blockID;}
        else if(blockName == "rtc_get_date"){   blockID += "0200"; return blockID;}
        else if(blockName == "rtc_get_time"){   blockID += "0300"; return blockID;}
        else if(blockName == "rtc_get_day"){    blockID += "0400"; return blockID;}
        else if(blockName == "rtc_get_month"){  blockID += "0500"; return blockID;}
        else if(blockName == "rtc_get_year"){   blockID += "0600"; return blockID;}
        else if(blockName == "rtc_get_hour"){   blockID += "0700"; return blockID;}
        else if(blockName == "rtc_get_minute"){ blockID += "0800"; return blockID;}
        else if(blockName == "rtc_get_second"){ blockID += "0900"; return blockID;}

        // I/O TOOLBOXS
        blockID = "IO"
        if(blockName == "output_write"){        blockID += "0100"; return blockID;}
        else if(blockName == "output_toggle"){  blockID += "0200"; return blockID;}
        else if(blockName == "output_read"){    blockID += "0300"; return blockID;}
        else if(blockName == "usbsw_write"){    blockID += "0400"; return blockID;}
        else if(blockName == "usbsw_toggle"){   blockID += "0500"; return blockID;}
        else if(blockName == "usbsw_read"){     blockID += "0600"; return blockID;}
        else if(blockName == "input_read"){     blockID += "0700"; return blockID;}

        // Advance TOOLBOXS
        blockID = "AV"
        if(blockName == "advance_task"){        blockID += "0100"; return blockID;}
        else if(blockName == "advance_task"){   blockID += "0200"; return blockID;}
        else if(blockName == "call_function"){  blockID += "0300"; return blockID;}

        // Variable TOOLBOXS
        blockID = "VR"
        if(blockName == "variables_set"){       blockID += "0100"; return blockID;}
        else if(blockName == "math_change"){    blockID += "0200"; return blockID;}
        else if(blockName == "variables_get"){  blockID += "0300"; return blockID;}        

        // TEXT TOOLBOXS
        blockID = "TE"
        if(blockName == "string_length"){       blockID += "0200"; return blockID;}
        else if(blockName == "string_with_number"){blockID += "0300"; return blockID;}
        else if(blockName == "string_join"){    blockID += "0400"; return blockID;} 
        else if(blockName == "string_charAt"){  blockID += "0500"; return blockID;} 
        else if(blockName == "string_substring"){blockID += "0600"; return blockID;} 
         

        // LIST TOOLBOXS
        blockID = "LI"
        if(blockName == "lists_create_with"){           blockID += "0100"; return blockID;}
        else if(blockName == "list_get_length"){        blockID += "0200"; return blockID;}
        else if(blockName == "list_get_index"){         blockID += "0300"; return blockID;}
        else if(blockName == "list_set_index"){         blockID += "0400"; return blockID;}
        else if(blockName == "list_insert_first"){      blockID += "0500"; return blockID;}
        else if(blockName == "list_insert_last"){       blockID += "0600"; return blockID;}
        else if(blockName == "list_insert_index"){      blockID += "0700"; return blockID;}
        else if(blockName == "list_get_text"){          blockID += "0800"; return blockID;}
        
        // KB IOT (Gauge) TOOLBOXS
        blockID = "GA"
        if(blockName == "gauge_iot"){                   blockID += "0100"; return blockID;}
        else if(blockName == "gauge_title"){            blockID += "0200"; return blockID;}
        else if(blockName == "gauge_unit"){             blockID += "0300"; return blockID;}
        else if(blockName == "gauge_color"){            blockID += "0400"; return blockID;}
        else if(blockName == "gauge_minmax"){           blockID += "0500"; return blockID;}
        
        // KB IOT (Graph) TOOLBOXS
        blockID = "GR"
        if(blockName == "feed_iot"){                    blockID += "0100"; return blockID;}
        else if(blockName == "feed_main_titile"){       blockID += "0200"; return blockID;}
        else if(blockName == "feed_color"){             blockID += "0300"; return blockID;}

        // KB IOT (Plugin) TOOLBOXS
        blockID = "PI"

        return "NA00000000";
    }

    _modifyMathVariables(block,event,Json){
        const interestingItems = new Set(['math_variables_set', 'math_variables_get']);
        const isItemInSet = interestingItems.has(block.type);
        if(isItemInSet && event=='create'){
            //create x variable for startup filter_create_var(Json)
            var create_new_var = this.filter_create_var(
                {
                    "type":'var_create',
                    "varId": block.element.field.VAR,
                    "varName": 'x',
                    "varType": "",
                })

            if(create_new_var){
                // ID must be shifting by 1
                var oldID = this.running_ID-1;
                var newID = this.running_ID;
                
                block.ID = this.running_ID;
                this.matchBlockID_2_ID[Json.blockId] = this.running_ID;
                this.blocks[newID] = this.blocks[oldID];
                delete this.blocks[oldID];
            }
        }
        if(isItemInSet){
            // revise "field" value
            block.element.field.VAR = this.variables[this.matchvariableID_2_ID[block.element.field.VAR]].varName;
            }
    }
            
    _modifyVariables(block){ // this function changes VarID in field into VarName instead
        const interestingItems = new Set(['variables_set', 'math_change', 'variables_get']);
        const isItemInSet = interestingItems.has(block.type);
        if(isItemInSet){
            const variable_key = block.element["field"]["VAR"];
            const varName      = this.variables[this.matchvariableID_2_ID[variable_key]].varName;

            //modified VAR poit to Name 
            block.element["field"]["VAR"] = varName;
        }
        return block
    }

    _modifyMathchange_block(Json,block,Workspace){
        const interestingItems = new Set(['math_change']);
        const isItemInSet = interestingItems.has(block.type);
        if(isItemInSet){
            var var_block = Workspace.getBlockById(Json.ids[1]);
            this.filter_create({blockId:Json.ids[1]},var_block,Workspace); // create mathVarBlock
            this.filter_move({                                             // connected mathVarBlock to math_change
                blockId         :Json.ids[1],
                newParentId     :Json.ids[0],
                newInputName    :"DELTA",
            });
        }
    }


    _renameVariable_in_block(block,oldName,newName){ // this function changs old VarName to new Varname cause "var_rename" event
        const interestingItems = new Set(['variables_set', 'math_change', 'variables_get','math_variables_set', 'math_variables_get'])
        const isItemInSet = interestingItems.has(block.type)
        if(isItemInSet){
            const block_VAR_Name = block.element["field"]["VAR"];
            if(block_VAR_Name == oldName){
                //modified VAR oldname to newname
                block.element["field"]["VAR"] = newName;
                return true;
            }
        }
        return false
    }

    filter_create(Json,blockObject,ws){
        //console.log(Json,blockObject);
        var create = false;
        if(this.matchBlockID_2_ID.hasOwnProperty(Json.blockId)){}
        else{create = true;}

        if(create)
        {

            // create new block class
            this.matchBlockID_2_ID[Json.blockId] = this.running_ID;
            this.blocks[this.running_ID] = new block(this.running_ID,blockObject.type); 
            var My_block = this.blocks[this.running_ID]

            // Read Node and element
            let BlockDetail =  this._get_all_NodeAndElementValue(blockObject);
            var Block_Node  = BlockDetail[0];
            var Block_Element= BlockDetail[1];

            // passing value into block class
            My_block.element = Block_Element;
            My_block.node    = Block_Node;
            My_block.BlockID = this._getBlockID_by_block(My_block,"create");


            // modified Special case blockly
            this._modifyMathVariables(My_block,"create",Json)
            this._modifyVariables(My_block)

            // logging Record
            this.logger.record({
                "Status"    :"create",
                "BlockName" :My_block.type,
                "BlockID"   : My_block.BlockID,
                "ID"        :My_block.ID,
                //"NewParentID":"",
                "Element"   :My_block.element,
                //"NewInputName":""
                "Node"      :My_block.node,
            });
            
            if(this.debug){
                var debugMessage = "";
                debugMessage += "[" + this.blocks[this.running_ID].type + "] create ID [" + this.blocks[this.running_ID].ID + "]"
                console.log(debugMessage);
            }
            this.running_ID++;

            // Add component in Special case
            this._modifyMathchange_block(Json,My_block,ws);
        }
        
    }

    filter_change(Json,blockObject){
        if(this.matchBlockID_2_ID.hasOwnProperty(Json.blockId)){
            var ID          = this.matchBlockID_2_ID[Json.blockId];
            var My_block    = this.blocks[ID];
            var fieldChange = false;
            var mutationChange = false;
            var debugMessage = "";

            // Read Node and element
            let BlockDetail  =  this._get_all_NodeAndElementValue(blockObject);
            var Block_Node   = BlockDetail[0];
            var Block_Element= BlockDetail[1];

            // passing value into block class
            My_block.element = Block_Element;
            My_block.node    = Block_Node;
            My_block.BlockID = this._getBlockID_by_block(My_block,"change");

            // check type of changs
            if(Json.element == "mutation"){
                mutationChange = true;
                My_block.element["mutation"] = Json.newValue;
            }
            else if(Json.element == "field"){
                fieldChange = true;
                My_block.element["field"][Json.name] = Json.newValue;
            }

            // modified Special case blockly
            this._modifyMathVariables(My_block,"change",Json)
            this._modifyVariables(My_block)


            // Update Element
            if(mutationChange){
                My_block.element["mutation"] = Json.newValue;
                debugMessage += "[" + this.blocks[ID].type + "] change (" + "[field][mutation]" + ")>> " + Json.newValue;
                this.logger.record({
                    "Status"    :"change",
                    "BlockName" :My_block.type,
                    "BlockID"   : My_block.BlockID,
                    "ID"        :My_block.ID,
                    //"NewParentID":"",
                    "Element"   :My_block.element,
                    //"NewInputName":""
                    "Node"      :My_block.node,
                });
            }
            else if(fieldChange)
            {
                debugMessage += "[" + this.blocks[ID].type + "] change (" + "[field]["+String(Json.name) + "])>> " + Json.newValue;
                this.logger.record({
                    "Status"    :"change",
                    "BlockName" :My_block.type,
                    "BlockID"   : My_block.BlockID,
                    "ID"        :My_block.ID,
                    //"NewParentID":"",
                    "Element"   :My_block.element,
                    //"NewInputName":""
                });
            }
            
            // debug message
            if(this.debug){console.log(debugMessage);}
        }
        else{
            console.log("This item is not registered")
        }
    }
    
    filter_move(Json){
        /*
            Recording needed:
                - event    = "connect","disconnect"
                - ParentId = My_block.newParentId (ID 1,2,3)
                - InputName= My_block.newInputName(string)
        */
        var blockfound = false;
        if(this.matchBlockID_2_ID.hasOwnProperty(Json.blockId)){blockfound = true;}
        else{}

        if(blockfound)
        {
            var My_block    = this.blocks[this.matchBlockID_2_ID[Json.blockId]];
            var new_connect = false;
            var old_connect = false;
            var disconnect  = false;
            var normal_move = false;

            // check type of Move
            if(Json.hasOwnProperty("newParentId")){
                if(My_block.newParentId  != Json.newParentId){new_connect = true;} // 1 Got new connection
                else{old_connect = true;} // 2 Same as previous connection
            }
            else{
                if(My_block.newParentId !== ""){disconnect = true;} // 3 disconnect from parent
                else{normal_move = true} // 4 just nornal move
            }

            if(new_connect){ // New connection Event
                var debugMessage = "";
                My_block.newParentId= this.blocks[this.matchBlockID_2_ID[Json.newParentId]].ID;
                debugMessage += "["+String(My_block.type) + "] connect to ["+String(this.blocks[My_block.newParentId].type)+"]"
                if(Json.hasOwnProperty("newInputName")){ // Connect as input variable
                    My_block.newInputName= Json.newInputName;
                    debugMessage += "("+String(My_block.newInputName)+")"
                }
                else{// Connect as child
                    My_block.newInputName= "CHILD";
                }
                if(this.debug){console.log(debugMessage);}

                this.logger.record({
                    "Status"    :"connect",
                    "BlockName" :My_block.type,
                    "BlockID"   :My_block.BlockID,
                    "ID"        :My_block.ID,
                    "NewParentID":My_block.newParentId,
                    //"Element":My_block.element,
                    "NewInputName":My_block.newInputName
                });

            }

            if(disconnect){// disconnect from last connection event
                var debugMessage = "";
                debugMessage += "["+String(My_block.type) + "] disconnect from ["+String(this.blocks[My_block.newParentId].type)+"]"
                if(My_block.newInputName != ""){
                    debugMessage += "("+String(My_block.newInputName)+")"
                }
                // flush connected data
                My_block.newParentId = "";
                My_block.newInputName= "";
                if(this.debug){console.log(debugMessage);}
                this.logger.record({
                    "Status"    :"disconnect",
                    "BlockName" :My_block.type,
                    "BlockID"   :My_block.BlockID,
                    "ID"        :My_block.ID,
                    "NewParentID":My_block.newParentId,
                    //"Element":My_block.element,
                    "NewInputName":My_block.newInputName
                });
            }
        }
        else{console.log("This item is not registered")}
    }

    filter_delete(Json){
        var deleted_blockId_List    = Json.ids;

        for(let i=0; i< deleted_blockId_List.length; i++){
            var My_block        = this.blocks[this.matchBlockID_2_ID[deleted_blockId_List[i]]];
            var select_ID       = My_block.ID;
            var debugMessage    = "";
            debugMessage += "["+String(My_block.type) + "] is deleted ID [" + String(My_block.ID) + "]";
            this.logger.record({
                "Status"    : "delete",
                "BlockName" : My_block.type,
                "BlockID"   : My_block.BlockID,
                "ID"        : My_block.ID,
                "NewParentID":My_block.newParentId,
                "Element"   : My_block.element,
                "NewInputName":My_block.newInputName
            });
            delete this.blocks.select_ID
            if(this.debug){console.log(debugMessage);}

        }
    }

    filter_create_var(Json)
    {
        var create = false;
        if(this.matchvariableID_2_ID.hasOwnProperty(Json.varId)){}
        else{create = true;}

        if(create)
        {
            // create new block class
            this.matchvariableID_2_ID[Json.varId]   = this.running_ID;
            this.variables[this.running_ID]         = new variable(this.running_ID, Json.type, Json.varId, Json.varName, Json.varType);
            var My_variable                         = this.variables[this.running_ID]
            My_variable.element["name"]             = My_variable.varName

            this.logger.record({
                "Status"    :"var_create",
                "BlockName" :"variable",
                //"BlockID"   :"",
                "ID"        :My_variable.ID,
                //"NewParentID":"",
                "Element"   :My_variable.element,
                //"NewInputName":My_block.newInputName
            });
            this.running_ID++;
            return true;
        }
        return false;
    }

    filter_change_var(Json){
        if(this.matchvariableID_2_ID.hasOwnProperty(Json.varId)){
            var MyVar               = this.variables[this.matchvariableID_2_ID[Json.varId]]
            var oldName             = Json.oldName
            var newName             = Json.newName
            MyVar.varName           = newName
            MyVar.element["name"]   = newName

            this.logger.record({
                "Status"    :"var_rename",
                "BlockName" :"variable",
                //"BlockID"   :"",
                "ID"        :MyVar.ID,
                //"NewParentID":"",
                "Element"   :MyVar.element,
                //"NewInputName":My_block.newInputName
            });

            // all block is related be changed value too
            for(const [ID,block] of Object.entries(this.blocks))
            {
                if(block.element["field"]["VAR"] == oldName){
                    var modified = this._renameVariable_in_block(block,oldName,newName);
                    if(modified){
                        this.logger.record({
                            "Status"    :"change",
                            "BlockName" : block.type,
                            "BlockID"   : block.BlockID,
                            "ID"        :block.ID,
                            //"NewParentID":"",
                            "Element"   :block.element,
                            //"NewInputName":""
                        });
                    }
                    else{}
                }
                else{}
            }
        }
        else{console.log("This var is not registered")}
    }

    filter_delete_var(Json){
        if(this.matchvariableID_2_ID.hasOwnProperty(Json.varId)){
            var MyVar    = this.variables[this.matchvariableID_2_ID[Json.varId]]
            this.logger.record({
                "Status"    :"var_delete",
                "BlockName" :"variable",
                //"BlockID"   : My_block.BlockID,
                "ID"        :MyVar.ID,
                //"NewParentID":My_block.newParentId,
                "Element"   :MyVar.element,
                //"NewInputName":My_block.newInputName
            });
            delete this.variables[this.matchvariableID_2_ID[Json.varId]]
        }
        else{console.log("This var is not registered")}
    }

    updateChange(Json,block,ws){
        //console.log(Json);
        //console.log(block,block.NEXT_STATEMENT);
        //console.log(block.childBlocks_); //>> []
        //console.log(block.COLLAPSED_FIELD_NAME); // >>undefined
        //console.log(block.colour_); // >>#A15873
        //console.log(block.compose); // >> Message of mutators var
        //console.log(block.data);    // >>Error Load null
        //console.log(block.inputList);

        switch(Json.type){
            case 'delete':
                this.filter_delete(Json);
            case 'create':
                this.filter_create(Json,block,ws);
                break;
            case 'change':
                this.filter_change(Json,block);
            case 'ui':
                break;
            case 'move':
                this.filter_move(Json);
                break;
            case 'var_create':
                this.filter_create_var(Json);
                break;
            case 'var_rename':
                this.filter_change_var(Json);
                break;
            case 'var_delete':
                this.filter_delete_var(Json);
                break;
            default:
                break;
        }
    }
}

// Create class immediatly
const filtering = new Log_filter();