import React from "react";
import {Row, Col, Typography, Button} from 'antd'
import firebase, { auth, db } from "../../firebase/config";
import {useNavigate } from 'react-router-dom'
import { addDocument, generateKeywords } from "../../firebase/services";

const {Title} = Typography
const fbProvider = new firebase.auth.FacebookAuthProvider()

export default function Login(){

    const navigate = useNavigate()
    const handleFbLogin = async () => {
        const {additionalUserInfo, user} = await auth.signInWithPopup(fbProvider)
    
        if(additionalUserInfo){
            addDocument('users', {
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                uid: user.uid,
                providerId: additionalUserInfo.providerId,
                keywords: generateKeywords(user.displayName?.toLowerCase())
            })
        }
    }

    auth.onAuthStateChanged((user)=>{
        // console.log(user)
        if (user) {
            navigate('/')
        }
    })
    return (
        <div>
            <Row justify="center" style={{height: 800}}>
                <Col span={8}>
                    <Title style={{textAlign: 'center'}} Level={3}>
                        Fun chat
                    </Title>
                    <Button style={{width:'100%', marginBottom:5}}>
                        Log in by Google
                    </Button>
                    <Button style={{width:'100%'}} onClick={handleFbLogin}>Log in by Fakebook</Button>
                </Col>
            </Row>
        </div>
    )
}
