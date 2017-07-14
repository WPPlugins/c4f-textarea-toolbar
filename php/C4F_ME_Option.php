<?php
/*
    Copyright (C) 2008  code4fun.org

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/**
 * Mutually Exclusive option.  
 *
 */
class C4F_ME_Option {
	
	var $items;		// allowed values for the option
	var $selected;	// current selected value

	/**
	 * Default constructor.
	 * Initialize the allowed values list using the provided array.
	 * The first array element becomes the default selected value.  
	 *
	 * @param Array $values - allowed values list
	 */
	function C4F_ME_Option($values) {
		
		if(!empty($values)) {
			foreach ($values as $v) {
				$this->items[] = $v;
			}
			$this->selected	= $this->items[0];
		}		
	}
	
	/**
	 * Sets selected value if is one of the allowed.
	 *
	 * @param String $x - the value to set
	 */
	function setSelected($x) {
		if (in_array($x, $this->items)) {
			$this->selected = $x; 
		} 
	}
	
	/**
	 * Gets selected value.
	 *
	 * @return current selected value
	 */
	function getSelected() {
		return $this->selected;
	}
	
	/**
	 * Checks if a value is selected.
	 *
	 * @param String $x - the value to check for
	 * @return TRUE if the specified value is the current selected,
	 * 		   FALSE otherwise
	 */
	function isSelected($x) {
		return ($this->selected === $x);
	}
	
	/**
	 * Sets the first value in the allowed list as the selected one.
	 *
	 */
	function reset() {
		$this->selected = $this->items[0]; 
	}
	
	/**
	 * Gets allowed values list.
	 *
	 * @return the allowed values list
	 */
	function getItems() {
		return $this->items;
	}
	
	/**
	 * Checks if a value is in the allowed list.
	 *
	 * @param String $v - the value to check for
	 * @return TRUE if the specified value matches one of the allowed,
	 * 		   FALSE otherwise
	 */
	function valueExists($v) {
		return in_array($v, $this->items);
	}
}
?>