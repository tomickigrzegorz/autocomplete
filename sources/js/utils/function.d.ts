/**
 * Check if a value is an object
 * @param value - The value to check.
 * @returns True if the value is an object, otherwise false.
 */
export function isObject(value: any): boolean;

/**
 * Check if a value is a Promise
 * @param value - The value to check.
 * @returns True if the value is a Promise, otherwise false.
 */
export function isPromise(value: any): boolean;

/**
 * Set attributes to an element
 * @param el - The HTML element to set attributes on.
 * @param attributes - An object containing attribute key-value pairs.
 */
export function setAttributes(
  el: HTMLElement,
  attributes: Record<string, string | number | boolean>,
): void;

/**
 * Get the trimmed text content of the first child element
 * @param element - The HTML element to get the text content from.
 * @returns The trimmed text content.
 */
export function getFirstElement(element: HTMLElement): string;

/**
 * Scroll the result list to the top
 * @param resultList - The result list element.
 * @param resultWrap - The wrapper element for the result list.
 */
export function scrollResultsToTop(
  resultList: HTMLElement,
  resultWrap: HTMLElement,
): void;

/**
 * Add ARIA attributes to all list items
 * @param itemsLi - A NodeList of HTML list item elements.
 */
export function addAriaToAllLiElements(itemsLi: NodeListOf<HTMLElement>): void;

/**
 * Show the clear button and attach a destroy event
 * @param clearButton - The clear button element.
 * @param destroy - The function to call when the clear button is clicked.
 */
export function showBtnToClearData(
  clearButton: HTMLElement,
  destroy: () => void,
): void;

/**
 * Manage class list actions
 * @param element - The HTML element to modify the class list of.
 * @param action - The action to perform ("add" or "remove").
 * @param className - The class name to add or remove.
 */
export function classList(
  element: HTMLElement,
  action: "add" | "remove",
  className: string,
): void;

/**
 * Set the aria-activedescendant attribute
 * @param root - The root HTML element.
 * @param type - The value to set for the aria-activedescendant attribute.
 */
export function setAriaActivedescendant(root: HTMLElement, type: string): void;

/**
 * Get the height of list items excluding a specific group class
 * @param outputUl - The ID of the output unordered list.
 * @param classGroup - The class name of the group to exclude.
 * @returns The total height of the list items.
 */
export function getClassGroupHeight(
  outputUl: string,
  classGroup: string,
): number;

/**
 * Scroll the active element into view
 * @param target - The active HTML element.
 * @param outputUl - The ID of the output unordered list.
 * @param classGroup - The class name of the group to exclude.
 * @param resultList - The result list element.
 */
export function followActiveElement(
  target: HTMLElement,
  outputUl: string,
  classGroup: string,
  resultList: HTMLElement,
): void;

/**
 * Create and configure the output list
 * @param root - The root HTML element.
 * @param resultList - The result list element.
 * @param outputUl - The ID of the output unordered list.
 * @param resultWrap - The wrapper element for the result list.
 * @param prefix - The prefix for class names.
 */
export function output(
  root: HTMLElement,
  resultList: HTMLElement,
  outputUl: string,
  resultWrap: HTMLElement,
  prefix: string,
): void;

/**
 * Create an HTML element
 * @param type - The type of element to create.
 * @returns The created HTML element.
 */
export function createElement(type: string): HTMLElement;

/**
 * Select an element by its selector
 * @param selector - The CSS selector to match.
 * @returns The matched HTML element or null if no match is found.
 */
export function select(selector: string): HTMLElement | null;

/**
 * Attach an event listener to an element
 * @param element - The HTML element to attach the event listener to.
 * @param action - The event type to listen for.
 * @param callback - The function to call when the event is triggered.
 */
export function onEvent(
  element: HTMLElement,
  action: string,
  callback: (event: Event) => void,
): void;

/**
 * Remove an event listener from an element
 * @param element - The HTML element to remove the event listener from.
 * @param action - The event type to stop listening for.
 * @param callback - The function to remove from the event listener.
 */
export function offEvent(
  element: HTMLElement,
  action: string,
  callback: (event: Event) => void,
): void;

/**
 * Default ARIA attributes for active descendant
 * @param id - The ID of the element to own the ARIA attributes.
 * @returns An object containing the default ARIA attributes.
 */
export function ariaActiveDescendantDefault(id: string): Record<string, string>;
