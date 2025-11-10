export const focusFirstError = () => {
  const invalid = document.querySelector('[aria-invalid="true"], .error input, .error select');
  if (invalid instanceof HTMLElement) {
    invalid.focus();
  }
};
