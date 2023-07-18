//////////////////////////// Import Dependencies ////////////////////////////
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Scanner from "../widgets/scanner";
import { 
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import ConfirmCup from '../assets/ConfirmCup.png';
import 'typeface-poppins';
import DishAPI from "../features/api";
import { FirebaseContext } from "../firebase";
////////////////////////////////////////////////////////////////////////////

///////////////////////////////// Global Declarations /////////////////////////////////
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  }
}));

interface DialogTopbarProps {
  id: string;
  onClose: () => void;
}

function BootstrapDialogTopbar(props: DialogTopbarProps) {
  const { onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 1, p: 2, width: '230px' }} {...other}>
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon sx={{ color: '#4c4242', fontSize: '2rem' }} />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}
//////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////// Sub-components /////////////////////////////////
function Confirm({ open, setOpen, onSubmit, onCancel, id, isMobile }) {
  const handleClose = () => {
    onCancel();
    setOpen(false);
  };

  return (
    <Box>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTopbar id="customized-dialog-title" onClose={handleClose} />
        <DialogContent sx={ isMobile ? styles.dialogContentMobile : styles.dialogContentDesktop}>
          <Box sx={styles.confirmCup}/>
          <Typography sx={styles.mugId}>
            Mug # {id}
          </Typography>
          <Button sx={styles.borrowButton} onClick={onSubmit}>
            <Typography sx={styles.borrowButtonText}>Borrow</Typography>
          </Button>
        </DialogContent>
      </BootstrapDialog>
    </Box>
  );
}
//////////////////////////////////////////////////////////////////////////////

/////////////////////////////// Main component //////////////////////////////
export default () => {
  const [scanId, setScanId] = useState("");
  const [open, setOpen] = React.useState(false);
  const firebase = useContext(FirebaseContext);
  const navigate = useNavigate();
  const [Buffer, setBuffer] = useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const onScan = open
    ? null
    : (id: string) => {
        setScanId(id);
        setOpen(true);
  };

  const onConfirm = async () => {
    if (!open) {
      return false;
    }
    setOpen(false);
    const user = firebase?.user?.uid || null;
    console.log("USER: " + user);
    const docId = await DishAPI.addDishBorrow(scanId, user);
    setBuffer(true);

    console.log("doc ref" + docId);
    const transactionID = docId;

    if (!firebase?.user) {
      console.log("USER IS NULL");
      navigate(`/login/?transaction_id=${transactionID}`);
    }
    console.log("LOGGEd out user" + user);
  };

  const onCancel = () => {
    if (open) {
      setScanId("");
    }
  }

  return (
    <>
      <Scanner
        mode="Borrow Dishes"
        onScan={onScan}
      />
      <Confirm
        open={open}
        setOpen={setOpen}
        id={scanId}
        onSubmit={async () => {
          await onConfirm();
        }}
        onCancel={onCancel}
        isMobile={isMobile}
      />
    </>
  );
};
////////////////////////////////////////////////////////////////////////////

////////////////////////////// Styles /////////////////////////////////
const styles = {
  confirmCup: {
    width: '110px',
    height: '110px',
    borderRadius: '7px',
    backgroundImage: `url(${ConfirmCup})`,
    backgroundSize: 'cover',
    marginBottom: '12px'
  },

  dialogContentDesktop: {
    width: '300px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '5px'
  },

  dialogContentMobile: {
    width: '250px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '5px'
  },

  mugId: {
    fontSize: '1.125rem',
    fontFamily: 'Poppins, sans-serif',
    marginBottom: '20px'
  },

  borrowButton: {
    width: '150px',
    height: '40px',
    backgroundColor: "#68B49A",
    '&:hover': {
      backgroundColor: '#68B49A',
    },
    borderRadius: '20px',
    marginTop: '7px',
    marginBottom: '15px'
  },

  borrowButtonText: {
    fontSize: '1.125rem',
    fontFamily: 'Poppins, sans-serif',
    color: 'white'
  }
};
//////////////////////////////////////////////////////////////////////