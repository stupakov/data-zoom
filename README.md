###TODO

- [DONE] - hardcoded divs with css for hiding/showing based on zoom
- [DONE] - js script
- [DONE] - hierarchical data sample (full and summary)
- [DONE] - make js widget that displays zoom level and width of visual viewport
- detect if an element takes up the entire viewport
- replace the entire DOM with that node
- zooming out: detect if zooming out to 100% and replace the dom with the element's parent

###Notes

Much of this is from notes about pixels at http://www.quirksmode.org/presentations/Spring2012/mobeers.pdf

- Layout viewport: width in css pixels of the page that is being rendered.
- Visual viewport: width in css pixels of the part of the page that is shown on the screen (decreases when zooming in.)

- Desktop zooming: layout viewport actually gets smaller, percentage widths get recalculated.
- Mobile zooming: layout viewport stays wide, visual viewport is shrunk.

#### JavaScript Properties

- screen.width and screen.height are device pixels (useless since it is not CSS pixels)
- document.documentElement.clientWidth = layout viewport (in CSS pixels). EQUAL to "width" media query
- window.innerWidth = width of visual viewport in CSS pixels (how much viewer is seeing)
- document.documentElement.offsetWidth = width of \<html\> element in CS pixels
- window.pageXOffset = current scrolling offset in CSS pixels

#### Media queries

- "width" media query is the LAYOUT viewport.
- meta viewport: \<meta name="viewport" content="width=device-width"\> sets the size of the LAYOUT viewport ("device-width", which is usually what you want, or pixel value).  Setting layout to become device width now makes the "width" media query useful for triggering changes on device width.