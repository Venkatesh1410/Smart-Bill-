import {
  Backdrop,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Typography,
  styled,
} from "@mui/material";
import { useDashboard } from "../../hooks/useDashboard";
import Toaster from "../../../toaster/toaster";
import { useState } from "react";
import Category from "../category/category";
import Product from "../product/product";
import Bill from "../bill/bill";

interface CardProps {
  title: string;
  value?: string;
  buttonText?: string;
}

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

const componentsMap = {
  "Total Category": <Category />,
  "Total Products": <Product />,
  "Total Bills": <Bill />,
};

const CardComponent = ({
  title,
  value,
  buttonText,
  onSelectItem,
}: CardProps & { onSelectItem: (title: string) => void }) => {
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "35%",
        alignItems: "center",
      }}
    >
      <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
        <Typography variant="h5">{title}</Typography>
        <Typography variant="h5" sx={{ paddingTop: "15px" }}>
          {value}
        </Typography>
      </CardContent>
      <Box sx={{ paddingBottom: 2, width: "90%", marginTop: 5 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          onClick={() => onSelectItem(title)}
        >
          {buttonText}
        </Button>
      </Box>
    </Card>
  );
};

const Home = () => {
  const { details: dashboardData, isLoading, error } = useDashboard();
  const [isAlert, setIsAlert] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const handleClose = () => {
    setIsAlert(false);
  };

  const handleSelectItem = (title: string) => {
    setSelectedItem(title);
  };

  const cardData = [
    {
      title: "Total Category",
      value: dashboardData?.categories,
      buttonText: "View Categories",
    },
    {
      title: "Total Products",
      value: dashboardData?.products,
      buttonText: "View Products",
    },
    {
      title: "Total Bills",
      value: dashboardData?.bills,
      buttonText: "View Bills",
    },
  ];

  return (
    <>
      {isLoading && (
        <StyledBackdrop open={isLoading}>
          <CircularProgress sx={useStyles.circularProgress} color="inherit" />
        </StyledBackdrop>
      )}
      {error && (
        <Toaster
          isAlert={isAlert}
          handleClose={handleClose}
          autoHideDuration={4000}
          severity={"error"}
          alertMessage={error.message}
        />
      )}
      <Container>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          columnGap="40px"
          marginTop="30px"
        >
          {cardData.map((data, index) => (
            <CardComponent
              key={index}
              {...data}
              onSelectItem={handleSelectItem}
            />
          ))}
        </Box>

        {selectedItem && componentsMap[selectedItem]}
      </Container>
    </>
  );
};

export default Home;
