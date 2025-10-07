import React, { useEffect, useState } from "react";
import {
  AlertColor,
  Backdrop,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Paper,
  Table,
  TableContainer,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  styled,
  tableCellClasses,
  TablePagination,
  TableBody,
  CircularProgress,
} from "@mui/material";
import { useForm, SubmitHandler, UseFormRegister } from "react-hook-form";
import Header from "../../../header/header";
import PrintIcon from "@mui/icons-material/Print";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { ROWS_PER_PAGE, paymentMethods } from "../../../../shared/constants";
import { useProduct } from "../../hooks/useProduct";
import { useCategory } from "../../hooks/useCategory";
import { ProductProps } from "../product/product";
import { Category } from "../category/category";
import { DropDown, TableProduct } from "../../../../shared/models/order";
import { Order } from "../../../../shared/models/order";
import DeleteIcon from "@mui/icons-material/Delete";
import Toaster from "../../../toaster/toaster";
import { useBillDownload } from "../../hooks/useBillDownload";
import Bill from "../bill/bill";

const Order = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isAlert, setIsAlert] = useState(false);
  const [severity, setSeverity] = useState<AlertColor>("info");
  const [autoHideDuration, setAutoHideDuration] = useState(3000);
  const [alertMessage, setAlertMessage] = useState("");
  const [product, setProduct] = useState<DropDown[]>([]);
  const [category, setCategory] = useState<DropDown[]>([]);
  const [amount, setAmount] = useState("");
  const [addedProducts, setAddedProducts] = useState<TableProduct[]>([]);
  const {
    handleSubmit: handleSubmitCustomerDetails,
    register: registerCustomerDetails,
    watch: watchCustomerDetails,
    setValue: setValueCustomerDetails,
    formState: { errors: errorsCustomerDetails },
    reset: resetCustomerDetails,
  } = useForm<Order>({
    defaultValues: {
      customerName: "",
      customerEmail: "",
      contactNumber: "",
      paymentMethod: "",
      productDetails: "",
      isGenerated: "",
    },
  });

  const {
    handleSubmit: handleSubmitProductDetails,
    register: registerProductDetails,
    watch: watchProductDetails,
    setValue: setValueProductDetails,
    reset: resetProductDetails,
    formState: { errors: errorsProductDetails },
    getValues,
  } = useForm<Order>({
    defaultValues: {
      categoryName: "",
      productName: "",
      productPrice: "",
      productQuantity: "",
      totalAmount: "",
    },
  });

  const { products, isLoading: isProductLoading } = useProduct();
  const { categories, isLoading: isCategoryLoading } = useCategory();

  const {
    error: billError,
    downloadBill,
    isLoading: billLoading,
  } = useBillDownload();
  const StyledBackdrop = styled(Backdrop)(() => ({
    backdropFilter: "blur(3px)",
    backgroundColor: "rgba(0, 0, 30, 0.4)",
  }));

  const useStyles = {
    circularProgress: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    },
  };

  const handleClose = () => {
    setIsAlert(false);
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#F3F3F3",
      color: theme.palette.common.black,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  const handleAddProduct = () => {
    const productToBeAdd: TableProduct = {
      id: addedProducts.length + 1,
      name: products.find(
        (item: ProductProps) =>
          item.productId.toString() === getValues("productName")
      ).productName,
      category: categories.find(
        (item: Category) =>
          item.categoryId.toString() === getValues("categoryName")
      ).categoryTitle,
      quantity: getValues("productQuantity"),
      price: Number(getValues("productPrice")),
      total: Number(getValues("totalAmount")),
    };
    setAddedProducts([...addedProducts, productToBeAdd]);
    resetProductDetails();
  };

  const onSubmitCustomerDetails: SubmitHandler<Order> = async (formData) => {
    try {
      // Download the bill
      console.log(addedProducts);
      const payload = {
        ...formData,
        fileName: `BILL-${new Date().toISOString()}`,
        isGenerated: "true",
        totalAmount: amount,
      } as Bill;
      payload["productDetails"] = JSON.stringify(addedProducts);

      await downloadBill(payload);
      setIsAlert(true);
      setSeverity("success");
      setAutoHideDuration(4000);
      setAlertMessage("Bill downloaded successfully");
    } catch (error) {
      setIsAlert(true);
      setSeverity("warning");
      setAutoHideDuration(4000);
      setAlertMessage(billError?.message || "");
    }
    resetProductDetails();
    resetCustomerDetails();
    setAddedProducts([]);
    setAmount("0");
  };

  const handleProductValues = (productFormValue?: string) => {
    if (productFormValue) {
      const foundProduct: ProductProps = products.find(
        (item: ProductProps) => item.productId.toString() === productFormValue
      );
      console.log(foundProduct);
      setValueProductDetails("productPrice", foundProduct.productPrice);
    }
  };

  const handleCascading = (categoryFormValue?: string) => {
    if (categoryFormValue) {
      const foundCategory = categories.find(
        (item: Category) => item.categoryId.toString() === categoryFormValue
      );
      const filteredProduct = products.filter(
        (items: ProductProps) =>
          items.category.categoryId === foundCategory?.categoryId
      );
      const result = filteredProduct?.map((product: ProductProps) => {
        return {
          label: product.productName,
          value: product.productId,
          id: product.category?.categoryId,
        };
      });
      setProduct(result);
    }
  };

  const handleDelete = (id: string) => {
    const updatedProducts = addedProducts.filter(
      (product: TableProduct) => product.id.toString() !== id
    );
    setAddedProducts(updatedProducts);
  };

  useEffect(() => {
    const productResponse = products?.map((product: ProductProps) => {
      return {
        label: product.productName,
        value: product.productId,
        id: product.category?.categoryId,
      };
    });
    const categoryResponse = categories?.map((category: Category) => {
      return {
        label: category.categoryTitle,
        value: category.categoryId,
      };
    });
    setProduct(productResponse);
    setCategory(categoryResponse);
  }, [products, categories]);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const quantity = Number(watchProductDetails("productQuantity"));
    const price = Number(watchProductDetails("productPrice"));

    if (!isNaN(quantity) && !isNaN(price)) {
      const totalAmount = quantity * price;
      setValueProductDetails("totalAmount", totalAmount.toString());
      setAmount((Number(amount) + Number(totalAmount)).toString());
    }
  }, [
    watchProductDetails("productQuantity"),
    watchProductDetails("productPrice"),
  ]);

  useEffect(() => {
    if (isAlert) {
      setTimeout(() => {
        setIsAlert(false);
      }, autoHideDuration);
    }
  }, [isAlert, autoHideDuration, setIsAlert]);

  return (
    <>
      {(isProductLoading || isCategoryLoading) && (
        <StyledBackdrop open={isProductLoading || isCategoryLoading}>
          <CircularProgress sx={useStyles.circularProgress} color="inherit" />
        </StyledBackdrop>
      )}
      {isAlert && alertMessage && (
        <Toaster
          isAlert={isAlert}
          severity={severity}
          autoHideDuration={autoHideDuration}
          handleClose={handleClose}
          alertMessage={alertMessage}
        />
      )}
      <Card
        component="form"
        onSubmit={handleSubmitCustomerDetails(onSubmitCustomerDetails)}
      >
        <Header
          title="Manage Order"
          buttonText="Submit & get bill"
          icon={<PrintIcon />}
          buttonType="submit"
          isDisabled={addedProducts.length === 0 ? true : false}
        />
        <Card sx={{ marginBottom: 4 }}>
          <CardContent>
            <Typography variant="h6" sx={{ marginBottom: 1 }}>
              Customer Details
            </Typography>
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <TextField
                    id="standard-required"
                    label="Name"
                    variant="standard"
                    fullWidth
                    {...registerCustomerDetails("customerName", {
                      required: "Customer name is required.",
                    })}
                    error={!!errorsCustomerDetails.customerName}
                    helperText={errorsCustomerDetails?.customerName?.message}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    id="standard-required"
                    label="Email"
                    variant="standard"
                    fullWidth
                    {...registerCustomerDetails("customerEmail", {
                      required: "Customer email is required.",
                    })}
                    error={!!errorsCustomerDetails.customerEmail}
                    helperText={errorsCustomerDetails?.customerEmail?.message}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    id="standard-required"
                    label="Contact Number"
                    variant="standard"
                    fullWidth
                    {...registerCustomerDetails("contactNumber", {
                      required: "Contact number is required.",
                    })}
                    error={!!errorsCustomerDetails.contactNumber}
                    helperText={errorsCustomerDetails?.contactNumber?.message}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    id="standard-select-currency"
                    select
                    label="Payment Method"
                    variant="standard"
                    fullWidth
                    {...registerCustomerDetails("paymentMethod", {
                      required: "Payment method is required.",
                    })}
                    error={!!errorsCustomerDetails.paymentMethod}
                    helperText={errorsCustomerDetails?.paymentMethod?.message}
                    value={watchCustomerDetails("paymentMethod") || ""}
                    onChange={(e) =>
                      setValueCustomerDetails("paymentMethod", e.target.value)
                    }
                  >
                    {paymentMethods.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Card>

      <Card
        component="form"
        onSubmit={handleSubmitProductDetails(handleAddProduct)}
      >
        <Card sx={{ marginBottom: 4 }}>
          <CardContent>
            <Typography variant="h6" sx={{ marginBottom: 1 }}>
              Select Products
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={3}>
                <TextField
                  id="standard-select-currency"
                  select
                  label="Category"
                  variant="standard"
                  fullWidth
                  {...registerProductDetails("categoryName", {
                    required: "Category is required.",
                  })}
                  error={!!errorsProductDetails.categoryName}
                  helperText={errorsProductDetails?.categoryName?.message}
                  value={watchProductDetails("categoryName") || ""}
                  onChange={(e) => {
                    {
                      setValueProductDetails("categoryName", e.target.value);
                      handleCascading(watchProductDetails("categoryName"));
                    }
                  }}
                >
                  {category?.map((option: DropDown) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={3}>
                <TextField
                  id="standard-select-currency"
                  select
                  label="Product"
                  variant="standard"
                  fullWidth
                  {...registerProductDetails("productName", {
                    required: "Product is required.",
                  })}
                  error={!!errorsProductDetails.productName}
                  helperText={errorsProductDetails?.productName?.message}
                  value={watchProductDetails("productName") || ""}
                  onChange={(e) => {
                    setValueProductDetails("productName", e.target.value);
                    handleProductValues(e.target.value);
                  }}
                >
                  {product?.map((option: DropDown) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={2}>
                <TextField
                  style={{ color: "black" }}
                  id="standard-required"
                  label="Price"
                  variant="standard"
                  fullWidth
                  disabled={true}
                  value={getValues("productPrice")}
                  {...registerProductDetails("productPrice", {
                    required: "Product price is required.",
                  })}
                  error={!!errorsProductDetails.productPrice}
                  helperText={errorsProductDetails?.productPrice?.message}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  id="standard-required"
                  label="Quantity"
                  variant="standard"
                  fullWidth
                  {...registerProductDetails("productQuantity", {
                    required: "Quantity is required.",
                  })}
                  error={!!errorsProductDetails.productQuantity}
                  helperText={errorsProductDetails?.productQuantity?.message}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  id="standard-required"
                  label="Total"
                  variant="standard"
                  disabled={true}
                  value={getValues("totalAmount")}
                  fullWidth
                  {...registerProductDetails("totalAmount", {
                    required: "Total is required.",
                  })}
                  error={!!errorsProductDetails.totalAmount}
                  helperText={errorsProductDetails?.totalAmount?.message}
                />
              </Grid>
            </Grid>
            <Grid
              container
              justifyContent="space-between"
              sx={{ marginTop: 4 }}
            >
              <Button variant="contained" size="large" type="submit">
                Add
              </Button>
              <Button
                variant="contained"
                size="large"
                type="button"
                startIcon={<CurrencyRupeeIcon />}
              >
                {`Total Amount : ${amount}`}
              </Button>
            </Grid>
          </CardContent>
        </Card>
      </Card>
      <Card sx={{ marginBottom: 4 }}>
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell sx={{ fontSize: 18 }}>ID</StyledTableCell>
                  <StyledTableCell sx={{ fontSize: 18 }}>Name</StyledTableCell>
                  <StyledTableCell sx={{ fontSize: 18 }}>
                    Category
                  </StyledTableCell>
                  <StyledTableCell sx={{ fontSize: 18 }}>
                    Quantity
                  </StyledTableCell>
                  <StyledTableCell sx={{ fontSize: 18 }}>Price</StyledTableCell>
                  <StyledTableCell sx={{ fontSize: 18 }}>Total</StyledTableCell>
                  <StyledTableCell sx={{ fontSize: 18 }}>
                    Actions
                  </StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? // eslint-disable-next-line no-unsafe-optional-chaining
                    addedProducts?.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : products
                )?.map((product: TableProduct) => (
                  <TableRow key={product?.id}>
                    <TableCell>{product?.id}</TableCell>
                    <TableCell>{product?.name}</TableCell>
                    <TableCell>{product?.category}</TableCell>
                    <TableCell>{product?.quantity}</TableCell>
                    <TableCell>{product?.price}</TableCell>
                    <TableCell>{product?.total}</TableCell>
                    <TableCell>
                      <DeleteIcon
                        sx={{ cursor: "pointer" }}
                        onClick={() => {
                          handleDelete(product.id.toString());
                          setAmount(
                            (
                              Number(amount) -
                              Number(
                                Number(product?.price) *
                                  Number(product?.quantity)
                              )
                            ).toString()
                          );
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
            component="div"
            count={addedProducts?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage={ROWS_PER_PAGE}
          />
        </Paper>
      </Card>
    </>
  );
};

export default Order;
