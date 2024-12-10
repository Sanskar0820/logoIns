import store from "@/redux/store";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Follow from "./Follow";

const SuggestedUsers = () => {
    const { suggestedUsers } = useSelector(store =>store.auth)
    // const [isFollowing,setIsFollowing] = useState()
    return (
        <div className="my-10">
            <div className="flex items-center justify-between text-sm gap-3">
                <h1 className="font-semibold text-gray-600">Suggested for you</h1>
                <span className="font-medium cursor-pointer"> See All</span>
            </div>
            {
                suggestedUsers.map((user) => {
                    return (
                        <div key={user._id} className="flex flex-center justify-between my-5">
                            <div className="flex items-center gap-2">
                                <Link to={`/profile/${user?._id}`}>
                                    <Avatar>
                                        <AvatarImage src={user?.profilePicture} alt="post_image"></AvatarImage>
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </Link>

                                <div >
                                    <h1 className="font-semibold text-sm"><Link to={`/profile/${user?._id}`}>{user?.username}</Link></h1>
                                    <span className="text-gray-600 text-sm">{user?.bio || ""}</span>
                                </div>
                            </div>
                            <Follow followUser={user}/>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default SuggestedUsers;