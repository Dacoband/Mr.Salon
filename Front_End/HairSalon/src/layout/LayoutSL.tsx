import React from "react";
import { Layout, Menu } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import "../App.css";
import { MenuUnfoldOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import HeaderSM from "../components/HeaderSM";
import { FaCircleUser } from "react-icons/fa6";

const { Content, Sider } = Layout;

// Dữ liệu Sidebar
const SidebarData = [
  {
    icon: MenuUnfoldOutlined,
    heading: "Quản lí cuộc hẹn",
    navigate: "/Appoiment-Stylish",
  },
  {
    icon: MenuUnfoldOutlined,
    heading: "Quản lí lịch nghỉ",
    navigate: "/managerSchedule",
  },
  // {
  //   icon: ShoppingCartOutlined,
  //   heading: "Quản lí lương",
  //   navigate: "/manager-money",
  // },
];

const LayoutSL: React.FC = () => {
  const navigate = useNavigate();

  const items = SidebarData.map((item, index) => ({
    key: String(index + 1),
    icon: React.createElement(item.icon),
    label: item.heading,
    onClick: () => navigate(item.navigate),
  }));

  return (
    <Layout className="w-full h-screen flex flex-col">
      <HeaderSM />
      <Layout className="flex flex-1">
        <Sider
          className="h-full bg-[#c89c47]"
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={(broken) => {
            console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          }}
        >
          <div className="mt-10">
            <FaCircleUser className="text-white mx-auto " size={70} />
            <div className="text-white mt-2 font-bold text-center text-lg">
              Stylish
            </div>
          </div>
          <Menu
            className="bg-[#c89c47] text-white font-medium  mt-5 custom-menu"
            theme="dark"
            defaultSelectedKeys={["1"]}
            items={items}
          />
        </Sider>
        <Layout>
          <Content className="p-6 bg-gray-100">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default LayoutSL;
