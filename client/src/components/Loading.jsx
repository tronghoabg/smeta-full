import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 30,
    }}
    spin
  />
);
const Loading = ({loadingoption}) => <div className={`${loadingoption} loading__icons absolute w-full h-full`}> <Spin indicator={antIcon} /></div>;
export default Loading;