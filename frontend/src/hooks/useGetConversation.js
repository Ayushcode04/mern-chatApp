import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'


const useGetConversation = () => {
    const [loading, setLoading] = useState(false)
    const [conversations, setConversation] = useState([])

    useEffect(() => {
        const getConversations = async () => {
            setLoading(true)
            try {
                const res = await fetch('/api/users')
                const data = await res.json()
                if (data.error) {
                    throw new Error(data.error)
                }
                setConversation(data)
            } catch (error) {
                toast.error(error.message)
            } finally {
                setLoading(false)
            }
        }
        getConversations()
    }, [])

    return { loading, conversations }
}

export default useGetConversation