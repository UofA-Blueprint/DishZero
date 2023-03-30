//  Internally, customStyles will deep merges your customStyles with the default styling.
const CustomStyles = ({
    table:{
        style:{
            
        },
    },
    rows: {
        style: {
            minHeight: '51px', // override the row height
            fontStyle: "normal",
            fontWeight: "400",
            fontSize: "14px",
            lineHeight: "24px",
        },
    },
    headCells: {
        style: {
            fontSize: '16px',
            fontWeight: '400',
            lineHeight: '24px',
            backgroundColor: "#464646",
            color: "#F6F8F5",
        },
    },
    cells: {
        style: {
            // paddingLeft: '8px', // override the cell padding for data cells
            // paddingRight: '8px',
        },
    },
});

export default CustomStyles