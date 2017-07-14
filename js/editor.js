/*******************************************************************************
* C4F Textarea Toolbar: editor.js
* Description: C4F Textarea Toolbar core functions
*
* Author: C4F Team (http://code4fun.org)
*
* Copyright (C) 2008  code4fun.org
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
*
*******************************************************************************/

// we define a unique namespace to avoid function name conflicts.
var c4f = function() {
	
// begin private functions

var is_ie = (navigator.userAgent.toLowerCase().indexOf('msie') != -1);

/**
 * Get the selected string or the empty one if there's no selection.
 *
 * @param field	- Text input field to get selection from.
 * @return Selected string or the empty one if there's no selection.
 */
function getSelection(field) {

	var txt = "";

	if (is_ie && document.selection) {
		// Internet Explorer
		txt = document.selection.createRange().text;
	} else {
		// other browsers
		txt = field.value.substring(field.selectionStart,field.selectionEnd);
	}	
	return txt;
}

/**
 * Get the caret position in an input field.
 *
 * @param field	- Text input field to get caret position from.
 * @return Number of characters from the beginning of the text up to cursor,
 * 		   zero if cursor is not present in the input field.
 */
function getCaretPosition(textarea) {
		var caretPos;

		// other browsers
		if (textarea.selectionStart || textarea.selectionStart == 0) {
			caretPos = textarea.selectionStart;

		// Internet Explorer
		} else if (document.selection) {

			// get current selection
			var range = document.selection.createRange();

			// create a new selection of the whole textarea
			var range_all = document.body.createTextRange();
			range_all.moveToElementText(textarea);

			/* 
			* calculate selection start point by moving beginning of range_all 
			* to beginning of range
			*/
			var sel_start;
			for (sel_start = 0; 
				 range_all.compareEndPoints('StartToStart', range) < 0; 
				 sel_start++) {
				 range_all.moveStart('character', 1);
			}
			caretPos = sel_start;
		}
		return caretPos;
}

/**
 * Position cursor after a given number of characters of a text inside
 * a given text input.
 *
 * @param field - Text input field where we will position the cursor.
 * @param pos	- Number of characters from the beginning of the text where
 *				  we will position the cursor.
 *				  A negative value takes cursor at index zero.
 *				  A value higher then the string's length takes cursor after
 *				  the last character.
 */
function setCaretPosition(field, pos) {

	// other browsers
	if (field.setSelectionRange)	{
		// select a text range (from pos to pos)
		field.setSelectionRange(pos,pos);
		field.focus();
	}

	// Internet Explorer
	else if (is_ie && field.createTextRange) {

		// create a new TextRange object with the text contained by the field
		var range = field.createTextRange();

		/*
		* shrink (collapse) a text range down to a single insertion point.
		* The optional boolean value controls whether the insertion point goes
		* to the beginning (true) of the original range or the end (false).
		*/
		// in this case using true or false is irrelevant
		range.collapse(true);
		// move the end position of a text to a new location
		range.moveEnd('character', pos);
		// move the start position of the text to a new location
		range.moveStart('character', pos);
		// highlight the specified object, in this case gives focus to caret
		range.select();
	}
}

/**
 * Define the objet that the tags handlers have to return through the getTag
 * function.
 * @param tag -
 * @param offest -
 */
function tagObj(tag, offset) {
	this.tag	= tag;
	this.offset = offset;
}

/**
 * Return a string formatted as the format argument (S) specifies.
 * After the format parameter, the function expects at least as many additional
 * arguments (L) as specified in format.
 * Usage: printf("Does this work? %s, it %s.", ["Yes", "does"]);
 */
function printf(S, L) {
	var nS = "";
	var tS = S.split("%s");
	if (tS.length != L.length+1) throw "Input error";

	for(var i=0; i<L.length; i++) {
		nS += tS[i] + L[i];
	}	
	return nS + tS[tS.length-1];
}

/**
 * Check if a string is an email.
 * @param string - The string to check.
 * @return True if the specified string is an email, false if not.
 */
function isEmail(string) {
	var pattern = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	return pattern.test(string);
}

/**
 * Check if a string is a URI.
 * @param string - The string to check.
 * @return True if the specified string is a URI, false if not.
 */
function isUri(string) {
	var pattern = /^((http|https|ftp):\/\/)?([^:\/\s]+\.\w{2,})((\/\w+)*\/?)([\w\-\.]+\.[^#?\s]+)?(#[\w\-]+)?$/;
	return string.match(pattern);
}

/**
 * Check if a string is an image path.
 * @param string - The string to check.
 * @return True if the specified string is an image path, false if not.
 */
function isImgPath(string) {
	//var pattern =/^((http|https):\/)?\/?([^:\/\s]+)?((\/\w+)*\/)?([\w\-\.]+\.[^#?\s]{3,})$/;
	var pattern = /(.*)[\/\\]([^\/\\]+\.(bmp|dwg|fif|gif|ief|ifs|jfif|jpe|jpg|jpeg|pbm|pcd|pgm|pjp|pjpeg|png|pnm|ppm|ras|rgb|svf|tif|tiff|wi|xbm|xpm|xwd))$/g;
	return string.match(pattern);
}	

// end private functions

// begin public functions

return {

tags :
new Array(),

smilies :
new Array(),

/**
 * Write tag into input field.
 * @param tagId - The tag id based on tags array.
 * @param fieldId - The html id of the input field.
 * @param optional - Optional parameter.
 */

insertTag : 
function(tagId, fieldId, optional) {

	if (typeof optional == "undefined") optional = null;
  	field = document.getElementById(fieldId);

	field.focus();	// do not remove or getCaretPosition will fail
	var orig = (window.opera)
			   ? field.value
			   : field.value.replace(/(\r\n|\r|\n)/g, '\n');

	var caret = getCaretPosition(field);

	var sel	= (window.opera)
			  ? getSelection(field)
			  : getSelection(field).replace(/(\r\n|\r|\n)/g, '\n');

	var before 		= caret;
	var after  		= before + sel.length;
	var tag 		= "";
	var scrollTop	= field.scrollTop;
	var offset		= 0;

	if (this.smilies.hasOwnProperty(tagId)) {
		tag 	= this.smilies[tagId]["tag"];
		offset 	= tag.length;
	} else if (this.tags.hasOwnProperty(tagId)) {
		this.tags[tagId]["handler"].selection = sel;
		if (optional!=null) this.tags[tagId]["handler"].param = optional;
		result 	= this.tags[tagId]["handler"].getTag();
		tag 	= result.tag;
		offset 	= result.offset;
	} else {
		return;
	}

	// insert tag
	if (tag != null) {
		field.value = orig.substring(0,before) + tag + orig.substring(after);
	}

	// position caret
	setCaretPosition(field, before+offset);

	// set vertical scrolling (Opera doesn't need this)
	if(!window.opera) field.scrollTop = scrollTop;

	// set focus to input field
	field.focus();
},

/******************************* Tags Handlers ********************************/

TextStyle :
function(pattern) {

	this.pattern   = pattern;
	this.selection = "";

	this.getTag = function() {

		var tag 	= printf(this.pattern, [this.selection]);
		var offset  = 0;

		if (this.selection=="") {
			var index 	= this.pattern.indexOf('%s');
			offset		= (index!=-1)?index:0;
		} else {
			offset		= tag.length;
		}

		return new tagObj(tag, offset);
	};
},

TextColor :
function(pattern) {

	this.pattern 	= pattern;
	this.selection	= "";
	this.param		= "";

	this.getTag = function() {
		var tag 	= null;
		var offset  = 0;

		tag = printf(this.pattern, [this.param, this.selection]);
		if (this.selection=="") {
			var splitted = this.pattern.split('%s');
			offset = (splitted.length==3)
					 ? (splitted[0].length+this.param.length+splitted[1].length)
					 : 0;
		} else {
			offset = tag.length;
		}
		return new tagObj(tag, offset);
	};
},

OrderedListStyle :
function(pattern, numbered, alphabetical) {

	this.pattern   		= pattern;
	this.numbered  		= numbered;
	this.alphabetical 	= alphabetical;
	this.selection 		= "";

	this.getTag = function() {
		var tag 	= null;
		var offset  = 0;
		var type 	= prompt("List type: 1=numbered, a=alphabetical", "1");
		if (type == null || (type != "1" && type != "a")) {
			return new tagObj(tag, offset);
		}

		type = (type=="1")?this.numbered:this.alphabetical;
		tag  = printf(this.pattern, [type, this.selection]);

		if (this.selection=="") {
			var splitted = this.pattern.split('%s');
			offset = (splitted.length==3)
					 ? (splitted[0].length+type.length+splitted[1].length)
					 : 0;
		} else {
			offset = tag.length;
		}
		return new tagObj(tag, offset);
	};
},

UriStyle :
function(pattern) {

	this.pattern   = pattern;
	this.selection = "";

	this.getTag = function() {

		var tag		 = null;
		var offset   = 0;
		var validURI = isUri(this.selection);

		var url = prompt("Pointing location:", 
						 (validURI)?this.selection:"http://");
		if (url == null || url == "") return new tagObj(tag, offset);

		var text  = prompt("Location text:", (!validURI)?this.selection:"");
		if (text == null || text == "") return new tagObj(tag, offset);

		tag 	= printf(this.pattern, [url, text]);
		offset  = tag.length;
		return new tagObj(tag, offset);
	};
},

ImgStyle :
function(pattern) {

	this.pattern   = pattern;
	this.selection = "";

	this.getTag = function() {

		var tag		= null;
		var offset  = 0;

		var validImgPath = isImgPath(this.selection);

		var source = prompt("Image source:", (validImgPath)?this.selection:"");
		if (source == null || source == "") return new tagObj(tag, offset);

		var alt = prompt("Image alternative text: ", 
						 (!validImgPath)?this.selection:"");
		if (alt == null || alt == "") return new tagObj(tag, offset);

		tag		= printf(this.pattern, [source, alt]);
		offset	= tag.length;
		return new tagObj(tag, offset);
	};
},

MailStyle :
function(pattern) {

	this.pattern   = pattern;
	this.selection = "";

	this.getTag = function() {

		var tag			= null;
		var offset		= 0;
		var validMail	= isEmail(this.selection);

		var address = prompt("Email address:", (validMail)?this.selection:"");
		if (address == null || address == "") return new tagObj(tag, offset);

		var text = prompt("Text:", (!validMail)?this.selection:"");
		if (text == null || text == "") return new tagObj(tag, offset);

		tag		= printf(this.pattern, [address, text]);
		offset 	= tag.length;
		return new tagObj(tag, offset);
	};
}	

};
// end public functions
}();
// end of namepsace


function c4fshowDesc(tagId, targetId) {
	var defText = "";
	var text	= "";
	
	if (c4f.smilies.hasOwnProperty(tagId)) {
		text = c4f.smilies[tagId]["description"];
	} else if(c4f.tags.hasOwnProperty(tagId) ) { 
		text = c4f.tags[tagId]["description"];
	}
	   
	var target	= document.getElementById(targetId);
	
	if (target.firstChild) {
		defText = target.firstChild.nodeValue;
		target.firstChild.nodeValue = text;
	} else {
		textNode = document.createTextNode(text);
		target.appendChild(textNode);	
	}
	
	var src = (window.event)?window.event.srcElement:this;
	src.onmouseout = function() {target.firstChild.nodeValue = defText;};
}