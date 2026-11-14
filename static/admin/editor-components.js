// Custom Sveltia CMS editor components.
// Loaded after sveltia-cms.js in static/admin/index.html.

// Shortcode params are double-quoted; Hugo accepts \" inside them.
const escapeParam = (value) => String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
const unescapeParam = (value) => value.replace(/\\(["\\])/g, '$1');
const escapeHtml = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// {{< image >}} shortcode: replaces the built-in image component so body images
// go through the Hugo image pipeline (AVIF conversion, publishing from assets/).
const IMAGE_PARAMS = ['src', 'alt', 'caption', 'width', 'class', 'loading'];

CMS.registerEditorComponent({
  id: 'hugo-image',
  label: 'Image',
  icon: 'image',
  fields: [
    { name: 'src', label: 'Image', widget: 'image' },
    {
      name: 'alt',
      label: 'Alt text',
      widget: 'string',
      required: false,
      hint: 'Describe the image for people who can’t see it. Leave blank if it’s purely decorative.',
    },
    {
      name: 'caption',
      label: 'Caption',
      widget: 'string',
      required: false,
      hint: 'Optional caption shown under the image. Markdown links and bold/italic are allowed.',
    },
    // Not edited in the CMS, but preserved so existing shortcodes round-trip unchanged.
    { name: 'width', widget: 'hidden', required: false },
    { name: 'class', widget: 'hidden', required: false },
    { name: 'loading', widget: 'hidden', required: false },
  ],
  pattern: /{{<\s*image\s+((?:[a-z]+="(?:[^"\\]|\\.)*"\s*)*)>}}/,
  fromBlock: (match) => {
    const values = {};
    for (const [, name, value] of match[1].matchAll(/([a-z]+)="((?:[^"\\]|\\.)*)"/g)) {
      values[name] = unescapeParam(value);
    }
    return values;
  },
  toBlock: (values = {}) => {
    const params = IMAGE_PARAMS.filter((name) => values[name])
      .map((name) => `${name}="${escapeParam(values[name])}"`)
      .join(' ');
    return `{{< image ${params} >}}`;
  },
  toPreview: ({ src = '', alt = '', caption = '' } = {}) => {
    if (!src) return '';
    const img = `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}">`;
    return caption ? `<figure>${img}<figcaption>${escapeHtml(caption)}</figcaption></figure>` : img;
  },
});
