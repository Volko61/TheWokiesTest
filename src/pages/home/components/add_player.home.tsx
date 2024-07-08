import React, { useState } from 'react';
import { Button, Form, FormProps, Input, Popover } from 'antd';
import useHome from '../callbacks/useHome';
import { UserAddOutlined } from '@ant-design/icons';

type FieldType = {
    name?: string;
    mail?: string;
};

const AddNewPlayerButton: React.FC = () => {
    const home = useHome();
    const [open, setOpen] = useState(false);


    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        console.log('Success:', values);
        if (!values.name || !values.mail){
            home.notify_error("Name or mail empty! Please fill all the required fields!");
            return;
        }
        home.createPlayer(values.name, values.mail)
        hide();
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
        errorInfo.errorFields.forEach(error => {
            error.errors.forEach(errorMessage => {
                   home.notify_error(errorMessage);
            })
        });
    };

    const hide = () => {
        setOpen(false);
    };

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
    };

    return (
        <Popover
            content={<>
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item<FieldType>
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please input your name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="mail"
                        label="E-mail"
                        rules={[
                            {
                                type: 'email',
                                message: 'The input is not valid E-mail!',
                            },
                            {
                                required: true,
                                message: 'Please input your E-mail!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </>
            }
            title="Add a new player"
            trigger="click"
            open={open}
            onOpenChange={handleOpenChange}
        >
            <Button type={"primary"} size={"large"}><UserAddOutlined /></Button>
        </Popover>
    );
};

export default AddNewPlayerButton;