import { Add, IosShare, Search } from "@mui/icons-material";
import {
    Box,
    Button,
    InputAdornment,
    TextField,
    Typography,
    styled,
} from "@mui/material";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledOutlinedButton = styled(Button)(({ theme }) => ({
    borderRadius: "30px",
    border: "2px solid #68B49A !important",
    "&:hover": {
        backgroundColor: "#68B49A11",
    },
    padding: "0.5rem 2rem",
    color: "#68B49A",
}));

export default function AdminDishHeader() {
    return (
        <>
        <Typography variant="h4" fontWeight="bold">
            Dish Data
        </Typography>
        <Box
            display="flex"
            flexDirection="row"
            sx={{ mb: "1rem", justifyContent: "space-between" }}
            width="100%"
            alignItems={"center"}
        >
            <Box display="flex" alignItems={"center"}>
            <TextField
                placeholder="Search dish..."
                size="small"
                sx={{
                color: "#C2C2C2",
                m: "1rem",
                "& .MuiOutlinedInput-notchedOutline": {
                    borderRadius: "30px",
                    border: "1px solid #464646",
                },
                height: "fit-content",
                }}
                margin="dense"
                InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                    <Search />
                    </InputAdornment>
                ),
                }}
            />
            <StyledOutlinedButton>Search</StyledOutlinedButton>
            </Box>
            <Box display="flex" alignItems={"center"}>
            <StyledOutlinedButton startIcon={<IosShare></IosShare>}>
                Export Data
            </StyledOutlinedButton>
            <Button
                variant="contained"
                startIcon={<Add></Add>}
                sx={{
                borderRadius: "30px",
                backgroundColor: "#68B49A",
                "&:hover": {
                    backgroundColor: "#68B49Aee",
                },
                padding: "0.5rem 2rem",
                m: "1rem",
                }}
            >
                Add new dish
            </Button>
            </Box>
        </Box>
        </>
    );
}
