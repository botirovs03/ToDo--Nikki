// You may need to install some type definitions for TypeScript to recognize the DOM elements and methods
// For example, you can run `npm install --save-dev @types/node` to install the Node.js types
// You can also add `/// <reference types="node" />` at the top of your file to reference the types

// Declare the types for the variables that store the DOM elements
const body: HTMLElement = document.querySelector("body") as HTMLElement;
const sidebar: HTMLElement = document.querySelector(".sidebar") as HTMLElement;
const toggle: HTMLElement = document.querySelector(".toggle") as HTMLElement;
const searchBtn: HTMLElement = document.querySelector(".search-box") as HTMLElement;
const modeSwitch: HTMLElement = document.querySelector(".toggle-switch") as HTMLElement;
const modeText: HTMLElement = document.querySelector(".mode-text") as HTMLElement;

// Add event listeners to the elements and use arrow functions
toggle.addEventListener("click", () => {
  sidebar.classList.toggle("close");
});