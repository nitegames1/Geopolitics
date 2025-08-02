import { readFileSync } from 'fs';

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const indexHtml = readFileSync('index.html', 'utf8');
assert(indexHtml.includes('AI Lore Generator'), 'Index page missing link to lore generator');

const loreHtml = readFileSync('lore.html', 'utf8');
assert(/lore-[\w]+\.js/.test(loreHtml), 'Lore page missing script tag');
assert(!loreHtml.includes("Enter your OpenAI API key"), 'Lore page should not prompt for API key');

const match = loreHtml.match(/assets\/(lore-[\w]+\.js)/);
assert(match, 'Could not locate lore script reference');
const loreJs = readFileSync(`assets/${match[1]}`, 'utf8');
assert(loreJs.includes('OPENAI_API_KEY'), 'Lore script does not reference API key');

console.log('All tests passed.');
