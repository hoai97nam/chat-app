import React, { useContext, useState } from "react";
import { Modal, Form, Input, Select, Spin, Avatar } from 'antd';
import { AppContext } from "../../context/AppProvider";
import { AuthContext } from "../../context/AuthProvider";
import { debounce } from "lodash";
import { db } from "../../firebase/config";

function DebounceSelect({ fetchOption, debounceTimeout = 300, ...props }) {
    const [fetching, setFectching] = useState(false)
    const [options, setOption] = useState([])

    const debounceFetcher = React.useMemo(() => {
        const loadOptions = (value) => {
            setOption([])
            setFectching(true)

            fetchOption(value, props.currentMember).then(newOptions => {
                setOption(newOptions)
                console.log(newOptions);
                setFectching(false)
            })
        }
        return debounce(loadOptions, debounceTimeout)
    }, [debounceTimeout, fetchOption])

    return (
        <Select
            labelInValue
            filterOption={false}
            onSearch={debounceFetcher}
            notFoundContent={fetching ? <Spin size="small" /> : null}
            {...props}
        >
            {
                options.map(opt => (
                    <Select.Option key={opt.value} value={opt.value} title={opt.label}> 
                        <Avatar size='samll' src={opt.photoURL}>
                            {opt.photoURL ? '' : opt.label.charAt(0).toUpperCase()}
                        </Avatar>
                        {` ${opt.label}`}
                    </Select.Option>
                ))
            }
        </Select>
    )
}

async function fetchUserList(search, currentMember) {
    return db.collection('users')
    .where('keywords','array-contains', search)
    .orderBy('displayName')
    .limit(20)
    .get()
    .then(snapshot => {
        return snapshot.docs.map(doc=>({
            label: doc.data().displayName,
            value: doc.data().uid,
            photoURL: doc.data().photoURL
        })).filter(opt=>!currentMember.includes(opt.value))
    })
 }

export default function InviteMemberModal() {
    const { isInviteMemberVisible, setIsInviteMemberVisible, selectedRoomId, selectedRoom } = useContext(AppContext);
    const { user: { uid } } = useContext(AuthContext)

    const onOk = () => {
        form.resetFields()

        const roomRef = db.collection('rooms').doc(selectedRoomId)

        roomRef.update({
            members: [...selectedRoom.members,...value.map(val => val.value)]
        })
        setIsInviteMemberVisible(false)
    }
    const onCancel = () => {
        form.resetFields()
        setIsInviteMemberVisible(false)
    }
    const [form] = Form.useForm();
    const [value, setValue] = useState('')


    return (
        <div>
            <Modal title="Invite member"
                visible={isInviteMemberVisible}
                onOk={onOk}
                onCancel={onCancel}
                destroyOnClose={true}>
                <Form form={form} layout='vertical'>
                    <DebounceSelect
                        mode='multiple'
                        label='member name'
                        value={value}
                        placeholder='enter member name'
                        fetchOption={fetchUserList}
                        onChange={(newValue) => setValue(newValue)}
                        style={{ width: '100%' }}
                        currentMember={selectedRoom?.members}
                    />
                </Form>
            </Modal>
        </div>
    )
}