/**
 * Default Wordpress allowed tags
 * <a href="" title=""> <abbr title=""> <acronym title=""> <b> <blockquote cite=""> <code> <em> <i> <strike> <strong>
 */
c4f.tags["strong"] 		= { handler : new c4f.TextStyle('<strong>%s</strong>')};
c4f.tags["em"]			= { handler : new c4f.TextStyle('<em>%s</em>')};
c4f.tags["strike"] 		= { handler : new c4f.TextStyle('<strike>%s</strike>')}; /* Deprecated by W3C, you should not use it! */c4f.tags["b"]			= { handler : new c4f.TextStyle('<b>%s</b>')}; 
c4f.tags["i"]			= { handler : new c4f.TextStyle('<i>%s</i>')};
c4f.tags["code"] 		= { handler : new c4f.TextStyle('<code>%s</code>')};
c4f.tags["blockquote"]	= { handler : new c4f.TextStyle('<blockquote cite="" >%s</blockquote>')};
c4f.tags["abbr"]		= { handler : new c4f.TextStyle('<abbr title="" >%s</abbr>')};
c4f.tags["acronym"]		= { handler : new c4f.TextStyle('<acronym title="" >%s</acronym>')};
c4f.tags["url"] 		= { handler : new c4f.UriStyle('<a href="%s" title="" >%s</a>')};
