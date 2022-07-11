import React, { useContext } from "react";
import { Collapse, Typography, Button } from 'antd'
import styled from "styled-components";
import { PlusSquareOutlined } from '@ant-design/icons'
import { AppContext } from "../../context/AppProvider";

const { Panel } = Collapse
const PanelStyled = styled(Panel)`
    &&& {
        .ant-collapse-header,
        p {
            color: white;
        }
        .ant-collapse-content-box {
            padding: 0 40px
        }
    }

    .add-room {
        color: white;
        padding: 0;
    }
`

const LinkStyled = styled(Typography.Text)`
    display: block;
    margin-bottom: 5px;
    color: white;

`

export default function RoomList() {

    const {rooms, setIsAddRoomVisible, setSelectedRoomId} = React.useContext(AppContext) 
    const handleAddRoom = ()=>{
        // get function set modal on (state in context)
        setIsAddRoomVisible(true)
    }

    
    return (
        <Collapse ghost defaultActiveKey={['1']}>
            <PanelStyled header="room list" key='1'>
                {rooms.map(room => 
                <LinkStyled key={room.id} onClick={()=>setSelectedRoomId(room.id)}>
                    {room.name} </LinkStyled>)}
                <Button 
                    type="text"
                    icon={<PlusSquareOutlined />}
                    className="add-room" onClick={handleAddRoom}>New room</Button>
            </PanelStyled>
        </Collapse>
    )
}
