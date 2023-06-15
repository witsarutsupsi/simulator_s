

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

    filtering.updateChange(Json,block);


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
    constructor(ID,BlockName,BlockID){
        this.ID         = ID;       // key assigned to block
        this.type       = BlockName;     // block type (ex* Basic 16x4 led)
        this.BlockID    = BlockID;
        this.element    = {
            "field":{},
            "mutation":""
        };                          // Detail of block
        this.node       = []        // Connection Point 
        this.newParentId= "";       // Block that connected to (by ID)
        this.newInputName="";       // Block place that connected      
    }
}

class Log_filter{
    
    constructor(){ // Initialize
        this.debug = false;
        this.running_ID = 0
        this.blocks = {}
        this.matchBlockID_2_ID ={}
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

        // Get possible Connection
        for(let i=0; i< InputList.length; i++){
            if(InputList[i].name != ""){
                ConnectPoint.push(InputList[i].name); 
                //console.log("Point add:",InputList[i].name);
            }
            if(InputList[i].fieldRow.length >0){
                for(let j=0; j< InputList[i].fieldRow.length; j++){
                    var focus_Ob = InputList[i].fieldRow[j];
                    if(focus_Ob.name != undefined && focus_Ob.text_ != undefined && focus_Ob.state_ == undefined && focus_Ob.value_ == undefined){ // FieldTextInput, Number
                        //console.log("Input",focus_Ob.name,focus_Ob.text_);
                        InputFound[focus_Ob.name] = focus_Ob.text_;
                    }
                    if(focus_Ob.name != undefined && focus_Ob.state_ != undefined){ // FieldCheckbox
                        //console.log("checkbox",focus_Ob.name,focus_Ob.state_);
                        InputFound[focus_Ob.name] = focus_Ob.state_;
                    }
                    if(focus_Ob.name != undefined && focus_Ob.text_ != undefined && focus_Ob.value_ != undefined){ // dropdown
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

    _getBlockID_by_block(block)
    {
        var blockName = block.type;
        var blockField= block.element["field"];
        var blockNodeArray = block.node;
        var blockID   = "";

        // BASIC TOOLBOXS
        blockID = "BS"
        if(blockName == "basic_led16x8"){               blockID += "01000000";  return blockID;}
        else if(blockName == "basic_led16x8_clr"){      blockID += "02000000";  return blockID;}
        else if(blockName == "basic_led16x8_2chars"){   blockID += "03000000";  return blockID;}
        else if(blockName == "basic_led16x8_scroll"){   blockID += "04000000";  return blockID;}
        else if(blockName == "basic_led16x8_scroll_when_ready"){blockID += "05000000";  return blockID;}
        else if(blockName == "basic_delay"){            blockID += "06000000";  return blockID;}
        else if(blockName == "basic_forever"){          blockID += "07000000";  return blockID;}
        else if(blockName == "basic_string"){           blockID += "08000000";  return blockID;}

        // MATH TOOLBOXS
        blockID = "MA"
        if(blockName == "math_number"){
            blockID += "01";
            blockID += "000000";
            return blockID;
        }
        else if(blockName == "math_arithmetic"){
            blockID += "02";
            if(blockField["OP"] == "ADD"){              blockID += "01";}
            else if(blockField["OP"] == "MINUS"){       blockID += "02";}
            else if(blockField["OP"] == "MULTIPLY"){    blockID += "03";}
            else if(blockField["OP"] == "DIVIDE"){      blockID += "04";}
            else if(blockField["OP"] == "MODULO"){      blockID += "05";}
            blockID += "0000";
            return blockID;
        }
        else if(blockName == "math_variable_set"){       blockID += "03000000";  return blockID;}
        else if(blockName == "math_variables_get"){      blockID += "04000000";  return blockID;}
        else if(blockName == "math_pow"){                blockID += "05000000";  return blockID;}
        else if(blockName == "math_single"){
            blockID += "06";
            if(blockField["OP"] == "ROOT"){              blockID += "01";}
            else if(blockField["OP"] == "ABS"){          blockID += "02";}
            else if(blockField["OP"] == "NEG"){          blockID += "03";}
            else if(blockField["OP"] == "LN"){           blockID += "04";}
            else if(blockField["OP"] == "LOG10"){        blockID += "05";}
            else if(blockField["OP"] == "EXP"){          blockID += "06";}
            else if(blockField["OP"] == "POW10"){        blockID += "07";}
            blockID += "0000";
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
            blockID += "0000";
            return blockID;
        }
        else if(blockName == "math_round"){
            blockID += "08";
            if(blockField["OP"] == "ROUND"){            blockID += "01";}
            else if(blockField["OP"] == "ROUNDUP"){     blockID += "02";}
            else if(blockField["OP"] == "ROUNDDOWN"){   blockID += "03";}
            blockID += "0000";
            return blockID;
        }
        else if(blockName == "convert_ra_de"){
            blockID += "09";
            if(blockField["OP"] == "RA_TO_DE"){         blockID += "01";}
            else if(blockField["OP"] == "DE_TO_RA"){    blockID += "02";}
            blockID += "0000";
            return blockID;
        }
        else if(blockName == "math_random_int"){        blockID += "10000000";  return blockID;}
        else if(blockName == "math_number_property"){
            blockID += "11";
            if(blockField["PROPERTY"] == "EVEN"){       blockID += "01";}
            else if(blockField["PROPERTY"] == "ODD"){   blockID += "02";}
            else if(blockField["PROPERTY"] == "PRIME"){ blockID += "03";}
            else if(blockField["PROPERTY"] == "POSITIVE"){   blockID += "04";}
            else if(blockField["PROPERTY"] == "NEGATIVE"){   blockID += "05";}
            blockID += "0000";
            return blockID;
        }

        //LOGIC TOOLBOXS
        blockID = "LG"
        if(blockName == "controls_if"){
            blockID += "01";
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
            blockID += String(IF_count).padStart(2,'0');
            blockID += String(DO_count).padStart(2,'0');
            blockID += String(ELSE_count).padStart(2,'0');
            return blockID;
        }
        if(blockName == "logic_compare"){
            blockID += "03";
            if(blockField["OP"] == "EQ"){              blockID += "01";}
            else if(blockField["OP"] == "NEQ"){        blockID += "02";}
            else if(blockField["OP"] == "LT"){         blockID += "03";}
            else if(blockField["OP"] == "LTE"){        blockID += "04";}
            else if(blockField["OP"] == "GT"){         blockID += "05";}
            else if(blockField["OP"] == "GTE"){        blockID += "06";}
            blockID += "0000";
            return blockID;
        }
        else if(blockName == "logic_operation"){
            blockID += "04";
            if(blockField["OP"] == "AND"){              blockID += "01";}
            else if(blockField["OP"] == "OR"){          blockID += "02";}
            blockID += "0000";
            return blockID;
        }
        else if(blockName == "logic_negate"){           blockID += "05000000";  return blockID;}
        else if(blockName == "logic_boolean"){
            blockID += "06";
            if(blockField["BOOL"] == "TRUE"){           blockID += "01";}
            else if(blockField["BOOL"] == "FALSE"){     blockID += "02";}    
            blockID += "0000";
            return blockID;        
        }
        else if(blockName == "logic_led16x8_scroll_ready"){blockID += "07000000";  return blockID;}
        else if(blockName == "logic_sw1_pressed"){      blockID += "08000000";  return blockID;}
        else if(blockName == "logic_sw1_released"){     blockID += "09000000";  return blockID;}
        else if(blockName == "logic_sw2_pressed"){      blockID += "10000000";  return blockID;}
        else if(blockName == "logic_sw2_released"){     blockID += "11000000";  return blockID;}
        

        // LOOP TOOLBOXS
        blockID = "LO"
        if(blockName == "controls_whileUntil"){
            blockID += "01";
            if(blockField["MODE"] == "WHILE"){          blockID += "01";}
            else if(blockField["MODE"] == "UNTIL"){     blockID += "02";}
            blockID += "0000";
            return blockID;
        }
        else if(blockName == "loop_break"){
            blockID += "02";
            blockID += "000000";
            return blockID;
        }
        else if(blockName == "loop_continue"){
            blockID += "03";
            blockID += "000000";
            return blockID;
        }

        // WAIT TOOLBOXS
        blockID = "WA"
        if(blockName == "wait_led_matrix_ready"){       blockID += "01000000";  return blockID;}
        else if(blockName == "wait_sw1_pressed"){       blockID += "02000000";  return blockID;}
        else if(blockName == "wait_sw1_released"){      blockID += "03000000";  return blockID;}
        else if(blockName == "wait_sw2_pressed"){       blockID += "04000000";  return blockID;}
        else if(blockName == "wait_sw2_released"){      blockID += "05000000";  return blockID;}

        // MUSIC TOOLBOXS
        blockID = "MS"
        if(blockName == "music_note"){
            blockID += "01";
            blockID += String(parseInt(blockField["NOTE"])+1).padStart(2,'0');      // NOTE field
            blockID += String(parseInt(blockField["DURATION"])+1).padStart(2,'0');  // DURATION field
            blockID += "00";
            return blockID;
        }
        else if(blockName == "music_rest"){
            blockID += "02";
            blockID += String(parseInt(blockField["DURATION"])+1).padStart(2,'0');  // DURATION field
            blockID += "0000";
            return blockID;
        }
        else if(blockName == "music_scale"){
            blockID += "03";
            blockID += String(parseInt(blockField["SCALE"])+1).padStart(2,'0');     // SCALE field
            blockID += String(parseInt(blockField["NOTE"])+1).padStart(2,'0');      // NOTE field
            blockID += String(parseInt(blockField["DURATION"])+1).padStart(2,'0');  // DURATION field
            return blockID;
        }
        else if(blockName == "music_set_volume"){blockID += "04000000"; return blockID;}
        else if(blockName == "music_get_volume"){blockID += "05000000"; return blockID;}

        // SENSOR TOOLBOXS
        blockID = "SS"
        if(blockName == "sensor_ldr"){          blockID += "01000000"; return blockID;}
        else if(blockName == "sensor_lm73"){    blockID += "02000000"; return blockID;}
        else if(blockName == "sensor_switch1"){ blockID += "03000000"; return blockID;}
        else if(blockName == "sensor_switch2"){ blockID += "04000000"; return blockID;}

        // CLOCK TOOLBOXS
        blockID = "CL"
        if(blockName == "rtc_get"){             blockID += "01000000"; return blockID;}
        else if(blockName == "rtc_get_date"){   blockID += "02000000"; return blockID;}
        else if(blockName == "rtc_get_time"){   blockID += "03000000"; return blockID;}
        else if(blockName == "rtc_get_day"){    blockID += "04000000"; return blockID;}
        else if(blockName == "rtc_get_month"){  blockID += "05000000"; return blockID;}
        else if(blockName == "rtc_get_year"){   blockID += "06000000"; return blockID;}
        else if(blockName == "rtc_get_hour"){   blockID += "07000000"; return blockID;}
        else if(blockName == "rtc_get_minute"){ blockID += "08000000"; return blockID;}
        else if(blockName == "rtc_get_second"){ blockID += "09000000"; return blockID;}

        // I/O TOOLBOXS
        blockID = "IO"
        if(blockName == "output_write"){        
            blockID += "01";
            blockID += String(blockField["OUTPUT"]).padStart(2,'0');            // OUTPUT field
            blockID += String(parseInt(blockField["STATUS"])+1).padStart(2,'0');// STATUS field
            blockID += "00";
            return blockID;
        }
        else if(blockName == "output_toggle"){
            blockID += "02";
            blockID += String(blockField["OUTPUT"]).padStart(2,'0');            // OUTPUT field
            blockID += "0000";
            return blockID;
        }
        else if(blockName == "output_read"){
            blockID += "03";
            blockID += String(blockField["OUTPUT"]).padStart(2,'0');            // OUTPUT field
            blockID += "0000";
            return blockID;
        }
        else if(blockName == "usbsw_write"){
            blockID += "04";
            blockID += String(parseInt(blockField["STATUS"])+1).padStart(2,'0');// STATUS field
            blockID += "0000";
            return blockID;
        }
        else if(blockName == "usbsw_toggle"){   blockID += "05000000"; return blockID;}
        else if(blockName == "usbsw_read"){     blockID += "06000000"; return blockID;}
        else if(blockName == "input_read"){
            blockID += "07";
            blockID += String(blockField["INPUT"]).padStart(2,'0');            // INPUT field
            blockID += "0000";
            return blockID;
        }

        // Advance TOOLBOXS
        blockID = "AV"
        if(blockName == "advance_task"){        blockID += "01000000"; return blockID;}
        else if(blockName == "advance_task"){   blockID += "02000000"; return blockID;}
        else if(blockName == "call_function"){  blockID += "03000000"; return blockID;}

        // Variable TOOLBOXS
        blockID = "VR"
        if(blockName == "variables_set"){       blockID += "01000000"; return blockID;}
        else if(blockName == "math_change"){    blockID += "02000000"; return blockID;}
        else if(blockName == "variables_get"){  blockID += "03000000"; return blockID;}        

        // TEXT TOOLBOXS
        blockID = "TE"
        if(blockName == "string_length"){       blockID += "02000000"; return blockID;}
        else if(blockName == "string_with_number"){blockID += "03000000"; return blockID;}
        else if(blockName == "string_join"){    blockID += "04000000"; return blockID;} 
        else if(blockName == "string_charAt"){  blockID += "05000000"; return blockID;} 
        else if(blockName == "string_substring"){blockID += "06000000"; return blockID;} 
         

        // LIST TOOLBOXS
        blockID = "LI"
        if(blockName == "lists_create_with"){           blockID += "01000000"; return blockID;}
        else if(blockName == "list_get_length"){        blockID += "02000000"; return blockID;}
        else if(blockName == "list_get_index"){         blockID += "03000000"; return blockID;}
        else if(blockName == "list_set_index"){         blockID += "04000000"; return blockID;}
        else if(blockName == "list_insert_first"){      blockID += "05000000"; return blockID;}
        else if(blockName == "list_insert_last"){       blockID += "06000000"; return blockID;}
        else if(blockName == "list_insert_index"){      blockID += "07000000"; return blockID;}
        else if(blockName == "list_get_text"){          blockID += "08000000"; return blockID;}
        
        // KB IOT (Gauge) TOOLBOXS
        blockID = "GA"
        if(blockName == "gauge_iot"){
            blockID += "01";
            if(blockField["GAUGE_SELECTION"] == "G1"){      blockID += "010000"; return blockID;}
            else if(blockField["GAUGE_SELECTION"] == "G2"){ blockID += "020000"; return blockID;}
        }
        else if(blockName == "gauge_title"){
            blockID += "02";
            if(blockField["GAUGE_SELECTION"] == "G1"){      blockID += "010000"; return blockID;}
            else if(blockField["GAUGE_SELECTION"] == "G2"){ blockID += "020000"; return blockID;}
        }
        else if(blockName == "gauge_unit"){
            blockID += "03";
            if(blockField["GAUGE_SELECTION"] == "G1"){      blockID += "010000"; return blockID;}
            else if(blockField["GAUGE_SELECTION"] == "G2"){ blockID += "020000"; return blockID;}
        }
        else if(blockName == "gauge_color"){
            blockID += "04";
            if(blockField["GAUGE_SELECTION"] == "G1"){      blockID += "010000"; return blockID;}
            else if(blockField["GAUGE_SELECTION"] == "G2"){ blockID += "020000"; return blockID;}
        }
        else if(blockName == "gauge_minmax"){
            blockID += "05";
            if(blockField["GAUGE_SELECTION"] == "G1"){      blockID += "010000"; return blockID;}
            else if(blockField["GAUGE_SELECTION"] == "G2"){ blockID += "020000"; return blockID;}
        }
        
        // KB IOT (Graph) TOOLBOXS
        blockID = "GR"
        if(blockName == "feed_iot"){
            blockID += "01";
            if(blockField["FEED_SELECTION"] == "F1"){      blockID += "010000"; return blockID;}
            else if(blockField["FEED_SELECTION"] == "F2"){ blockID += "020000"; return blockID;}
        }
        else if(blockName == "feed_main_titile"){          blockID += "02000000"; return blockID;}
        else if(blockName == "feed_color"){
            if(blockField["FEED_SELECTION"] == "F1"){      blockID += "010000"; return blockID;}
            else if(blockField["FEED_SELECTION"] == "F2"){ blockID += "020000"; return blockID;}
        }

        // KB IOT (Plugin) TOOLBOXS
        blockID = "PI"

        return "NA00000000";
    }

    filter_create(Json,blockObject){
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

            // logging Record
            this.logger.record({
                "Status":"create",
                "BlockName":My_block.type,
                "BlockID": this._getBlockID_by_block(My_block),
                "ID":My_block.ID,
                //"NewParentID":"",
                "Element":My_block.element,
                //"NewInputName":""
                "Node":My_block.node,
            });

            let BlockID     = this._getBlockID_by_block(My_block);
            
            if(this.debug){
                var debugMessage = "";
                debugMessage += "[" + this.blocks[this.running_ID].type + "] create ID [" + this.blocks[this.running_ID].ID + "]"
                console.log(debugMessage);
            }
            this.running_ID++;
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
            My_block.element = Block_Element;
            My_block.node    = Block_Node;

            // check type of changs
            if(Json.element == "mutation"){mutationChange = true;}
            else if(Json.element == "field"){fieldChange = true;}


            // Update Element
            if(mutationChange){
                My_block.element["mutation"] = Json.newValue;
                debugMessage += "[" + this.blocks[ID].type + "] change (" + "[field][mutation]" + ")>> " + Json.newValue;
                this.logger.record({
                    "Status":"change",
                    "BlockName":My_block.type,
                    "BlockID": this._getBlockID_by_block(My_block),
                    "ID":My_block.ID,
                    //"NewParentID":"",
                    "Element":My_block.element,
                    //"NewInputName":""
                    "Node":My_block.node,
                });
            }
            else if(fieldChange)
            {
                My_block.element["field"][Json.name] = Json.newValue;
                debugMessage += "[" + this.blocks[ID].type + "] change (" + "[field]["+String(Json.name) + "])>> " + Json.newValue;
                this.logger.record({
                    "Status":"change",
                    "BlockName":My_block.type,
                    "BlockID": this._getBlockID_by_block(My_block),
                    "ID":My_block.ID,
                    //"NewParentID":"",
                    "Element":My_block.element,
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
                    "Status":"connect",
                    "BlockName":My_block.type,
                    "BlockID": this._getBlockID_by_block(My_block),
                    "ID":My_block.ID,
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
                    "Status":"disconnect",
                    "BlockName":My_block.type,
                    "BlockID": this._getBlockID_by_block(My_block),
                    "ID":My_block.ID,
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
                "Status":"delete",
                "BlockName":My_block.type,
                "BlockID": this._getBlockID_by_block(My_block),
                "ID":My_block.ID,
                "NewParentID":My_block.newParentId,
                "Element":My_block.element,
                "NewInputName":My_block.newInputName
            });
            delete this.blocks.select_ID
            if(this.debug){console.log(debugMessage);}

        }
    }

    updateChange(Json,block){
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
                this.filter_create(Json,block);
                break;
            case 'change':
                this.filter_change(Json,block);
            case 'ui':
                break;
            case 'move':
                this.filter_move(Json);
                break;
            default:
                break;
        }
    }
}

// Create class immediatly
const filtering = new Log_filter();