import React, { useState } from 'react';
import { Button, Form, FormProps, Input, Popover } from 'antd';
import useHome from '../callbacks/useHome';
import { UsergroupAddOutlined } from '@ant-design/icons';

type FieldType = {
    name?: string;
};

const AddNewTeamButton: React.FC = () => {
    const home = useHome();
    const [open, setOpen] = useState(false);


    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        console.log('Success:', values);
        if (!values.name){
            home.notify_error("Name empty! Please fill all the required fields!");
            return;
        }
        home.createTeam(values.name)
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
                        rules={[{ required: true, message: 'Please input the name of the team!' }]}
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
            title="Add a new team"
            trigger="click"
            open={open}
            onOpenChange={handleOpenChange}
        >
            <Button type={"primary"} size={"large"}><UsergroupAddOutlined /></Button>
        </Popover>
    );
};

export default AddNewTeamButton;