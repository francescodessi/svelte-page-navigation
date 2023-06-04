# Svelte Enhanced Notifications

<!-- SHIELDS -->
[![MIT License][license-shield]][license-url]
[![GitHub release][github-release-shield]][github-release-url]
[![npm version][npm-version-shield]][npm-url]

<!-- Title -->
<br />
<div align="center">
    <h3 align="center">Svelte Page Navigation</h3>
    <p align="center">
        A simple Svelte component to handle pagination.
    <br />
    <a href="https://github.com/francescodessi/svelte-page-navigation"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://francescodessi.github.io/svelte-page-navigation/" target="_blank">View Demo</a>
    ·
    <a href="https://github.com/francescodessi/svelte-page-navigation/issues">Report Bug</a>
    ·
    <a href="https://github.com/francescodessi/svelte-page-navigation/issues">Request Feature</a>
  </p>
</div>
<br />

<!-- TABLE OF CONTENTS -->
<br />
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#paginator-component">Paginator component</a></li>
      </ul>
    </li>    
    <li>
      <a href="#usage">Usage</a>
      <ul>
        <li><a href="#basic-example">Basic example</a></li>
        <li><a href="#custom-button-example">Custom button example</a></li>
      </ul>
    </li>
  </ol>
</details>
<br />

<!-- ABOUT THE PROJECT -->
## About The Project
A simple Svelte component for handling pagination, nothing more. Corrections and suggestions are welcome.

![paginator-screenshot-1]


### Built With
[![Svelte][svelte-shield]][Svelte-url]

[![SvelteKit][svelteKit-shield]][SvelteKit-url]

The <a href="https://francescodessi.github.io/svelte-page-navigation/" target="_blank">demo app</a> utilizes <a href="https://picocss.com/" target="_blank">Pico.css</a> as its styling framework.

The SVG icons used in this project are retrieved from <a href="https://iconify.design/" target="_blank">Iconify</a>, specifically the following icons:
- <a href="https://icon-sets.iconify.design/material-symbols/dark-mode-outline/" target="_blank">material-symbols:dark-mode-outline</a>
- <a href="https://icon-sets.iconify.design/material-symbols/light-mode-outline/" target="_blank">material-symbols:light-mode-outline</a>
- <a href="https://icon-sets.iconify.design/material-symbols/chevron-left/" target="_blank">material-symbols:chevron-left</a>
- <a href="https://icon-sets.iconify.design/material-symbols/chevron-right/" target="_blank">material-symbols:chevron-right</a>
- <a href="https://icon-sets.iconify.design/material-symbols/first-page/" target="_blank">material-symbols:first-page</a>
- <a href="https://icon-sets.iconify.design/material-symbols/last-page/" target="_blank">material-symbols:last-page</a>
- <a href="https://icon-sets.iconify.design/?query=material-symbols%3Amore-horiz" target="_blank">material-symbols:more-horiz</a>
- <a href="https://icon-sets.iconify.design/mdi/github/" target="_blank">mdi:github</a>


<!-- GETTING STARTED -->
## Getting Started
1. Install the package.
   ```sh
   npm i @dflare/svelte-page-navigation
   ```

2. Import the `Paginator` component.
   ```js
   import {Paginator} from "@dflare/svelte-page-navigation";
   ```

3. Add the `Paginator` component to the markup and handle the `chenge` event.
   ```html
   <Paginator on:change={pageChangeHandler} />
   ```

### Paginator component
The `Paginator` component is the main component that implements pagination and provides the following properties:

* **`pages`**: a number that represents the total number of items to be managed. Its default value is `10`.
* **`currentPage`**: a number indicating the current page (Zero-based numbering). Its default value is `0`.
* **`initChunkSize`**: a number indicating the size of page grouping. If this number is smaller than the total number of pages and the available space is sufficient, then the page navigation buttons will be displayed in groups of size equal to `initChunkSize`. Its default value is equal to the total number of pages set with the `pages` property.
* **`initShowFirstButton`**: a boolean that, when set to `true`, enables displaying a button to directly navigate to the first page. The default value is `true`.
* **`initShowLastButton`**: a boolean that, when set to `true`, enables displaying a button to directly navigate to the last page. The default value is `true`.
* **`showCurrentPageLabel`**: a boolean that, when set to `true`, enables displaying a label with the current page number. The default value is `false`.
* **`customPaginatorButton`**: it allows to specify a custom component that represents the button used by `Paginator` component.

If there is enough available space, the `Paginator` component will display all the buttons for the pages (based on the values set for the `pages` and `initChunkSize` properties). Otherwise, it will automatically reduce the number of visible buttons.

<!-- USAGE EXAMPLES -->
## Usage

### Basic example

```js
<script>
	import {Paginator} from '@dflare/svelte-page-navigation';
	
	let pages = 20;
	let currentPage = 6; // It can be omitted if you want to use the default value of 0 (Zero-based numbering)
	let initChunkSize = 10;
	let initShowFirstButton = true; // It can be omitted if you want to use the default value of true 
	let initShowLastButton = true; // It can be omitted if you want to use the default value of true
  let showCurrentPageLabel = true; // It can be omitted if you want to use the default value of false

	function pageChangeHandler(event) {
		currentPage = event.detail.page;
	}
</script>

<div>
	Current Page: {currentPage + 1}
</div>

<Paginator 
	pages={pages}
	currentPage={currentPage}
	initChunkSize={initChunkSize}
	initShowFirstButton={initShowFirstButton}
	initShowLastButton={initShowLastButton}
  showCurrentPageLabel={showCurrentPageLabel}
	on:change={pageChangeHandler} />
```

**Result**

![paginator-screenshot-2]


<p align="right">(<a href="https://svelte.dev/repl/9aaf93575c8f45c2ae5525f6f1dc3874?version=3.59.1" target="_blank">Try it on Svelte REPL</a>)</p>

### Custom button example
To create a completely custom button, it is sufficient to create a new component that has the structure and properties of the <a href="https://github.com/francescodessi/svelte-page-navigation/blob/main/src/lib/components/PaginatorButton.svelte#L1" target="_blank">PaginatorButton</a> default component. The custom component should be passed to the `Paginator` component, which will use it instead of the default one.

**App.svelte**

```js
<script>
    import {Paginator} from '@dflare/svelte-page-navigation';
    import CustomButton from './CustomButton.svelte';
	
    let pages = 20;
    let currentPage = 6;
    let initChunkSize = 10;

    function pageChangeHandler(event) {
      currentPage = event.detail.page;
    }
</script>

<div>
	Current Page: {currentPage + 1}
</div>

<Paginator
    customPaginatorButton={CustomButton}
    pages={pages}
    currentPage={currentPage}
    initChunkSize={initChunkSize}
    on:change={pageChangeHandler} />
```

**CustomButton.svelte**
```js
<script>
    export let title = undefined;
    export let disabled = false;
    export let page = undefined;
    export let active = false;
</script>

<button type="button" disabled={disabled} data-page={page} class:active={active} title={title} on:click>
    <slot></slot>
</button>

<style>
    button {
        display: flex;
        align-items: center;
        justify-content: center; 
        width: 75px;
        height: 75px;
        padding: 0.75rem 1rem;
        border: 0;
        margin: 0;        
        border-radius: 50%;
        text-align: center;
        cursor: pointer;
        background-color: #1095c1;
        color: #f0f0f0;
        word-break: break-all;
        overflow: hidden;
        transition: background-color, opacity 0.15s ease;
    }

    button:hover {
        background-color: #07aee5;
    }

    button:active {
        transform: scale(0.95);
    }

    button[disabled] {
        opacity: 0.5;
        pointer-events: none;
    }

    button.active {
        background-color: #4CAF50;
        font-weight: bold;
    }
</style>
```

**Result**

![paginator-screenshot-3]

<p align="right">(<a href="https://svelte.dev/repl/e571a22de5804b8299e5c5ec28b6fd8c?version=3.59.1" target="_blank">Try it on Svelte REPL</a>)</p>

<!-- LICENSE -->
## License
Distributed under the MIT License. See [LICENSE.md][license-url] for more information.


<!-- MARKDOWN LINKS & IMAGES -->
[license-shield]: https://img.shields.io/github/license/francescodessi/svelte-page-navigation?&style=for-the-badge
[license-url]: https://github.com/francescodessi/svelte-page-navigation/blob/main/LICENSE.md
[npm-version-shield]: https://img.shields.io/npm/v/@dflare/svelte-page-navigation?logo=npm&style=for-the-badge
[npm-url]: https://www.npmjs.com/package/@dflare/svelte-page-navigation
[github-release-shield]: https://img.shields.io/github/v/release/francescodessi/svelte-page-navigation?logo=github&style=for-the-badge
[github-release-url]: https://github.com/francescodessi/svelte-page-navigation/releases/latest
[svelte-shield]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte
[Svelte-url]: https://svelte.dev/
[svelteKit-shield]: https://img.shields.io/badge/SvelteKit-4A4A55?style=for-the-badge&logo=svelte
[SvelteKit-url]: https://kit.svelte.dev/
[paginator-screenshot-1]: https://github.com/francescodessi/svelte-page-navigation/raw/main/static/paginator-screenshot-1.png
[paginator-screenshot-2]: https://github.com/francescodessi/svelte-page-navigation/raw/main/static/paginator-screenshot-2.png
[paginator-screenshot-3]: https://github.com/francescodessi/svelte-page-navigation/raw/main/static/paginator-screenshot-3.png
