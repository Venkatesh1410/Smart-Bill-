import { Grid, Typography } from "@mui/material";
import { Avatar, Modal, ModalClose, ModalDialog } from "@mui/joy";
import { getJwtToken } from "../../shared/utils";
interface ProfileModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ProfileModal({ open, setOpen }: ProfileModalProps) {
  const {userData}  = getJwtToken();
  return (
    <Modal open={open}>
      <ModalDialog
        sx={{
          width: "400px",
          padding: "20px",
          backgroundColor: "#fff",
          borderRadius: "10px",
        }}
      >
        <ModalClose onClick={() => setOpen(false)} />
        <Grid container direction="column" alignItems="center" spacing={2}>
          <Grid item>
            <Avatar
              alt={userData?.sub.toUpperCase()}
              sx={{ width: 80, height: 80,fontSize:40,textAlign:'center' }}
            />
          </Grid>
          <Grid item>
            <Typography variant="body2" sx={{fontWeight:'bold',fontSize:20}}>{userData?.role}</Typography>
          </Grid>
          <Grid item>
          <Typography variant="body2" sx={{fontSize:20}}>{userData?.sub}</Typography>
          </Grid>
          </Grid>
      </ModalDialog>
    </Modal>
  );
}
