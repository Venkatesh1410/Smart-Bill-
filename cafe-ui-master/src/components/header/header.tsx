import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";

interface HeaderProps {
  title: string;
  buttonText?: string;
  onButtonClick?: () => void;
  icon?: JSX.Element;
  buttonType?: "button" | "submit" | "reset" | undefined;
  isDisabled:boolean;
}

const Header: React.FC<HeaderProps> = ({
  title,
  buttonText,
  onButtonClick,
  icon,
  buttonType,
  isDisabled,
}) => {
  return (
    <Card sx={{ marginBottom: 4 }}>
      <CardContent
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5">{title}</Typography>
        {buttonText  && (
          <Button
            variant="contained"
            onClick={onButtonClick}
            startIcon={icon}
            type={buttonType}
            disabled={isDisabled}
          >
            {buttonText}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default Header;
