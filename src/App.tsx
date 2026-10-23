import { useState, useRef, useEffect } from 'react';
import './App.css';

type Synonym = {
  word: string;
  score: number;
};

function App() {
  const [searchWord, setSearchWord] = useState("");
  const [synonyms, setSynonyms] = useState<Synonym[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [requestError, setRequestError] = useState("");
  const [inputError, setInputError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLUListElement>(null);
  const noResultsRef = useRef<HTMLParagraphElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const findSynonyms = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedWord = searchWord.trim();

    if (!trimmedWord) {
      setInputError("You must enter a search word first.");
      inputRef.current?.focus();
      return;
    }
    setInputError("");

    setHasLoaded(false);

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const params = new URLSearchParams({ rel_syn: trimmedWord });

    fetch(`https://api.datamuse.com/words?${params}`, { signal: controller.signal })
      .then(response => {
        if (!response.ok) {
          throw new Error(response.status === 429 ? "rate-limited" : "request-failed");
        }
        return response.json();
      })
      .then(data => {
        setSynonyms(data);
        setHasLoaded(true);
      })
      .catch(error => {
        if (error.name === "AbortError") return;
        setRequestError(
          error.message === "rate-limited"
            ? "Too many searches — wait a moment and try again."
            : "Search failed — please try again."
        );
        setSynonyms([]);
        setHasLoaded(true);
      });
  };

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (hasLoaded) {
      if (synonyms.length > 0) {
        resultsRef.current?.focus();
      } else {
        noResultsRef.current?.focus();
      }
    }
  }, [hasLoaded, synonyms.length]);

  return (
    <>
      <search aria-label="Synonym search">
        <form onSubmit={findSynonyms} className="search-form" noValidate>
          <label htmlFor="search-field">Enter your word, then press ENTER or click "Find synonyms".</label>
          {/* 
            With Firefox and NVDA, required and aria-invalid=false on the <input> will cause 
            NVDA to announce "invalid entry" upon setting focus on the input i.e. when nothing 
            has been entered or attempted.
          */}
          <input
            id="search-field"
            ref={inputRef}
            name="search-field"
            type="search"
            aria-required="true"
            aria-describedby={inputError ? "search-error" : undefined}
            aria-invalid={inputError ? true : undefined}
            value={searchWord} onChange={(e) => {
              abortRef.current?.abort();
              setRequestError("");
              setSearchWord(e.target.value);
              setInputError("");
              setSynonyms([]);
              setHasLoaded(false);
            }}
          />
          <button type="submit">Find synonyms</button>
          <div id="search-error" hidden={!inputError}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <path d="M12 16H12.01M12 8V12M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
              </g>
            </svg>
            {inputError}
          </div>
        </form>
        <section
          className="results"
          style={{ visibility: hasLoaded ? 'visible' : 'hidden' }}
          aria-labelledby="results-heading"
        >
          <h2 id="results-heading">
            Synonyms for "{searchWord}"
          </h2>
          {synonyms.length > 0 ? (
            <>
              <p id="results-count" className="results-count">
                There {synonyms.length === 1 ? 'is' : 'are'} {synonyms.length} {synonyms.length === 1 ? 'synonym' : 'synonyms'}.
              </p>
              <ul
                className="result-list"
                /* list-style:none added it back in some screenreader/browser (Safari) won't announce it as a list otherwise */
                role="list"
                aria-labelledby="results-heading results-count"
                ref={resultsRef}
                tabIndex={-1}
              >
                {synonyms.map((s) => (
                  <li key={s.word} className="result-word">{s.word}</li>
                ))}
              </ul>
            </>
          ) : requestError ? (
            <p className="results-count" role="alert">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <path d="M12 16H12.01M12 8V12M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                </g>
              </svg>
              {requestError}
            </p>
          ) : (
            <p id="results-count" className="results-count" ref={noResultsRef} tabIndex={-1}>
              No synonyms found for "{searchWord}".
            </p>
          )}
        </section>
      </search>
    </>
  )
}

export default App;