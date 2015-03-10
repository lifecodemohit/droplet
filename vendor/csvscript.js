/*
author : lifecodemohit
lang   : javascript
*/

(function(root, mod) {
  if (typeof exports == "object" && typeof module == "object") return mod(exports); // CommonJS
  if (typeof define == "function" && define.amd) return define(["exports"], mod); // AMD
  mod(root.csvscript || (root.csvscript = {})); // Plain browser env
})(this, function(exports) {
  "use strict";

  exports.version = "0.7.1";

  function getLeadingWhiteSpaceCountFor(string) {
  	//Reference : http://jsperf.com/leading-white-space-count
    for (var result = 0, characterCode = string.charCodeAt(0); 32 == characterCode || characterCode > 8 && characterCode < 14 && characterCode != 11 && characterCode != 12;) {
      characterCode = string.charCodeAt(++result);
    }
    return result;
  }  

	exports.parse = function(inp) {        // inp -> input @text
		//console.log(inp);
		var inp_separate = inp.split(/\r\n|\n/);
		var end_count = 0; 
		var argument = [];
		for(var i=0;i<=inp_separate.length-1;i++)
		{
			if(inp_separate[i].length>0)
			{
				if(inp_separate[i].match(/^\s*\/\/.*$/))
				{
					var entries = inp_separate[i];
					var count=0;
					var block_list=[];
					for(var j=0;j<=entries.length-1;j++)
					{
						var socket={type:"socket",start:end_count+count,end:end_count+count+entries[j].length,loc:{start:{line:i,column:count},end:{line:i,column:count+entries[j].length}},raw:entries[j]};
						count=count+entries[j].length+1;
						block_list.push(socket);			
					}
					var block={type:"comment",start:end_count,end:end_count+count-1,loc:{start:{line:i,column:0},end:{line:i,column:count-1}},argument:block_list};
					end_count=end_count+count-1;
					argument.push(block);
				}
				else
				{
					var text=inp_separate[i];
					var entries = inp_separate[i].split(',');
					var count=0;
					var block_list=[];
					for(var j=0;j<=entries.length-1;j++)
					{
						if(entries[j].match(/^.*\s*\/\/.*$/))
							entries[j]=entries[j].split('//')[0];
						//console.log(getLeadingWhiteSpaceCountFor(entries[j]));
						var leading_space=getLeadingWhiteSpaceCountFor(entries[j]);
						var trailing_space=getLeadingWhiteSpaceCountFor(entries[j].split("").reverse().join(""));
						if(entries[j].match(/^\s*\".*$/))
						{
							var entry_skip="";
							while((j<entries.length)&&(!entries[j].match(/^.*\s*\"$/)))
							{
								entry_skip=entry_skip+entries[j];
								entry_skip=entry_skip+',';
								j++;
							}
							if(j<entries.length)
								entry_skip=entry_skip+entries[j];
							else
								return null;
							var socket={type:"socket",start:end_count+count,end:end_count+count+entry_skip.length,loc:{start:{line:i,column:count+leading_space},end:{line:i,column:count+entry_skip.length-trailing_space}},raw:entry_skip};
							count=count+entry_skip.length+1;
							block_list.push(socket);
						}
						else if(entries[j].match(/^.*\s*\"$/))
						{
				    	return null;
				    }
						else
						{
							var socket={type:"socket",start:end_count+count,end:end_count+count+entries[j].length,loc:{start:{line:i,column:count+leading_space},end:{line:i,column:count+entries[j].length-trailing_space}},raw:entries[j]};
							count=count+entries[j].length+1;
							block_list.push(socket);			
						}
					}
					var block={type:"block",start:end_count,end:end_count+count-1,loc:{start:{line:i,column:0},end:{line:i,column:count-1}},argument:block_list};
					end_count=end_count+count-1;
					argument.push(block);
				}
			}		
		}
		var last_entry=inp_separate.length-1;
		var result_list={type:"Program",start:0,end:end_count,loc:{start:{line:0,column:0},end:{line:last_entry,column:inp_separate[last_entry].length}},body:argument};
		return result_list;
	};
});