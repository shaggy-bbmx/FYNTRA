import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import './Search.css'
import MetaData from '../layout/MetaData'

const Search = () => {

    const [keyword, setKeyword] = useState("")
    const history = useHistory()

    const searchSubmitHandler = (e) => {
        e.preventDefault()
        if (keyword.trim()) {
            history.push(`/products/${keyword}`)
        } else {
            history.push(`/products`)
        }
    }

    return (
        <>
            <MetaData title='Search a Product' />
            <form className='searchBox' onSubmit={searchSubmitHandler}>
                <input type='text' placeholder='Search a Product'
                    onChange={(e) => setKeyword(e.target.value)}
                >

                </input>
                <input type='submit' value='Search'></input>
            </form>
        </>
    )
}

export default Search
