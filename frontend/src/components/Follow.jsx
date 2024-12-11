import { setAuthUser } from "@/redux/authSlice";
import store from "@/redux/store";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const Follow = ({followUser})=>{
    const {user} = useSelector(store=>store.auth)
    const [isFollowing,setIsFollowing] = useState(user.following.includes(followUser._id) || false)
    const dispatch = useDispatch();

    const followOrUnfollowHandler = async()=>{
        try {
            const res=await axios.get(`https://logoinst-u31g.onrender.com/api/v1/user/followorunfollow/${followUser._id}`, { withCredentials: true })
            if(res.data.success){
                
                const newUserData ={...user, following: isFollowing ? user.following.filter(id => id !== followUser._id) : [...user.following, followUser._id]}
                dispatch(setAuthUser(newUserData));
                setIsFollowing(!isFollowing);
                toast.success(res.data.message)
            }
        } catch (error) {
            console.log(error);
        }
    }
    return(
        <div>
            {isFollowing ? (<span onClick={followOrUnfollowHandler} className="text-[#696969] text-xs font-bold cursor-pointer hover:text-[#D3D3D3]">Following</span>):
            (<span onClick={followOrUnfollowHandler} className="text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#3495d6]">Follow</span>)}
        </div>
    )
}

export default Follow;