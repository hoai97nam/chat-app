import React, { useContext } from "react";
import { Modal, Form, Input } from 'antd';
import { AppContext } from "../../context/AppProvider";
import { addDocument } from "../../firebase/services";
import { AuthContext } from "../../context/AuthProvider";

export default function AddRoomModal() {
    const { isAddRoomVisible, setIsAddRoomVisible } = useContext(AppContext);
    const { user: { uid } } = useContext(AuthContext)

    const onOk = () => {
        // add 2 db
        addDocument('rooms', { ...form.getFieldsValue(), members: [uid] })
        form.resetFields()
        setIsAddRoomVisible(false)
    }
    const onCancel = () => {
        //reset field
        form.resetFields()
        setIsAddRoomVisible(false)
    }
    const [form] = Form.useForm();

    return (
        <div>
            <Modal title="New Room"
                visible={isAddRoomVisible}
                onOk={onOk}
                onCancel={onCancel}>
                <Form form={form} layout='vertical'>
                    <Form.Item label='Room name' name='name'>
                        <Input placeholder="room name" />
                    </Form.Item>
                    <Form.Item label='Description' name='description'>
                        <Input placeholder="description" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}