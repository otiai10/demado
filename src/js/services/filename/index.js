
export function safe(name) {
  return name.replace(/[¥\/:*?"<>|]+/g, '_');
}
