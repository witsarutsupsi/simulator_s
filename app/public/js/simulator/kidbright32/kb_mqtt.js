
/*function KB_servo() {
	this._constructor = function() {

	}

	this.setAngle = function(val) {
		return Math.log10(val);
	}
	this.calibrate = function(a,b,c) {
		return Math.log10(val);
	}
	//
	this._constructor();
}*/

var kb_mqtt = {
	_host: null,
	_port: null,
	_client_id: null,
	_username: null,
	_passward: null,

	on_connect: null,

	is_connect: null,

	publish: "",
	_value: null,

	subscribe: null,
	
	get_topic: null,
	_number: null,
	_text: "",

	_config: function(host, port, client_id, username, passward) {
		this._host = host;
		this._port = port;
		this._client_id = client_id;
		this._username = username;
		this._passward = passward;
	},
	_on_connected: function() {
		if(this.on_connect){
			return this.on_connect();
		}else{
			return 0;
		}
	},
	_is_connect: function() {
		if (this.is_connect) {
			return this.is_connect();
		}
		else {
			return '';
		}
	},
	_publish: function(topic, val) {
		this.publish = topic;
		this._value = val;
	},
	_subscribe: function() {
		if(this.subscribe){
			if(this.on_connect() == 1){
				return this.subscribe();
			}else{ return 0;}
		}else{ return 0;}
	},
	_get_topic: function() {

		if (this.get_topic) {
			if(this.on_connect() == 1 && this.subscribe() == 1){
				return this.get_topic();
			}else{return '';}
		}else{return '';}
	},
	_get_number: function() {
		if (this._number) {
			if(this.on_connect() == 1 && this.subscribe() == 1){
				return parseInt(this._number());
			}else{return 0;}
		}else{return 0;}
	},
	_get_text: function() {
		if (this._text) {
			if(this.on_connect() == 1 && this.subscribe() == 1){
				return this._text();
			}else{return '';}
		}else{return '';}
	}

};
//console.log(a + ', ' + b);
//setInterval(KB_task,100);