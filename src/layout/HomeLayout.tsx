import React, { useEffect } from 'react'
import { useAuthStore } from '../store/authStore'

export default function HomeLayout() {

    const fetchUser = useAuthStore((state) => state.fetchUser)

    useEffect(() => {

        fetchUser()

    },[])

  return (
    <div>HomeLayout</div>
  )
}
