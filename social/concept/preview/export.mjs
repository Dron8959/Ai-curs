// Hands the text posts, the thread, the pins and the boards to make_page.py as JSON.
import { posts, thread } from '../text.mjs';
import { pins, boards } from '../pins.mjs';
console.log(JSON.stringify({ text: posts, thread, pins: pins.map(({ html, ...p }) => p), boards }));
