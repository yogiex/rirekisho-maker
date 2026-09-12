export function normalizeWidth(input: string): string {
  return input.replace(/[０-９Ａ-Ｚａ-ｚ－＿]/g, (ch) => {
    return String.fromCharCode(ch.charCodeAt(0) - 0xFEE0);
  });
}
