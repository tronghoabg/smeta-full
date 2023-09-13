import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const Loading = () => <Spin className="ml-[272px] z-[11000]" indicator={antIcon} />;

export default Loading;
