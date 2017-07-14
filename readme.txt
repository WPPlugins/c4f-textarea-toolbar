=== Plugin Name ===
Contributors: code4fun
Donate link: http://code4fun.org/donate.php
Tags: comment, comments, toolbar, textarea, emoticons, emoticon, smiley, smilies, tags, tag, markup, administration, 1.0
Requires at least: 2.1
Tested up to: 3.1.3
Stable tag: 1.0

C4F Textarea Toolbar adds a toolbar for markup and emoticons insertion to WordPress comments' textarea. It is extremely easy to set up and customize.

== Description ==

C4F Textarea Toolbar is a plugin for WordPress aimed at providing a simple yet very useful and precise tool to insert emoticons and markup in the comments' textarea. The JavaScript code used has been written to specifically address most (if not all) flaws in the interpretation of cursor position and text replacement of the other smilies/markup inserting tools you can find in forums and blogs and it does so by also taking into account the many differences among the major browsers.

With C4F Textarea Toolbar installed on your blog you and your readers will live a hassle-free comment's writing experience being able to **really** insert emoticons and formatting markup **in place** without getting your cursor thrown at the end of the text or your text bumped up and the like.

= Features Summary =

* Options Panel in Administration
* Ability to choose between the display of either markup buttons, smiley buttons or both
* Ability to reset C4F Textarea Toolbar to its default values or delete the database entry completely
* C4F Textarea Toolbar works both with the WordPress hook that is below the comments' textarea in most themes, or by including a simple call in your template *as we **strongly** recommend* (this automatically overrides the hook call)
* A warning message in case the user's browser doesn't support JavaScript or has JavaScript disabled

C4F Textarea Toolbar is the first plugin written by the [Code4Fun Team](http://code4fun.org/ "Code4Fun Website"), if you find it useful and would like to help, please consider a [contribution to the Code4Fun Project](http://code4fun.org/donate.php "Donate to Code4Fun Project").

== Installation ==

C4F Textarea Toolbar installation is extremely easy:

1. Download the plugin, unpack it and upload the whole "c4f-textarea-toolbar" folder to the `/wp-content/plugins/` directory
2. Activate C4F Textarea Toolbar through the "Plugins" menu in the Administration Panel
3. Place `<?php C4F_TextareaToolbar(); ?>` in your template (Optional but **Recommended**)
	* To avoid the plugin's function to be called (resulting in an error) when you disable the plugin, you might want to include the function using a conditional statement as in the following example: `<?php if (function_exists("C4F_TextareaToolbar")) C4F_TextareaToolbar(); ?>`
4. Check the options' page in your Administration Panel to configure C4F Textarea Toolbar

= Optional for advanced users =
You can set up C4F Textarea Toolbar also through parameters in an array inside the function call. The function accepts the following parameters:

* `showhat` (defines which toolbar is displayed)
* `credit` (defines if the credit line is displayed)

The credit parameter accepts a `true/false` value, while the `showhat` parameter accepts three values:

* `all` (displays both toolbars)
* `only_controls` (displays only the markup toolbar)
* `only_smilies` (displays only the emoticon toolbar)

Here are a few examples of how the parameters can be defined inside the function:

1. `<?php C4F_TextareaToolbar(array("showhat" => "only_smilies", "credit" => true)); ?>`
2. `<?php
      $params = array("showhat" => "only_controls", "credit" => false);
      C4F_TextareaToolbar($params);
      ?>`

Note that by using parameters inside the function **you will override the option panel's settings**.

== Frequently Asked Questions ==

= Is C4F Textarea Toolbar really so cool? =

Yes it is.

= Are you saying that C4F Textarea Toolbar is really so cool just because you still have no FAQs to answer or because you seriously mean it? =

Both.

== Screenshots ==

1. C4F Textarea Toolbar Plugin Options' Panel
2. C4F Textarea Toolbar Plugin in action (with custom function call) on the WordPress default theme (Kubrick)
3. C4F Textarea Toolbar Plugin in action (using the WP hook) on the WordPress default theme (Kubrick)

== License ==

C4F Textarea Toolbar Plugin is released under the GNU General Public License, you can find a copy inside the package or [read it directly online](http://www.gnu.org/copyleft/gpl.html).

== History ==

* Version 1.0
	* Initial stable version