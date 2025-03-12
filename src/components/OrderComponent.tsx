import { Avatar, Button, Card, CardContent, CardHeader, InputLabel, Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { paginationModel } from "../shared/Shared";
import order, { orderStatus, paymentMethod } from "../types/order";
import orderService from "../services/order.service";
import getAllOrders from "../types/getAllOrders";
import { useState, useEffect } from "react";
import user from "../types/user";
import eventBus from "../common/eventBus";


const OrderComponent = (props: { user?: user, isAdmin: boolean }) => {
    const [orders, setOrders] = useState<Array<order>>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalCount, setTtotalCount] = useState(0);

    const updateOrderStatus = (order: order) => {
        if (order.orderStatus != orderStatus.delivered) {
            order.orderStatus = order.orderStatus + 1;
            orderService.updateOrder(order).then(() => {
                if (props.user) {
                    props.user.shoppingCart = {};
                    eventBus.dispatch("updateUser", props.user);
                    eventBus.dispatch("AddtoCart", props.user.shoppingCart?.products?.length);
                }
            })
        }
    }

    const columns: GridColDef<order>[] = [
        { field: 'shippingAddress', filterable: false, headerName: 'Shipping Address', width: 130 },
        {
            field: 'paymentMethod', filterable: false, headerName: 'Payment Method', width: 130, renderCell: (param) => (
                <InputLabel>{paymentMethod[param.value]} </InputLabel>
            )
        },
        {
            field: 'orderStatus',
            headerName: 'Order Status',
            width: 130,
            filterable: false,
            renderCell: (param) => (
                <InputLabel>{orderStatus[param.value]} </InputLabel>
            )
        },
        {
            field: "id",
            width: 300,
            filterable: false,
            headerName: "Actions",
            renderCell: (param) => (
                < div >
                    {props.isAdmin && < Button sx={{ paddingY: 1, paddingX: 1 }} color="success" disabled={param.row.orderStatus == orderStatus.delivered} onClick={() => updateOrderStatus(param.row)} >Update status</Button>}
                </div >

            )

        }
    ];
    const userId = props.user?.id;


    useEffect(() => {
        if (props.user) {
            const filter: getAllOrders = props.isAdmin ? {} : { userId: userId };
            getOrders(filter);
        }
    }, [props.user]);

    const getOrders = (filter: getAllOrders) => {
        orderService.getOrders(filter).then(
            (response) => {
                setOrders(response.orders);
                setTtotalCount(response.totalCount)
            },
            (error) => {
                const _content =
                    (error.response && error.response.data) ||
                    error.message ||
                    error.toString();
            }
        );
    }
    return (
        <Card>
            <CardHeader title="Orders">
            </CardHeader>
            <CardContent>
                <Paper sx={{ height: 400 }}>
                    <DataGrid
                        initialState={{
                            pagination: { paginationModel: paginationModel }
                        }}
                        rows={orders}
                        columns={columns}
                        rowCount={totalCount}
                        disableColumnSorting
                        paginationMode="server"
                        sx={{ border: 0 }}
                        onPaginationModelChange={(model, details) => {
                            getOrders({
                                firstDocumentId: orders[0].id,
                                userId: props.isAdmin ? undefined : props.user?.id,
                                pageNumber: model.page
                            });
                        }}
                    />
                </Paper>
            </CardContent>
        </Card>
    );
}

export default OrderComponent;