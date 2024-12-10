import React from 'react'
import { Outlet } from 'react-router-dom'
import RightSidebar from './RightSidebar'
import Feed from './Feed'
import useGetAllPosts from '@/hooks/useGetAllPost'
import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers'

const Home=()=>{
    useGetAllPosts();
    useGetSuggestedUsers();
    return(
        <div className='flex'>
            <div className='flex-grow'>
                <Feed/>
                <Outlet/>
            </div>
            <RightSidebar/>
        </div>
    )
}

export default Home