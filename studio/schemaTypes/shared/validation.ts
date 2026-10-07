export const noEmDash = (value: unknown) =>
  typeof value === 'string' && value.includes('\u2014')
    ? 'Do not use em dashes. Use a comma, colon or full stop instead.'
    : true
