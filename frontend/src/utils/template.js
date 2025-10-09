// mergeTemplate: replace {key} with row[key]
export function mergeTemplate(template = '', row = {}) {
  return template.replace(/\{(\w+)\}/g, (_, key) => (row[key] != null ? row[key] : ''));
}

export default mergeTemplate;
