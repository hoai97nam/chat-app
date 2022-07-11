import React, { createContext, useState } from "react";
import useFirestore from "../hooks/useFirestore";
import { AuthContext } from "./AuthProvider";

export const AppContext = React.createContext();
export default function AppProvider({ children }) {
    const [isAddRoomVisible, setIsAddRoomVisible] = useState(false)
    const [isInviteMemberVisible, setIsInviteMemberVisible] = useState(false)
    const [selectedRoomId, setSelectedRoomId] = useState('')

    const { user: { uid } } = React.useContext(AuthContext); // get uid
    // debugger

    const roomsCondition = React.useMemo(() => {
        return {
            fieldName: 'members',
            operator: 'array-contains',
            compareValue: uid
        }
    }, [uid])

    const rooms = useFirestore('rooms', roomsCondition)
    const selectedRoom = React.useMemo(
        () => rooms.find(z => z.id === selectedRoomId),
        [rooms, selectedRoomId])
    // get members
    
    const membersCondition = React.useMemo(() => {
        return {
            fieldName: 'uid',
            operator: 'in',
            compareValue: selectedRoom?selectedRoom.members:''
        }
    }, [selectedRoom?.members])
    const members = useFirestore('users', membersCondition)
    // console.log(members);

    return (
        <AppContext.Provider value={{
            rooms,
            isAddRoomVisible,
            selectedRoom,
            members,
            setIsAddRoomVisible,
            selectedRoomId,
            setSelectedRoomId,
            isInviteMemberVisible,
            setIsInviteMemberVisible
        }}>
            {children}
        </AppContext.Provider>
    )
}