import React, { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";


const Login=() => {
    const [input,setInput]=useState({
        email:"",
        password:""
    })
    const[loading,setLoading]=useState(false);
    const {user} = useSelector(store=>store.auth)
    const navigate =useNavigate();
    const dispatch = useDispatch();
    const changeEventHandler=(e)=>{
        setInput({...input,[e.target.name]:e.target.value})
    }

    const singupHandler=async (e)=>{
        e.preventDefault();
        console.log(input);
        try {
            setLoading(true);
            const res = await axios.post('http://localhost:8000/api/v1/user/login',input,{
                headers:{
                    'Content-Type':'application/json'
                },
                withCredentials:true
            });
            if(res.data.success){
                dispatch(setAuthUser(res.data.user))
                navigate('/');
                toast.success(res.data.message);
                setInput({
                    email:"",
                    password:""
                });
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)
        }finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        if(user){
            navigate("/");
        }
    },[])
    return(
        <div className='flex items-center w-screen h-screen justify-center'>
            <form onSubmit={singupHandler} className='shadow-lg flex flex-col gap-5 p-8'>
                <div className='my-4'>
                    <h1 className="text-center font-bold text-xl">LOGO</h1>
                    <p className="text-center text-sm">Login to see photos and videos from your friend</p>
                </div>
                <div>
                    <Label className='font-medium'>Email</Label>
                    <Input
                    type="email"
                    name="email"
                    value={input.email}
                    onChange={changeEventHandler}
                    className="focus-visible:ring-transparent my-2"
                    />
                </div>
                <div>
                    <Label className='font-medium'>Password</Label>
                    <Input
                    type="password"
                    name="password"
                    value={input.password}
                    onChange={changeEventHandler}
                    className="focus-visible:ring-transparent my-2"
                    />
                </div>
                {
                    loading ? (
                        <Button>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin'></Loader2>
                            Please Wait
                        </Button>
                    ) : (
                        <Button type='submit'>Login</Button>
                    )
                }
                <Label className='text-center'>Dosen't have an account? <Link to="/signup" className='text-blue-600'>Signup</Link></Label>
            </form>
        </div>
    )
}

export default Login