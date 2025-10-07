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
} from "@mui/material";
import Toaster from "../../../toaster/toaster";
import Header from "../../../header/header";
import { useBill } from "../../hooks/useBill";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import TableModal from "../../../modal/table-modal";
import { useBillDelete } from "../../hooks/useBillDelete";
import { useBillDownload } from "../../hooks/useBillDownload";
import { ROWS_PER_PAGE } from "../../../../shared/constants";

export interface Bill {
  billId: number;
  billUUID: string;
  customerName: string;
  customerEmail: string;
  contactNumber: string;
  paymentMethod: string;
  totalAmount: string;
  productDetails: string;
  isGenerated: string;
}

const Bill: React.FC = () => {
  const { bills, isLoading, error, refetch } = useBill();
  const {
    downloadBill,
    isLoading: downloadLoading,
    error: downloadError,
  } = useBillDownload();
  const {
    deleteBill,
    error: deleteError,
    isLoading: deleteLoading,
  } = useBillDelete();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isAlert, setIsAlert] = useState(false);
  const [severity, setSeverity] = useState<AlertColor>("info");
  const [autoHideDuration, setAutoHideDuration] = useState(3000);
  const [alertMessage, setAlertMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState([]);

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
  }, [error]);

  const handleClose = () => {
    setIsAlert(false);
  };

  const handleModal = (id: string) => {
    const filteredBill = bills?.find((bill: Bill) => bill?.billUUID === id);
    const data = JSON.parse(filteredBill?.productDetails);
    setDetails(data);
    setOpen(!open);
  };

  const handleDelete = async (billId: string) => {
    try {
      // Delete the bill
      await deleteBill(billId);

      // Refetch bills to get the updated data
      refetch();

      setIsAlert(true);
      setSeverity("success");
      setAutoHideDuration(4000);
      setAlertMessage("Bill deleted successfully");
    } catch (error) {
      setIsAlert(true);
      setSeverity("warning");
      setAutoHideDuration(4000);
      setAlertMessage(deleteError?.message || "");
    }
  };

  const handleDownload = async (bill: Bill) => {
    try {
      // Download the bill
      bill['isGenerated']='';
      bill['billUUID'] = '';
      await downloadBill(bill);
      setIsAlert(true);
      setSeverity("success");
      setAutoHideDuration(4000);
      setAlertMessage("Bill downloaded successfully");
    } catch (error) {
      setIsAlert(true);
      setSeverity("warning");
      setAutoHideDuration(4000);
      setAlertMessage(downloadError?.message || "");
    }
  };

  useEffect(() => {
    if(isAlert){
      setTimeout(()=>{
        setIsAlert(false)
      },autoHideDuration)
    }
  },[isAlert, autoHideDuration, setIsAlert])

  return (
    <>
      {(isLoading || downloadLoading || deleteLoading) && (
        <StyledBackdrop open={isLoading || downloadLoading || deleteLoading}>
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
      {open && (
        <TableModal
          open={open}
          productDetails={details}
          isLoading={isLoading}
          onClose={() => setOpen(!open)}
        />
      )}
      <Header title="View bills" />
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell sx={{ fontSize: 18 }}>Bill ID</StyledTableCell>
                <StyledTableCell sx={{ fontSize: 18 }}>
                  Customer Name
                </StyledTableCell>
                <StyledTableCell sx={{ fontSize: 18 }}>
                  Customer Email
                </StyledTableCell>
                <StyledTableCell sx={{ fontSize: 18 }}>
                  Contact Number
                </StyledTableCell>
                <StyledTableCell sx={{ fontSize: 18 }}>
                  Total Amount
                </StyledTableCell>
                <StyledTableCell sx={{ fontSize: 18 }}>
                  Payment Method
                </StyledTableCell>
                <StyledTableCell sx={{ fontSize: 18 }}>Actions</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? bills?.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : bills
              )?.map((bill: Bill) => (
                <TableRow key={bill?.billId}>
                  <TableCell>{bill?.billUUID}</TableCell>
                  <TableCell>{bill?.customerName}</TableCell>
                  <TableCell>{bill?.customerEmail}</TableCell>
                  <TableCell>{bill?.contactNumber}</TableCell>
                  <TableCell>{bill?.totalAmount}</TableCell>
                  <TableCell>{bill?.paymentMethod}</TableCell>
                  <TableCell>
                    <VisibilityIcon
                      style={{ marginRight: 3 }}
                      sx={{cursor:'pointer'}}
                      onClick={() => handleModal(bill?.billUUID)}
                    />
                    <DownloadIcon
                      style={{ marginRight: 3 }}
                      sx={{cursor:'pointer'}}
                      onClick={() => handleDownload(bill)}
                    />
                    <DeleteIcon
                      sx={{cursor:'pointer'}}
                      onClick={() => handleDelete(bill?.billId?.toString())}
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
          count={bills?.length}
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

export default Bill;
