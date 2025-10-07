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
import { useCategory } from "../../hooks/useCategory";
import Toaster from "../../../toaster/toaster";
import Header from "../../../header/header";
import AddCategoryModal, {
  UpdateCategory,
} from "../../../modal/add-category-modal";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useDeleteCategory } from "../../hooks/useDeleteCategory";
import {
  ROLES,
  ROWS_PER_PAGE,
  TABLE_HEADER_COLOR,
} from "../../../../shared/constants";
import { Category } from "../../../../shared/models/category";
interface CategoryProps {
  role?: string;
}

const Category: React.FC = ({ role }: CategoryProps) => {
  const { categories, isLoading, error, refetch } = useCategory();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isAlert, setIsAlert] = useState(false);
  const [severity, setSeverity] = useState<AlertColor>("info");
  const [autoHideDuration, setAutoHideDuration] = useState(3000);
  const [alertMessage, setAlertMessage] = useState("");
  const [open, setOpen] = useState(false);
  const {
    deleteCategory,
    isLoading: deleteLoading,
    error: deleteError,
  } = useDeleteCategory();
  const [categoryId, setCategoryId] = useState("");
  const [categoryToUpdate, setCategoryToUpdate] = useState<UpdateCategory>(
    {} as UpdateCategory
  );
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: TABLE_HEADER_COLOR,
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
    setOpen(false);
  };

  const handleDelete = async (categoryId: string) => {
    try {
      // Delete the bill
      await deleteCategory(categoryId);

      refetch();
      setIsAlert(true);
      setSeverity("success");
      setAutoHideDuration(4000);
      setAlertMessage("Category deleted successfully");
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
        <StyledBackdrop open={isLoading || deleteLoading}>
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
        title={role === ROLES.ADMIN ? "Manage Categories" : "View Categories"}
        buttonText={role === ROLES.ADMIN ? "Add Category" : ""}
        onButtonClick={() => {
          setOpen(!open);
          setCategoryId("");
          setCategoryToUpdate({} as UpdateCategory);
        }}
        isDisabled={!(role === ROLES.ADMIN)}
      />
      <AddCategoryModal
        open={open}
        onClose={handleModalClose}
        setOpen={setOpen}
        categoryIdToUpdate={categoryId}
        categoryToUpdateFields={categoryToUpdate}
      />
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell sx={{ fontSize: 18 }}>
                  Category ID
                </StyledTableCell>
                <StyledTableCell sx={{ fontSize: 18 }}>Title</StyledTableCell>
                <StyledTableCell sx={{ fontSize: 18 }}>
                  Description
                </StyledTableCell>
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
                  categories?.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : categories
              )?.map((category: Category) => (
                <TableRow key={category?.categoryId}>
                  <TableCell>{category?.categoryId}</TableCell>
                  <TableCell>{category?.categoryTitle}</TableCell>
                  <TableCell>{category?.categoryDescription}</TableCell>
                  {role === ROLES.ADMIN && (
                    <TableCell>
                      <DeleteIcon
                        style={{ marginRight: 8 }}
                        sx={{ cursor: "pointer" }}
                        onClick={() =>
                          handleDelete(category?.categoryId?.toString())
                        }
                      />
                      <EditIcon
                        sx={{ cursor: "pointer" }}
                        onClick={() => {
                          setOpen(!open);
                          setCategoryToUpdate(category);
                          setCategoryId(category?.categoryId?.toString());
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
          count={categories?.length}
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

export default Category;
