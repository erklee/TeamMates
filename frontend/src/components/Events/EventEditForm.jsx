import { useState } from "react"

function Edit({event}){
    const [attendessMax, setAttendessMax] = useState(event.attendessMax)
    const [category, setCatrgory] = useState(event.category)
    const[date, setDate] = useState(event.date)
    const handleSubmit = (e) => {
        e.preventDefault()
        const updateEvent = {
            _id: event._id,
            attendess: event.attendess,
            attendessMax: attendessMax,
            category: category,

        }
    }

}

export default Edit