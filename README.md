# Accessible Synonym search with React  
A lightweight acccessible synonym search built as part of a React challenge. People can discover synonyms in real-time - if they exist - from the [Datamuse API](https://www.datamuse.com/api/).


## Demonstration with NVDA and Firefox

Searching for synonyms of 

[![YouTube thumbnail screenshot](https://img.youtube.com/vi/1bRtL3InpPw/0.jpg)](https://www.youtube.com/watch?v=1bRtL3InpPw)


Error handling

[![YouTube thumbnail screenshot](https://img.youtube.com/vi/u3oabSpadAc/0.jpg)](https://www.youtube.com/watch?v=u3oabSpadAc)


## Datamuse API

The app queries the Datamuse API's synonym endpoint, for example searching for "react" synonyms:

```
https://api.datamuse.com/words?rel_syn=react
```

Response format:
```json
[
  {
    "word": "oppose",
    "score": 18036
  },
  {
    "word": "respond",
    "score": 14043
  }
]
```

## Accessibility

- **Landmarks**: `<search>` to expose a "Search" landmark to screen readers.  
- **Focus management**: Focus automatically moves to search results after they load, helping screen reader users discover the new content.  
- **Semantic list**: Results use `<ul>` and `<li>` elements that can be navigated individually by screen reader commands - `i` and `SHIFT + i`. 
- **Error handling**: `aria-invalid` and `aria-describedy` for input validation. `role="alert"` for API errors e.g. HTTP 429.

## Getting Started

1. Clone the repository
2. Run `npm install`
3. Run `npm run dev`

## Tech Stack

- React 19  
- TypeScript  
- Vite  

## Screen Reader Testing

**OS**: Windows 10 Pro
**Screen readers**: NVDA, Windows Narrator  
**Browsers**: Firefox, Chrome and Edge  