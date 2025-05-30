import React, { useEffect } from "react";
import { styled } from "@mui/system";
import SideBar from "./SideBar/SideBar";
import FriendsSideBar from "./FriendsSideBar/FriendsSideBar";
import Messenger from "./Messenger/Messenger";
import AppBar from "./AppBar/AppBar";
import { logout } from "../shared/utils/auth";
import {setUserDetails} from "../store/slices/authSlice";
import {useDispatch,useSelector} from "react-redux";
import { connectWithSocketServer } from "../realtimeCommunication/socketConnection";
import Room from "./Room/Room";


const Wrapper = styled("div")({
  width: "100%",
  height: "100vh",
  display: "flex",
});

const Dashboard =  () => {
  const dispatch = useDispatch()
  const isUserInRoom = useSelector(state => state.room.isUserInRoom)

  useEffect(() => {
    const userDetails = localStorage.getItem("user");
    if (!userDetails) {
      logout();
    } else {
      try {
        const parsedUserDetails = JSON.parse(userDetails);
        dispatch(setUserDetails(parsedUserDetails));
        connectWithSocketServer(parsedUserDetails);
      } catch (error) {
        console.error("Error parsing user details from localStorage:", error);
        logout(); // Log the user out if the stored data is invalid
      }
    }
  }, []);

  return (
    <Wrapper>
      <SideBar />
      <FriendsSideBar />
      <Messenger />
      <AppBar />
       {isUserInRoom && <Room/>}
    </Wrapper>
  );
};


export default Dashboard;
