import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Badge } from "./ui/badge";
import { setAuthUser } from "@/redux/authSlice";

const Post = ({ post }) => {
    const [text, setText] = useState("");
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);
    const { posts } = useSelector(store => store.post);
    const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
    const [postLike, setPostLike] = useState(post.likes.length);
    const [comment, setComment] = useState(post.comments);
    const [isFollowing,setIsFollowing] = useState(user.following.includes(post.author._id) || false);
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if (inputText.trim()) {
            setText(inputText);
        } else {
            setText("");
        }
    }

    const likeOrDislikeHandler = async () => {
        try {
            const action = liked ? 'dislike' : 'like';
            const res = await axios.get(`https://logoinst-u31g.onrender.com/api/v1/post/${post?._id}/${action}`, { withCredentials: true })
            if (res.data.success) {
                const updatedLikes = liked ? postLike - 1 : postLike + 1;
                setPostLike(updatedLikes);

                setLiked(!liked);
                const updatedPostData = posts.map(p =>
                    p._id === post._id ? {
                        ...p,
                        likes: liked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id]
                    } : p
                )
                dispatch(setPosts(updatedPostData));

                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const commentHandler = async () => {
        try {
            const res = await axios.post(`https://logoinst-u31g.onrender.com/api/v1/post/${post?._id}/comment`, { text }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                const updatedCommentData = [...comment, res.data.comment];
                setComment(updatedCommentData);

                const updatedPostData = posts.map(p =>
                    p._id === post._id ? { ...p, comments: updatedCommentData } : p
                );

                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message)
                setText("");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const deletePostHandler = async () => {
        try {
            const res = await axios.delete(`https://logoinst-u31g.onrender.com/api/v1/post/delete/${post?._id}`, { withCredentials: true })
            if (res.data.success) {
                const updatedPostData = posts.filter((postItem) => postItem?._id !== post?._id);
                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("An unexpected error occurred");
            }
        }
    }

    const bookmarkHandler = async () => {
        try {
            const res = await axios.get(`https://logoinst-u31g.onrender.com/api/v1/post/${post?._id}/bookmark`, { withCredentials: true })
            if (res.data.success) {
                toast.success(res.data.message)
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    const followOrUnfollowHandler = async()=>{
        try {
            const res=await axios.get(`https://logoinst-u31g.onrender.com/api/v1/user/followorunfollow/${post.author._id}`, { withCredentials: true })
            if(res.data.success){
                
                const newUserData ={...user, following: isFollowing ? user.following.filter(id => id !== post.author._id) : [...user.following, post.author._id]}
                dispatch(setAuthUser(newUserData));
                
                setIsFollowing(!isFollowing);
                toast.success(res.data.message)
            }
        } catch (error) {
            console.log(error);
        }
    }



    return (
        <div className="my-8 w-full max-w-sm mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Avatar>
                        <AvatarImage src={post.author?.profilePicture} alt="post_image"></AvatarImage>
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-3">
                        <h1>{post.author?.username}</h1>
                        {user?._id === post.author._id && <Badge variant='secondary'>Author</Badge>}
                    </div>
                </div>
                <Dialog >
                    <DialogTrigger asChild>
                        <MoreHorizontal className="cursor-pointer"></MoreHorizontal>
                    </DialogTrigger>
                    <DialogContent className="flex flex-col items-center text-sm text-center">
                        {
                            user && user?._id !== post?.author._id && (isFollowing ? (<Button varient='ghost' onClick={followOrUnfollowHandler} className="cursor-pointer w-fit text-[#ED4956] font-bold">Unfollow</Button>):(<Button onClick={followOrUnfollowHandler} varient='ghost' className="cursor-pointer w-fit text-[#ED4956] font-bold">Follow</Button>))
                        }
                        <Button varient='ghost' className="cursor-pointer w-fit ">Add to favorites</Button>
                        {
                            user && user?._id === post?.author._id && <Button varient='ghost' onClick={deletePostHandler} className="cursor-pointer w-fit ">Delete</Button>
                        }
                    </DialogContent>
                </Dialog>
            </div>
            <img className='rounded-sm my-2 w-full aspect-square object-cover'
                src={post.image}
                alt="Post-img"
            />

            <div className="flex items-center justify-between my-2">
                <div className="flex items-center gap-3">
                    {
                        liked ? <FaHeart onClick={likeOrDislikeHandler} size={'22px'} className="cursor-pointer text-red-600" /> : <FaRegHeart onClick={likeOrDislikeHandler} size={'22px'} className="cursor-pointer hover:text-gray-600" />
                    }
                    <MessageCircle onClick={() => { dispatch(setSelectedPost(post)), setOpen(true) }} className="cursor-pointer hover:text-gray-600" />
                    <Send className="cursor-pointer hover:text-gray-600" />
                </div>
                <Bookmark onClick={bookmarkHandler} className='cursor-pointer hover:text-gray-600 ' />
            </div>
            <span className="font-medium block mb-2">{postLike} likes</span>
            <p>
                <span className="font-medium mr-2">{post.author?.username}</span>
                {post.caption}
            </p>
            {
                comment.length > 0 && (
                    <span onClick={() => { dispatch(setSelectedPost(post)), setOpen(true) }} className="cursor-pointer text-sm text-gray-400">View all {comment.length} comments</span>
                )
            }
            <CommentDialog open={open} setOpen={setOpen} />
            <div className="flex items-center justify-between">
                <input
                    type="text"
                    placeholder="Add a comment..."
                    value={text}
                    onChange={changeEventHandler}
                    className="outline-none text-sm w-full"
                />
                {
                    text && <span onClick={commentHandler} className="cursor-pointer text-[#3BADF8]">Post</span>
                }
            </div>
        </div>
    )
}

export default Post