import { UserAddOutlined } from "@ant-design/icons";
import React, { useContext, useState } from "react";
import styled from "styled-components";
import { Button, Avatar, Tooltip, Form, Input, Alert } from "antd";
import Message from "./Message";
import { AppContext } from "../../context/AppProvider";
import { addDocument } from "../../firebase/services";
import { AuthContext } from "../../context/AuthProvider";
import useFirestore from "../../hooks/useFirestore";

const HeaderStyled = styled.div`
  display: flex;
  justify-content: space-between;
  height: 56px;
  padding: 0 16px;
  align-itemms: center;
  border-bottom: 1px solid rgb(230, 230, 230);

  .header {
    &__info {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    &__title {
      margin: 0;
      font-weight: bold;
    }

    &__description {
      font-size: 12px;
    }
  }
`;
const ButtonGroupStyled = styled.div`
  display: flex;
  justify-content: center;
`;
const WrapperStyled = styled.div`
  height: 100vh;
`;

const ContentStyled = styled.div`
  height: calc(100% - 56px);
  display: flex;
  flex-direction: column;
  padding: 11px;
  justify-content: flex-end;
`;
const FormStyled = styled(Form)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 2px 2px 0;
  border: 1px solid rgb(230, 230, 230);
  border-radius: 2px;

  .ant-form-item {
    flex: 1;
    margin-bottom: 0;
  }
`;
const MessageListStyled = styled.div`
  max-height: 100%;
  overflow-y: auto;
`;

export default function ChatWindow() {
  const { selectedRoom, members, setIsInviteMemberVisible } =
    useContext(AppContext);
  const {
    user: { uid, photoURL, displayName },
  } = useContext(AuthContext);
  const [inputValue, setInputValue] = useState("");
  const [form] = Form.useForm();

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleOnSubmit = () => {
    addDocument("message", {
      text: inputValue,
      uid,
      photoURL,
      roomId: selectedRoom?.id,
      displayName,
    });
    form.resetFields(["messages"]);
  };

  const condition = React.useMemo(()=>({
    fieldName:'roomId',
    operator:'==',
    compareValue: selectedRoom?.id
  }),[selectedRoom?.id])

  const messages = useFirestore('message', condition)
  return (
    <WrapperStyled>
      {selectedRoom?.id ? (
        <>
          <HeaderStyled>
            <div className="header__info">
              <p className="header__title">{selectedRoom?.name}</p>
              <span className="header__description">
                {selectedRoom?.description}
              </span>
            </div>
            <ButtonGroupStyled>
              <Button
                icon={<UserAddOutlined />}
                type="text"
                onClick={() => setIsInviteMemberVisible(true)}
              >
                Invite
              </Button>
              <Avatar.Group size={"small"} maxCount={2}>
                {members.map((member) => (
                  <Tooltip title={member.displayName} key={member.id}>
                    <Avatar src={member.photoURL}>
                      {member.photoURL
                        ? ""
                        : member.displayName?.charAt(0)?.toUpperCase()}
                    </Avatar>
                  </Tooltip>
                ))}
              </Avatar.Group>
            </ButtonGroupStyled>
          </HeaderStyled>
          <ContentStyled>
            <MessageListStyled>
                {messages.map(mes=>(
                    <Message
                    key={mes.id}
                    text={mes.text}
                    photoUrl={mes.photoURL}
                    displayName={mes.displayName}
                    createdAt={mes.createdAt}
                  ></Message>
                ))}
              
            </MessageListStyled>
            <FormStyled form={form}>
              <Form.Item name="messages">
                <Input
                  placeholder="Aa"
                  bordered={false}
                  autoComplete="off"
                  onChange={handleInputChange}
                  onPressEnter={handleOnSubmit}
                />
              </Form.Item>
              <Button type="primary" onClick={handleOnSubmit}>
                Send
              </Button>
            </FormStyled>
          </ContentStyled>
        </>
      ) : (
        <Alert
          message="chose group"
          type="info"
          showIcon
          style={{ margin: 5 }}
          closable
        />
      )}
    </WrapperStyled>
  );
}
