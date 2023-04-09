import React, { useState } from 'react'

export function useAnotherForm(Model) {

    const [valuess, setValuess] = useState(Model());
    const [errorss, setErrorss] = useState({});

    const handleInputChangee = e => {
        const { name, value } = e.target
        setValuess({
            ...valuess,
            [name]: value
        })
    }

    const resetFormControlss = () => {
        setValuess(Model());
        setErrorss({})
    }

    return {
        valuess,
        setValuess,
        errorss,
        setErrorss,
        handleInputChangee,
        resetFormControlss
    }
}
