// src/components/DealDetails.tsx

import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import MobileStepper from "@mui/material/MobileStepper";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
import TextField from "@mui/material/TextField";
import Rating from "@mui/material/Rating";
import TurnedInNotIcon from "@mui/icons-material/TurnedInNot";
import HandshakeIcon from "@mui/icons-material/Handshake";
import BitDealerListTable from './BitDealerListTable';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

// Remove unused Item component or use it somewhere
/*
interface ItemProps {
  children: React.ReactNode;
}

const Item = (props: ItemProps) => {
  return (
    <Paper
      sx={{
        padding: 2,
        textAlign: "left",
        height: "100%",
      }}
      elevation={0}
    >
      {props.children}
    </Paper>
  );
};
*/

const images = [
    {
        label: "Image 1",
        imgPath: "https://images.unsplash.com/photo-1576045057995-568f588f82fb",
    },
    {
        label: "Image 2",
        imgPath: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37",
    },
    {
        label: "Image 3",
        imgPath: "https://images.unsplash.com/photo-1576045057995-568f588f82fb",
    },
    {
        label: "Image 4",
        imgPath: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37",
    },
];

// Props interface for the ScrollDialog component
interface ScrollDialogProps {
    open?: boolean;
    onClose?: () => void;
}

export default function ScrollDialog({ open = true, onClose }: ScrollDialogProps) {
    const [isOpen, setIsOpen] = React.useState(open);
    const [scroll] = React.useState<"paper" | "body">("paper"); // Remove setScroll if unused
    const [activeStep, setActiveStep] = React.useState(0);
    const maxSteps = images.length;

    // Update internal state when prop changes
    React.useEffect(() => {
        setIsOpen(open);
    }, [open]);

    const handleClose = () => {
        setIsOpen(false);
        if (onClose) onClose();
    };

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStepChange = (step: number) => {
        setActiveStep(step);
    };

    const descriptionElementRef = React.useRef<HTMLElement>(null);
    React.useEffect(() => {
        if (isOpen) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [isOpen]);

    return (
        <Dialog
            open={isOpen}
            onClose={handleClose}
            scroll={scroll}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
            maxWidth="md"
        >
            <DialogTitle id="scroll-dialog-title" sx={{ p: 2 }}>
                <Box sx={{ flexGrow: 1 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                            sx={{ width: 56, height: 56 }}
                            alt="Remy Sharp"
                            src="https://images.unsplash.com/photo-1598170845058-32b9d6a5da37"
                        />
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6">User Name</Typography>
                            <Typography variant="body2" color="text.secondary">
                                User description or additional info
                            </Typography>
                            <Rating
                                name="half-rating-read"
                                defaultValue={3.75}
                                precision={0.5}
                                readOnly
                            />
                        </Box>
                        <Button variant="contained" color="success">
                            <TurnedInNotIcon sx={{ fontSize: 30 }} />
                            save
                        </Button>
                    </Stack>
                </Box>
            </DialogTitle>
            <DialogContent dividers={scroll === "paper"}>
                <Box sx={{ maxWidth: "100%", flexGrow: 1, mb: 3 }}>
                    <Paper
                        square
                        elevation={0}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            height: 50,
                            pl: 2,
                            bgcolor: "background.default",
                        }}
                    >
                        <Typography>{images[activeStep].label}</Typography>
                    </Paper>
                    <AutoPlaySwipeableViews
                        axis="x"
                        index={activeStep}
                        onChangeIndex={handleStepChange}
                        enableMouseEvents
                    >
                        {images.map((step, index) => (
                            <div key={step.label}>
                                {Math.abs(activeStep - index) <= 2 ? (
                                    <Box
                                        component="img"
                                        sx={{
                                            height: 300,
                                            display: "block",
                                            maxWidth: "100%",
                                            overflow: "hidden",
                                            width: "100%",
                                            objectFit: "cover",
                                        }}
                                        src={step.imgPath}
                                        alt={step.label}
                                    />
                                ) : null}
                            </div>
                        ))}
                    </AutoPlaySwipeableViews>
                    <MobileStepper
                        steps={maxSteps}
                        position="static"
                        activeStep={activeStep}
                        nextButton={
                            <Button
                                size="small"
                                onClick={handleNext}
                                disabled={activeStep === maxSteps - 1}
                            >
                                Next
                                <KeyboardArrowRight />
                            </Button>
                        }
                        backButton={
                            <Button
                                size="small"
                                onClick={handleBack}
                                disabled={activeStep === 0}
                            >
                                <KeyboardArrowLeft />
                                Back
                            </Button>
                        }
                    />
                </Box>
                <DialogContentText
                    id="scroll-dialog-description"
                    ref={descriptionElementRef}
                    tabIndex={-1}
                >
                    Here's the complete fixed code for the ScrollDialog component. I've
                    removed the duplicate Box import that was causing the error. The
                    component should now work correctly, showing a dialog with an image
                    slider and form fields.
                </DialogContentText>
                <Box
                    component="form"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        mt: 2,
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
                        <TextField
                            id="standard-number"
                            label="Necessary Quantity"
                            type="number"
                            variant="standard"
                            helperText="kg/unit"
                            sx={{ width: "48%" }}
                        />
                        <TextField
                            id="standard-search"
                            label="Price Per Unit"
                            type="search"
                            variant="standard"
                            sx={{ width: "48%" }}
                        />
                        <TextField
                            id="standard-search"
                            label="Delivery Location"
                            type="search"
                            variant="standard"
                            helperText="(optional)"
                            sx={{ width: "48%" }}
                        />
                        <TextField
                            id="standard-textarea"
                            label="Special Note"
                            placeholder="enter your special note if have"
                            multiline
                            variant="standard"
                            helperText="(optional)"
                            sx={{ width: "48%" }}
                        />
                    </Box>
                    <Box>
                        <Button variant="contained" color="success">
                            <HandshakeIcon sx={{ fontSize: 30 }} />
                            Deal
                        </Button>
                    </Box>
                </Box>
                <Box sx={{ mt: 10 }}>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d990.2465151370129!2d79.88249354425925!3d6.89227016819514!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae25b724a9cdaef%3A0x88e1c79d7a3d95b7!2sFresh%20Flower%20Shop!5e0!3m2!1sen!2slk!4v1742661811121!5m2!1sen!2slk"
                        width="100%"
                        height="450"
                        style={{ border: "1px solid black" }}
                        allowFullScreen={true} // Fixed: Changed from string to boolean
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </Box>
                <Box sx={{ mt: 3, mb: 2 }}>
                    <BitDealerListTable />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
}