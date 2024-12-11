import { setMessages } from "@/redux/chatSilce";
import { setPosts } from "@/redux/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllMessage=()=>{
    const dispatch = useDispatch();
    const {selectedUser} = useSelector(store=>store.auth);
    useEffect(()=>{
        const fetchAllMessage= async ()=>{
            try {
                const res = await axios.get(`https://logoinst-u31g.onrender.com/api/v1/message/all/${selectedUser?._id}`,{withCredentials:true});
                if(res.data.success){
                    dispatch(setMessages(res.data.messages));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllMessage();
    },[]);
}
export default useGetAllMessage;