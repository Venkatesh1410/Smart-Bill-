import { ModalClose, ModalDialog } from "@mui/joy";
import {
  Backdrop,
  CircularProgress,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  styled,
  tableCellClasses,
} from "@mui/material";
import { useState } from "react";
import { ROWS_PER_PAGE } from "../../shared/constants";

interface Order {
  id: string;
  name: string;
  category: string;
  quantity: string;
  price: string;
  total: string;
}

interface TableModalProps {
  productDetails: Order[];
  open: boolean;
  isLoading: boolean;
  onClose: ()=>void;
}
const TableModal = ({ productDetails, open, isLoading,onClose }: TableModalProps) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#3559E0",
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const useStyles = {
    circularProgress: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    },
  };

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

  return (
    <>
      {isLoading && (
        <StyledBackdrop open={isLoading}>
          <CircularProgress sx={useStyles.circularProgress} color="inherit" />
        </StyledBackdrop>
      )}
      <Modal open={open}>
        <ModalDialog>
        <ModalClose onClick={onClose} />
          <Typography>Order Summary</Typography>
          <Paper>
            <TableContainer>
              <Table>
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell sx={{ fontSize: 18 }}>
                      Bill ID
                    </StyledTableCell>
                    <StyledTableCell sx={{ fontSize: 18 }}>
                      Product Name
                    </StyledTableCell>
                    <StyledTableCell sx={{ fontSize: 18 }}>
                      Category
                    </StyledTableCell>
                    <StyledTableCell sx={{ fontSize: 18 }}>
                      Quantity
                    </StyledTableCell>
                    <StyledTableCell sx={{ fontSize: 18 }}>
                      Price
                    </StyledTableCell>
                    <StyledTableCell sx={{ fontSize: 18 }}>
                      Total
                    </StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? // eslint-disable-next-line no-unsafe-optional-chaining
                      productDetails?.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                    : productDetails
                  )?.map((bill: Order) => (
                    <TableRow key={bill?.id}>
                       <TableCell>{bill?.id}</TableCell>
                      <TableCell>{bill?.name}</TableCell>
                      <TableCell>{bill?.category}</TableCell>
                      <TableCell>{bill?.quantity}</TableCell>
                      <TableCell>{bill?.price}</TableCell>
                      <TableCell>{bill?.total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
              component="div"
              count={productDetails?.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage={ROWS_PER_PAGE}
            />
          </Paper>
        </ModalDialog>
      </Modal>
    </>
  );
};

export default TableModal;
