import { useContext } from "react";
import { FirebaseContext, Role } from "../firebase";
import { Link } from "react-router-dom";
import DishAPI from "../features/api";
import { faAngleDoubleLeft, faQrcode } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import scan_icon from "../assets/scan.svg";
import leaf_white from "../assets/leaf-white.svg";
import leaf_green from "../assets/leaf-green.svg";
import DishCard from "../widgets/dishcard";
import '../styles/index.css'

const DishLog = ({dishes}) => {
  return (
    <div id="dish-log" className="mt-3">
      { dishes.map(dish => {
        return <DishCard dish={dish} />
      }) }
    </div>
  )
};

const NewUser = () => {
  return (
    <div>

    </div>
  )
};

const ExistingUser = (user) => {
  let dishes = DishAPI.getUserActiveDishes(user.uid);
  return (
    <div style={{padding:'24px', paddingTop:'12vh'}}>
      <div id="impact" className="sub-header-3">
        My Impact
        <div className="d-flex justify-content-between" style={{marginTop:'16px'}}>
          <div className="light-blue d-flex flex-column justify-content-end" style={{height:'118px', width:'48%', borderRadius:'10px', padding:'16px', position:'relative'}}>
            <img src={leaf_white} alt="leaf" style={{position:'absolute', top:'16px', right:'16px'}}/>
            <p className="header mb-0">{0}</p>
            <p className="sub-header-3 mb-1">Dishes Used</p>
          </div>
          <div className="light-blue d-flex flex-column justify-content-end" style={{height:'118px', width:'48%', borderRadius:'10px', padding:'16px', position:'relative'}}>
            <img src={leaf_white} alt="leaf" style={{position:'absolute', top:'16px', right:'16px'}}/>
            <div className="d-flex"><p className="header mb-0">{0}</p><p className="sub-header-2 mb-1" style={{alignSelf:'end', marginLeft:'7px'}}>Lbs</p></div>
            <p className="sub-header-3 mb-1">Waste Diverted</p>
          </div>
        </div>
      </div>
      <div id="dishes" style={{marginTop: '24px'}}>
        <div className="d-flex justify-content-between">
          <p className="sub-header-3">My Dishes</p>
          <p className="details-2 mt-1">{dishes?.length} in use</p>
        </div>
        { dishes?.length ? <DishLog dishes={dishes} /> :
          <div className="d-flex flex-column">
            <div className="mt-5 d-flex justify-content-center">
              <img src={leaf_green} style={{transform:'rotate(-90deg)'}} />
              <img src={leaf_green} style={{transform:'rotate(-45deg)', marginTop:'-16px'}} />
              <img src={leaf_green} />
            </div>
            <div className="d-flex justify-content-center mt-3">
              <p className="details-1 text-center" style={{maxWidth:'244px'}}>
                You don't have any dishes borrowed at the moment. Start borrowing to make an impact!
              </p>
            </div>
            <a className="btn-primary align-self-center mt-2" href="/borrow" style={{textDecoration:'none'}}>
              <p className="sub-header-3 text-center m-2">Borrow</p>
            </a>
          </div>
        }
      </div>
    </div>
  )
}

const Footer = () => {
  return (
    <div className="position-absolute bottom-0 end-0" style={{padding:'24px'}}>
      <Link to={"/borrow"}>
        <img src={scan_icon} alt="scan icon" />
      </Link>
    </div>
  )
}

export default () => {
  const fbContext = useContext(FirebaseContext);
  return (
    <div>
      <div id="content">
        {fbContext?.user ? <NewUser /> : <ExistingUser user="fbContext.user" />}
      </div>
      <Footer />
    </div>
  );
};