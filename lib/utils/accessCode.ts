// Generate a random 8-character alphanumeric access code
export function generateAccessCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// Format access code for display (e.g., ABCD-EFGH)
export function formatAccessCode(code: string): string {
  if (code.length !== 8) return code
  return `${code.substring(0, 4)}-${code.substring(4)}`
}
