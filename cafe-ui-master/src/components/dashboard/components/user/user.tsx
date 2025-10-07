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
import Toaster from "../../../toaster/toaster";
import Header from "../../../header/header";
import { useUsers } from "../../../../hooks/useUsers";
import Switch from "@mui/material/Switch";
import LoginModal from "../../../modal/login-modal";
import { useUpdateUser } from "../../../../hooks/useUpdateUser";
import { ROWS_PER_PAGE } from "../../../../shared/constants";

export interface UserProps {
  userId: number;
  userName: string;
  userEmail: string;
  userPhoneNo: string;
  status: string;
  role: string;
}

const User: React.FC = () => {
  const { users, isLoading, error } = useUsers();
  const [open, setOpen] = useState<boolean>(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isAlert, setIsAlert] = useState(false);
  const [severity, setSeverity] = useState<AlertColor>("info");
  const [autoHideDuration, setAutoHideDuration] = useState(3000);
  const [alertMessage, setAlertMessage] = useState("");
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const { updateUser, isLoading: loading } = useUpdateUser();
  
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

  const handleSwitchChange = async (status: string, userId: string) => {
    // Perform API call when the switch is checked
    try {
      const formData = {
        userEmail: userId,
        status: status,
      };
      const responseData = await updateUser(formData);
      setIsAlert(true);
      setIsAlert(true);
      setSeverity("success");
      setAutoHideDuration(4000);
      setAlertMessage(responseData?.message || "");
    } catch (error) {
      setIsAlert(true);
      setSeverity("warning");
      setAutoHideDuration(4000);
      setAlertMessage(error?.message || "");
    }
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

  return (
    <>
      {(isLoading || loading) && (
        <StyledBackdrop open={isLoading || loading}>
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
        title="Manage users"
        buttonText="Add user"
        onButtonClick={() => {
          setOpen(!open);
        }}
        isDisabled={false}
      />
       <LoginModal open={open} setOpen={setOpen} isLogin={isLogin} modalText="Add User" setIsLogin={setIsLogin}/>
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell sx={{ fontSize: 18 }}>User ID</StyledTableCell>
                <StyledTableCell sx={{ fontSize: 18 }}>Name</StyledTableCell>
                <StyledTableCell sx={{ fontSize: 18 }}>Email</StyledTableCell>
                <StyledTableCell sx={{ fontSize: 18 }}>
                  Contact No
                </StyledTableCell>
                <StyledTableCell sx={{ fontSize: 18 }}>Role</StyledTableCell>
                <StyledTableCell sx={{ fontSize: 18 }}>Status</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? // eslint-disable-next-line no-unsafe-optional-chaining
                  users?.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : users
              )?.map((user: UserProps) => (
                <TableRow key={user?.userId}>
                  <TableCell>{user?.userId}</TableCell>
                  <TableCell>{user?.userName}</TableCell>
                  <TableCell>{user?.userEmail}</TableCell>
                  <TableCell>{user?.userPhoneNo}</TableCell>
                  <TableCell>
                    <Chip
                      label={user?.role}
                      size="small"
                      color={
                        user?.role?.toUpperCase() === "USER"
                          ? "primary"
                          : "success"
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      defaultChecked={
                        user?.status.toLowerCase() === "true" ? true : false
                      }
                      onChange={() =>
                        handleSwitchChange(
                          user?.status.toLowerCase() === "true"
                            ? "false"
                            : "true",
                          user.userEmail
                        )
                      }
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
          count={users?.length}
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

export default User;
