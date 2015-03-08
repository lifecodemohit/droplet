/*
author : lifecodemohit
lang   : javascript
*/

(function(root, mod) {
  if (typeof exports == "object" && typeof module == "object") return mod(exports); // CommonJS
  if (typeof define == "function" && define.amd) return define(["exports"], mod); // AMD
  mod(root.csvparser || (root.csvparser = {})); // Plain browser env
})(this, function(exports) {
  "use strict";

  exports.version = "0.7.1";

	exports.parse = function(inp) {        // inp -> input @text
		//console.log(inp);
		var inp_separate = inp.split(/\r\n|\n/);
		var end_count = 0; 
		var node_list = [];
		for(var i=0;i<=inp_separate.length-1;i++)
		{
			if(inp_separate[i].length>0)
			{
				var entries = inp_separate[i].split(',');
				var count=0;
				var each_node_list=[];
				for(var j=0;j<=entries.length-1;j++)
				{
					var each_node_node={type:"each_node_node",start:end_count+count,end:end_count+count+entries[j].length,loc:{start:{line:i,column:count},end:{line:i,column:count+entries[j].length}},raw:entries[j]};
					count=count+entries[j].length+1;
					each_node_list.push(each_node_node);			
				}
				var each_node={type:"each_node",start:end_count,end:end_count+count-1,loc:{start:{line:i,column:0},end:{line:i,column:count-1}},node_list:each_node_list};
				end_count=end_count+count-1;
				node_list.push(each_node);
			}		
		}
		var last_entry=inp_separate.length-1;
		var result_list={type:"Program",start:0,end:end_count,loc:{start:{line:0,column:0},end:{line:last_entry,column:inp_separate[last_entry].length}},body:node_list};
		return result_list;
	};
});