import React, { useEffect, useState } from "react"
import { DataGrid } from "@material-ui/data-grid"
import "./productReviews.css"
import { useSelector, useDispatch } from "react-redux"
import { clearErrors, getAllReviews, deleteReviews, getAdminProduct } from "../../actions/productAction"
import { useAlert } from "react-alert"
import { Button } from "@material-ui/core"
import MetaData from "../layout/MetaData"
import DeleteIcon from "@material-ui/icons/Delete"
import Star from "@material-ui/icons/Star"
import Sidebar from "./Sidebar"
import { DELETE_REVIEW_RESET } from "../../constants/productConstants"




const ProductReviews = ({ history }) => {


    const dispatch = useDispatch()
    const alert = useAlert()
    const { error: deleteError, success } = useSelector(state => state.deleteReviews)
    const { error, reviews, loading } = useSelector(state => state.getAllReviews)
    const { products } = useSelector(state => state.getAdminProduct)


    const [productId, setProductId] = useState("")

    const deleteReviewHandler = (reviewId) => {
        dispatch(deleteReviews(reviewId, productId))
    }

    const productReviewsSubmitHandler = (e) => {
        e.preventDefault()
        dispatch(getAllReviews(productId))
    }

    useEffect(() => {
        if (productId.length === 24) {
            dispatch(getAllReviews(productId))
        }
        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }

        if (deleteError) {
            alert.error(deleteError)
            dispatch(clearErrors())
        }

        if (success) {
            history.push("/admin/reviews")
            dispatch({ type: DELETE_REVIEW_RESET })
        }

        dispatch(getAdminProduct())
    }, [dispatch, alert, error, deleteError, history, success, productId])

    const columns = [
        { field: "id", headerName: "Review ID", minWidth: 200, flex: 0.5 },

        {
            field: "user",
            headerName: "User",
            minWidth: 200,
            flex: 0.6,
        },

        {
            field: "comment",
            headerName: "Comment",
            minWidth: 350,
            flex: 1,
        },

        {
            field: "rating",
            headerName: "Rating",
            type: "number",
            minWidth: 180,
            flex: 0.4,

            cellClassName: (params) => {
                return params.getValue(params.id, "rating") >= 3
                    ? "greenColor"
                    : "redColor"
            },
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
                        <Button onClick={() => deleteReviewHandler(params.getValue(params.id, "id"))}>
                            <DeleteIcon />
                        </Button>
                    </>
                )
            },
        },
    ]

    const rows = []

    reviews &&
        reviews.forEach((review) => {
            rows.push({
                id: review._id,
                rating: review.rating,
                comment: review.comment,
                user: review.name,
            })
        })

    return (
        <>
            <MetaData title={`ALL REVIEWS - Admin`} />

            <div className="dashboard">
                <Sidebar />
                <div className="productReviewsContainer">
                    <form
                        className="productReviewsForm"
                        onSubmit={productReviewsSubmitHandler}
                    >
                        <h1 className="productReviewsFormHeading">ALL REVIEWS</h1>
                        <div>
                            <Star />
                            <select className="selectMenu" onChange={(e) => setProductId(e.target.value)}>
                                <option value=''>--Select--</option>
                                {products.map((item) =>
                                    <option className="" value={item._id}>{item._id}</option>
                                )}
                            </select>
                        </div>

                        <Button
                            id="createProductBtn"
                            type="submit"
                            disabled={
                                loading ? true : false || productId === "" ? true : false
                            }
                        >
                            Search
                        </Button>
                    </form>

                    {reviews && reviews.length > 0 ?
                        (
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                pageSize={10}
                                disableSelectionOnClick
                                className="productListTable"
                                autoHeight
                            />
                        ) : (
                            <h1 className="productReviewsFormHeading">No Reviews Found</h1>
                        )}
                </div>
            </div>
        </>
    )
}

export default ProductReviews
