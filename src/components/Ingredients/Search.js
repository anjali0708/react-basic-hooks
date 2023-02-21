import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';
import useHttp from '../Hooks/http';
import ErrorModal from '../UI/ErrorModal';

const Search = React.memo(({ onLoadIngredients }) => {
  const [enteredFilter, setEnteredFilter] = useState('');
  const inputRef = useRef();
  const { isLoading, isError, data, clear, sendRequest } = useHttp();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (enteredFilter === inputRef.current.value) {
        sendRequest('http://localhost:5000/ingredients', 'GET');
      }
    }, 500)
    return () => { clearTimeout(timer) }
  }, [enteredFilter, sendRequest])

  useEffect(() => {
    if (!isLoading && !isError && data) {
      const loadedIngredients = [];
      for (const key in data) {
        loadedIngredients.push({
          id: data[key].id,
          title: data[key].title,
          amount: data[key].amount,
        })
      }
      onLoadIngredients(enteredFilter ? loadedIngredients.filter(ing => ing.title === enteredFilter) : loadedIngredients);
    }
  })

  return (
    <section className="search">
      { isError && <ErrorModal onClose={clear}>{ isError }</ErrorModal>}
      <Card>
        <div className="search-input">
          {isLoading && <span>Loading...</span>}
          <label>Filter by Title</label>
          <input ref={inputRef} type="text" value={enteredFilter} onChange={(event) => setEnteredFilter(event.target.value)} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
