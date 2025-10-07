import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  styled,
  tableCellClasses,
  CircularProgress,
  Backdrop,
  AlertColor,
  Chip,
} from "@mui/material";
import { useProduct } from "../../hooks/useProduct";
import Toaster from "../../../toaster/toaster";
import Header from "../../../header/header";
import AddProductModal, {
  UpdateProduct,
} from "../../../modal/add-product-modal";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useDeleteProduct } from "../../hooks/useDeleteProduct";
import { Image } from "@chakra-ui/react";
import { ROLES, ROWS_PER_PAGE } from "../../../../shared/constants";
import { ProductProps } from "../../../../shared/models/product";

interface ProductParams {
  role?: string;
}
const Product: React.FC = ({ role }: ProductParams) => {
  const { products, isLoading, error, refetch } = useProduct();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isAlert, setIsAlert] = useState(false);
  const [severity, setSeverity] = useState<AlertColor>("info");
  const [autoHideDuration, setAutoHideDuration] = useState(3000);
  const [alertMessage, setAlertMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [productId, setProductId] = useState("");
  const [productToUpdate, setProductToUpdate] = useState<UpdateProduct>({});

  const {
    error: deleteError,
    isLoading: deleteLoading,
    deleteProduct,
  } = useDeleteProduct();
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#3559E0",
      color: theme.palette.common.white,
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
    if (error) {
      setIsAlert(true);
      setSeverity("error");
      setAutoHideDuration(4000);
      setAlertMessage(error.message);
    }
  }, []);

  const handleClose = () => {
    setIsAlert(false);
  };

  const handleModalClose = () => {
    setProductId(""); // Reset productId
    setProductToUpdate({}); // Reset productToUpdate
    setOpen(false);
  };

  const handleDelete = async (productId: string) => {
    try {
      await deleteProduct(productId);
      refetch();
      setIsAlert(true);
      setSeverity("success");
      setAutoHideDuration(4000);
      setAlertMessage("Product deleted successfully");
    } catch (error) {
      setIsAlert(true);
      setSeverity("error");
      setAutoHideDuration(4000);
      setAlertMessage(deleteError?.message || "");
    }
  };

  return (
    <>
      {(isLoading || deleteLoading) && (
        <StyledBackdrop open={isLoading}>
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
      <Header
        title={role === ROLES.ADMIN ? "Manage Products" : "View Products"}
        buttonText={role === ROLES.ADMIN ? "Add Product" : ""}
        onButtonClick={() => setOpen(!open)}
        isDisabled={!(role === ROLES.ADMIN)}
      />
      <AddProductModal
        open={open}
        onClose={handleModalClose}
        productIdToUpdate={productId}
        productToUpdateFields={productToUpdate}
      />
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell sx={{ fontSize: 18 }}>
                  Product ID
                </StyledTableCell>
                <StyledTableCell sx={{ fontSize: 18 }}>
                  Product Image
                </StyledTableCell>
                <StyledTableCell sx={{ fontSize: 18 }}>Name</StyledTableCell>
                <StyledTableCell sx={{ fontSize: 18 }}>
                  Description
                </StyledTableCell>
                <StyledTableCell sx={{ fontSize: 18 }}>Price</StyledTableCell>
                <StyledTableCell sx={{ fontSize: 18 }}>Type</StyledTableCell>
                <StyledTableCell sx={{ fontSize: 18 }}>
                  Availability
                </StyledTableCell>
                <StyledTableCell sx={{ fontSize: 18 }}>Status</StyledTableCell>
                {role === ROLES.ADMIN && (
                  <StyledTableCell sx={{ fontSize: 18 }}>
                    Actions
                  </StyledTableCell>
                )}
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? // eslint-disable-next-line no-unsafe-optional-chaining
                  products?.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : products
              )?.map((product: ProductProps) => (
                <TableRow key={product?.productId}>
                  <TableCell>{product?.productId}</TableCell>
                  <TableCell>
                    <Image src={product?.productPic} width="60%" height="50%" />
                  </TableCell>
                  <TableCell>{product?.productName}</TableCell>
                  <TableCell>{product?.productDescription}</TableCell>
                  <TableCell>{product?.productPrice}</TableCell>
                  <TableCell>{product?.category?.categoryTitle}</TableCell>
                  <TableCell>
                    {product?.productAvailability?.toString() === "true"
                      ? "Yes"
                      : "No"}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={
                        product?.status.toLowerCase() === "true"
                          ? "Active"
                          : "Inactive"
                      }
                      size="medium"
                      color={
                        product?.status.toLowerCase() === "true"
                          ? "success"
                          : "error"
                      }
                    />
                  </TableCell>
                  {role === ROLES.ADMIN && (
                    <TableCell>
                      <DeleteIcon
                        style={{ marginRight: 8, cursor: "pointer" }}
                        onClick={() =>
                          handleDelete(
                            product?.productId?.toString()
                          )
                        }
                      />
                      <EditIcon
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setOpen(!open);
                          setProductToUpdate(product);
                          setProductId(product?.productId?.toString());
                        }}
                      />
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
          component="div"
          count={products?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={ROWS_PER_PAGE}
        />
      </Paper>
    </>
  );
};

export default Product;
