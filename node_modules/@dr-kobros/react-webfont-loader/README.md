# Webfonts loader for React

## What?

A React wrapper for Typekit's [webfontloader](https://www.npmjs.com/package/webfontloader) NPM package.

## Why?

To load your webfonts more intelligently, avoid FOUT with them, and / or to ensure that they have REALLY loaded before doing something (use them in canvas etc).

## How?

```javascript

import { render } from 'react-dom';
import WebfontLoader from '@dr-kobros/react-webfont-loader';

// webfontloader configuration object. *REQUIRED*.
const config = {
  google: {
    families: ['Source Sans Pro:300,600'],
  }
};

// Callback receives the status of the general webfont loading process. *OPTIONAL*
const callback = status => {
  // I could hook the webfont status to for example Redux here.
};

// wrap your root component with the supplied wrapper component.
render(
  <WebfontLoader config={config} onStatus={callback}>
    <App />
  </WebfontLoader>,
  document.getElementById('app')
);

```
