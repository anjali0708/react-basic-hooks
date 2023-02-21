import { useReducer, useCallback } from 'react';

const initialState = { isLoading: false, isError: null, data: null, identifier: null, extra: null  }

const httpReducer = (httpState, action) => {
    switch (action.type) {
        case 'SEND':
            return { isLoading: true, isError: null, data: null, extra: null, identifier: action.identifier }
        case 'RESPONSE':
            return { ...httpState, isLoading: false, data: action.responseData, extra: action.extra }
        case 'ERROR':
            return { isLoading: false, isError: action.errorData }
        case 'CLEAR':
            return initialState
        default:
            throw new Error('Should not have reached');
    }
}

const useHttp = () => {
    const [httpState, dispatchHttp] = useReducer(httpReducer, initialState);

    const clear = () => { dispatchHttp({ type: 'CLEAR' }) };

    const httpRequest = useCallback((url, type, body, reqExtra, identifier) => {
        dispatchHttp({ type: 'SEND', extra: reqExtra, identifier: identifier })
        fetch(url, {
            method: type,
            body: body,
            headers: {
                "Content-Type": 'application/json'
            }
        }).then(response => {
            return response.json();
        }).then(responseData => {
            dispatchHttp({ type: 'RESPONSE', responseData: responseData, extra: reqExtra })
        }).catch(error => {
            dispatchHttp({ type: 'ERROR', errorData: 'Something went wrong' })
        })
    }, [])

    return {
        isLoading: httpState.isLoading,
        data: httpState.data,
        isError: httpState.isError,
        sendRequest: httpRequest,
        reqExtra: httpState.extra,
        ingredient: httpState.ingredient,
        identifier: httpState.identifier,
        clear: clear
    }
}

export default useHttp;