import React from 'react'
import './ProductList.css'
import { useDispatch, useSelector, } from 'react-redux'
import { useEffect } from 'react'
import { deleteProduct, getAdminProduct } from '../../actions/productAction'
import { useAlert } from 'react-alert'
import { DataGrid } from "@material-ui/data-grid"
import MetaData from "../layout/MetaData"
import Sidebar from './Sidebar.js'
import { Link } from 'react-router-dom'
import { Button } from '@material-ui/core'
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete"
import { DELETE_PRODUCT_RESET } from '../../constants/productConstants'









const ProductList = () => {

    //...DISPATCH AND FETCHING NEEDED STATES FROM STORE
    const dispatch = useDispatch()
    const alert = useAlert()
    const { error, products } = useSelector(state => state.getAdminProduct)
    const { error: deleteError, success, deletedProduct } = useSelector(state => state.deleteProduct)

    //DELETE PRODUCT HANDLER
    const deleteProductHandler = (id) => {
        dispatch(deleteProduct(id))
    }



    useEffect(() => {
        if (error) alert.error(error)


        if (deleteError) alert.error(deleteError)

        if (success) {
            dispatch({ type: DELETE_PRODUCT_RESET })
            alert.success(`${deletedProduct.name} deleted succesfully!!!`)
        }

        dispatch(getAdminProduct())
    }, [dispatch, error, alert, deleteError, success, deletedProduct.name])


    //DESIGNING COLOUMNS FOR DATAGRID TABLE
    const columns = [
        { field: "id", headerName: "Product ID", minWidth: 200, flex: 0.5 },

        {
            field: "name",
            headerName: "Name",
            minWidth: 350,
            flex: 1,
        },
        {
            field: "stock",
            headerName: "Stock",
            type: "number",
            minWidth: 150,
            flex: 0.3,
        },

        {
            field: "price",
            headerName: "Price",
            type: "number",
            minWidth: 270,
            flex: 0.5,
        },

        {
            field: "actions",
            flex: 0.3,
            headerName: "Actions",
            minWidth: 150,
            type: "number",
            sortable: false,
            renderCell: (params) => {
                return (
                    <>
                        <Link to={`/admin/product/${params.getValue(params.id, "id")}`}><EditIcon /></Link>

                        <Button
                            onClick={() => { }}
                        >
                            <DeleteIcon onClick={() => { deleteProductHandler(params.getValue(params.id, "id")) }} />
                        </Button>
                    </>
                )
            }
        }
    ]

    //DESIGNING ROWS FOR DATA GRID TABLE
    const rows = []

    products && products.forEach(product => {
        rows.push({
            id: product._id,
            stock: product.Stock,
            price: product.price,
            name: product.name
        })
    })

    return (
        <>
            <MetaData title={`ALL PRODUCTS - Admin`} />

            <div className="dashboard">
                <Sidebar />
                <div className="productListContainer">
                    <h1 id="productListHeading">ALL PRODUCTS</h1>

                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        disableSelectionOnClick
                        className="productListTable"
                        autoHeight
                    />
                </div>
            </div>
        </>
    )
}

export default ProductList
