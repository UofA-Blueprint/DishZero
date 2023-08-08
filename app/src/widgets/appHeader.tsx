import { Box, AppBar, Typography} from "@mui/material";


export const AppHeader = (props) => {
    return(
    <div className={props.className}>
      <Box sx={{flexGrow:1, position:'relative', height:'14vh'}}>
        <AppBar position="static" sx={{backgroundColor:'#68B49A', height:'100%', alignItems:"center", justifyContent:"center"}}>
          <Typography sx={{fontWeight:'500', fontSize:'20px', mb:'-24px'}}> {props.title} </Typography>
        </AppBar>
      </Box>
    </div>
    )
}
