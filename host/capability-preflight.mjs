// Pure compatibility decision, to be called BEFORE creating or executing the VLG.
export function checkCapabilities(manifest, granted, known) {
  const caps = manifest?.capabilities;
  if (!caps || !Array.isArray(caps.required) || !Array.isArray(caps.optional)) {
    throw new TypeError("Invalid capability declaration");
  }
  const available = new Set(granted);
  const registry = new Set(known);
  const missingRequired = caps.required.filter(id => !registry.has(id) || !available.has(id));
  const missingOptional = caps.optional.filter(id => !registry.has(id) || !available.has(id));
  return Object.freeze({
    compatible: missingRequired.length === 0,
    missingRequired,
    missingOptional,
    granted: [...new Set([...caps.required,...caps.optional].filter(id => registry.has(id) && available.has(id)))]
  });
}
