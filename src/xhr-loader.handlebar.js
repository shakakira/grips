/*! XHR-Loader.Handlebar.js (Simple Templating Engine)
	v0.0.1 (c) Kyle Simpson
	MIT License
*/

(function(global){
	var _Loader = global.Handlebar.Loader || null,
		fOBJTOSTRING = Object.prototype.toString,
		fNOOP = function(){}
	;
	
	function engine() {
		var publicAPI,
			_util = global.Handlebar.Util,
			_file_cache = {}
		;
		
		function handleFile(xhr,src,cb) {
			if (xhr.readyState == 4) {
				xhr.onreadystatechange = fNOOP;
				_file_cache[src] = xhr.responseText;
				cb(xhr.responseText,xhr);
			}
		}
		
		function requestFile(src,cb,forceReload) {
			forceReload = !(!forceReload);
			if (_file_cache[src]) {
				cb(_file_cache[src],null);
				return;
			}
			
			if (forceReload) src = _util.cacheBuster(src);
			var xhr = _util.createXHR();
			xhr.open("GET",src);
			xhr.setRequestHeader("X-Handlebar-Mode","raw");
			xhr.onreadystatechange = function(){ handleFile(xhr,src,cb); };
			xhr.send("");
		}
		
		publicAPI = {
			get:requestFile,
			
			clone:function(){return engine();},
			noConflict:rollback
		};
				
		return publicAPI;
	};

	function rollback() {
		var _ld = global.Handlebar.Loader;
		global.Handlebar.Loader = _Loader;
		return _ld;
	}

	global.Handlebar.Loader = engine();
})(this);