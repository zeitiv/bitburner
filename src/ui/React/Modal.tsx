import React, { type CSSProperties, useEffect, useState } from "react";
import { Theme, alpha } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Fade from "@mui/material/Fade";
import M from "@mui/material/Modal";
import { makeStyles } from "tss-react/mui";
import { SxProps } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";

const useStyles = makeStyles()((theme: Theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    position: "relative",
    backgroundColor: theme.colors.backgroundsecondary,
    backgroundImage: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.05)}, transparent 120px)`,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.25)}`,
    borderRadius: theme.shape.borderRadius * 1.6,
    boxShadow: `0 0 0 1px ${alpha(theme.colors.black ?? "#000", 0.4)}, 0 30px 80px -20px ${alpha(
      theme.colors.black ?? "#000",
      0.9,
    )}, 0 0 60px -30px ${alpha(theme.palette.primary.main, 0.5)}`,
    padding: 2,
    maxWidth: "80%",
    maxHeight: "80%",
    [theme.breakpoints.down("sm")]: {
      maxWidth: "calc(100% - 16px)",
      maxHeight: "calc(100% - 32px)",
    },
    overflow: "auto",
    "&::-webkit-scrollbar": {
      // webkit
      display: "none",
    },
    scrollbarWidth: "none", // firefox
  },
  closeButton: {
    position: "absolute",
    right: 8,
    top: 8,
    width: 28,
    height: 28,
    zIndex: 1,
    color: theme.palette.secondary.main,
  },
}));

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
  wrapperRef?: React.RefObject<HTMLDivElement>;
  wrapperStyles?: CSSProperties;
  removeFocus?: boolean;
  // If it's true, the player can dismiss the modal by pressing the Esc button or clicking on the backdrop.
  canBeDismissedEasily?: boolean;
}

export const Modal = ({
  open,
  onClose,
  children,
  sx,
  wrapperRef,
  wrapperStyles,
  removeFocus = true,
  canBeDismissedEasily = true,
}: ModalProps): React.ReactElement => {
  const { classes } = useStyles();
  const [content, setContent] = useState(children);
  useEffect(() => {
    if (!open) return;
    setContent(children);
  }, [children, open]);

  return (
    <M
      disableRestoreFocus={removeFocus}
      disableScrollLock
      disableEnforceFocus
      disableAutoFocus={removeFocus}
      open={open}
      onClose={() => {
        if (!canBeDismissedEasily) {
          return;
        }
        onClose();
      }}
      closeAfterTransition
      className={classes.modal}
      sx={sx}
    >
      <Fade in={open}>
        <div
          ref={wrapperRef}
          className={classes.paper}
          style={wrapperStyles}
          //@ts-expect-error inert is not supported by react types yet, this is a workaround until then. https://github.com/facebook/react/pull/24730
          inert={open ? null : ""}
        >
          <IconButton className={classes.closeButton} onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
          <Box sx={{ m: { xs: 2, sm: 3 } }}>{content}</Box>
        </div>
      </Fade>
    </M>
  );
};
