import React from 'react';
import { useCallback, useReducer, useMemo, useEffect } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';
import useHttp from '../Hooks/http';

const ingredientReducer = ( currentIngredients, action ) => {
  switch(action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [ ...currentIngredients, action.ingredient ];
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id );
    default:
      throw new Error('Should not have been there');
  }
}

function Ingredients() {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const { isLoading, data, isError, sendRequest, reqExtra, identifier, clear } = useHttp();

  useEffect(() => {
    if(!isLoading && !isError && identifier === 'DELETE_ID') {
      dispatch({ type: 'DELETE', id: reqExtra })
    } else if(!isLoading && !isError && identifier === 'ADD_ID') {
      dispatch({ type: 'ADD', ingredient: data })
    }
  }, [data, reqExtra, identifier, isError, isLoading])

  const filterIngredientsHandler = useCallback((filteredIngredients) => {
    dispatch({ type: 'SET', ingredients: filteredIngredients })
  }, []);

  const addIngredientHandler = useCallback(ingredient => {
    sendRequest(`http://localhost:5000/ingredients`, 'POST', JSON.stringify(ingredient), ingredient, 'ADD_ID');
  }, [sendRequest]);

  const deleteIngredientHandler = useCallback((id) => {
    sendRequest(`http://localhost:5000/ingredients/${id}`, 'DELETE', null, id, 'DELETE_ID')
  }, [sendRequest]);

  const ingredientList = useMemo(() =>{
    return (
      <IngredientList ingredients={userIngredients} onRemoveItem={deleteIngredientHandler} />
    )
    }, [userIngredients, deleteIngredientHandler])

  return (
    <div className="App">
      { isError && <ErrorModal onClose={clear}>{ isError }</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler} loader={isLoading}/>
      <section>
        <Search onLoadIngredients={filterIngredientsHandler}/>
        { ingredientList }
      </section>
    </div>
  );
}

export default Ingredients
