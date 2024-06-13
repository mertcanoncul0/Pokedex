/**
 * Selects a single DOM element based on a CSS selector.
 * If no matching element is found, returns a new <span> element.
 *
 * @param {string} selector - A string containing one or more CSS selectors.
 * @param {Element|Document} [scope=document] - The scope within which to search for the selector. Defaults to the entire document.
 * @returns {Element} The first element within the specified scope that matches the selector, or a new <span> element if no matches are found.
 */
const qs = (selector, scope = document) =>
  scope.querySelector(selector) ?? document.createElement("span");

/**
 * Selects DOM elements based on a CSS selector.
 * If no matching elements are found, returns an empty NodeList.
 *
 * @param {string} selector - A string containing one or more CSS selectors.
 * @param {Element|Document} [scope=document] - The scope within which to search for the selector. Defaults to the entire document.
 * @returns {NodeList} A NodeList containing all elements within the specified scope that match the selector, or an empty NodeList if no matches are found.
 */
const qsa = (selector, scope = document) =>
  scope.querySelectorAll(selector) ?? [document.createElement("span")];

/**
 * Displays an error message in the specified scope element.
 *
 * @param {string} message - The main error message.
 */
const showError = (message) => {
  const h2 = document.createElement("h2");
  h2.className = "error-page-head";
  h2.textContent = message;

  if (pokeWrapper.querySelector(".error-page-head")) {
    pokeWrapper.querySelector(".error-page-head").remove();
  }

  pokeWrapper.appendChild(h2);
};

/**
 * Formats the weight value to display.
 *
 * @param {number} weight - The weight value in kilograms.
 * @returns {string} The formatted weight string.
 */
const formatWeight = (weight) => {
  if (weight >= 1000) {
    return `${(weight / 1000).toFixed(1)} Tons`;
  }

  return `${weight} Kg`;
};

/**
 * Displays a snackbar with the given message.
 *
 * @param {string} message - The message to be displayed in the snackbar.
 */
const showSnackbar = (message) => {
  const snackbar = document.getElementById("snackbar");

  snackbar.textContent = message;

  snackbar.className = "snackbar show";

  setTimeout(() => {
    snackbar.className = snackbar.className.replace("show", "");
  }, 3000);
};
