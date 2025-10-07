import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  AlertColor,
  CircularProgress,
} from "@mui/material";
import { useForm } from "react-hook-form";
import {
  AddCategoryFields,
  useAddCategory,
} from "../dashboard/hooks/useAddCategory";
import Toaster from "../toaster/toaster";
import { useUpdateCategory } from "../dashboard/hooks/useUpdateCategory";
import { UpdateCategory } from "../../shared/models/category";



const AddCategoryModal: React.FC<{
  open: boolean;
  onClose: () => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  categoryIdToUpdate?: string;
  categoryToUpdateFields?: UpdateCategory;
}> = ({
  open,
  onClose,
  setOpen,
  categoryIdToUpdate,
  categoryToUpdateFields,
}) => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
    setValue,
  } = useForm<AddCategoryFields | UpdateCategory>({
    defaultValues: {
      categoryTitle: "",
      categoryDescription: "",
    },
  });
  const {
    addCategory,
    isLoading: addLoading,
    error: addError,
  } = useAddCategory();
  const [isAlert, setIsAlert] = useState(false);
  const [severity, setSeverity] = useState<AlertColor>("info");
  const [autoHideDuration, setAutoHideDuration] = useState(3000);
  const [alertMessage, setAlertMessage] = useState("");
  const {
    updateCategory,
    isLoading: updateLoading,
    error: updateError,
  } = useUpdateCategory();

  useEffect(() => {
    // Reset the form when the modal opens or categoryIdToUpdate changes
    if (open || categoryIdToUpdate) {
      reset();
    }
    if (categoryToUpdateFields) {
      setValue("categoryTitle", categoryToUpdateFields?.categoryTitle);
      setValue(
        "categoryDescription",
        categoryToUpdateFields?.categoryDescription
      );
    }
  }, [open, categoryIdToUpdate, reset, setValue, categoryToUpdateFields]);

  useEffect(() => {
    if (addError || updateError) {
      setIsAlert(true);
      setSeverity("error");
      setAutoHideDuration(4000);
      setAlertMessage(addError?.message || updateError?.message || "");
    }
  }, [addError, updateError]);

  const onSubmit = async (formData: UpdateCategory | AddCategoryFields) => {
    try {
      if (categoryIdToUpdate) {
        const payload: UpdateCategory = {
          ...formData,
          categoryId: categoryIdToUpdate,
        };
        // If categoryIdToUpdate is present, it means we're in update mode
        await updateCategory({ ...payload, categoryId: categoryIdToUpdate });
      } else {
        await addCategory(formData as AddCategoryFields);
      }
      onClose();
      setIsAlert(true);
      setSeverity("success");
      setAutoHideDuration(4000);
      setAlertMessage(
        categoryIdToUpdate
          ? "Category updated successfully"
          : "Category added successfully"
      );
    } catch (error) {
      setIsAlert(true);
      setSeverity("error");
      setAutoHideDuration(4000);
      setAlertMessage(addError?.message || updateError?.message || "");
    }
  };

  return (
    <>
      {isAlert && alertMessage && (
        <Toaster
          isAlert={isAlert}
          severity={severity}
          autoHideDuration={autoHideDuration}
          handleClose={() => setIsAlert(!isAlert)}
          alertMessage={alertMessage}
        />
      )}
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {categoryIdToUpdate ? "Update" : "Add"} Category
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Category Name"
                  fullWidth
                  variant="outlined"
                  {...register("categoryTitle", {
                    required: "Category name is required.",
                  })}
                  error={!!errors.categoryTitle}
                  helperText={errors?.categoryTitle?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Category Description"
                  fullWidth
                  variant="outlined"
                  {...register("categoryDescription", {
                    required: "Category description is required.",
                  })}
                  error={!!errors.categoryDescription}
                  helperText={errors?.categoryDescription?.message}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="primary" variant="contained">
              Cancel
            </Button>
            <Button
              type="submit"
              color="primary"
              disabled={addLoading || updateLoading}
              variant="contained"
            >
              {addLoading || updateLoading ? (
                <CircularProgress color="inherit" />
              ) : (
                `${categoryIdToUpdate ? "Update" : "Add"} Category`
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default AddCategoryModal;
