// import React, { useState } from "react";
// import { Button, message, Steps, theme } from "antd";
import demo from "../../assets/images/demo.jpg";
import bg from "../../assets/images/bgsdn.jpg";
import { FaUsers } from "react-icons/fa";
import { RiMapPinUserFill } from "react-icons/ri";
import { MdAccessTimeFilled } from "react-icons/md";

import { SearchOutlined } from "@ant-design/icons";
import "../../style.css";
import { Select } from "antd";
import { MdAddBox } from "react-icons/md";
import { FaCheckSquare } from "react-icons/fa";
import { Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { Steps, Button, Popover, Input } from "antd";
import type { StepsProps } from "antd";
import { getBranchesAll } from "../../services/Branches/branches";
import { Branches, Services, Stylish } from "../../models/type";
import { getStylishByBranchID, getStylishRandom } from "../../services/Stylish";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaFrownOpen } from "react-icons/fa";

import { FaScissors } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
import { FaUserClock } from "react-icons/fa6";
import { FaStar } from "react-icons/fa";

import { getServicesByType, getAllServices } from "../../services/serviceSalon";
const customDot: StepsProps["progressDot"] = (dot, { status, index }) => (
  <Popover
    content={
      <span>
        step {index} status: {status}
      </span>
    }
  >
    {dot}
  </Popover>
);

const BookingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [branches, setBranches] = useState<Branches[]>([]);
  const [serviceAll, setServicesAll] = useState<Services[]>([]);
  const [servicesType1, setServicesType1] = useState<Services[]>([]);
  const [servicesType2, setServicesType2] = useState<Services[]>([]);
  const [servicesType3, setServicesType3] = useState<Services[]>([]);
  const [selectedServices, setSelectedServices] = useState<Services[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedStylist, setSelectedStylist] = useState<string | null>(null); // Trạng thái cho stylist đã chọn

  const [stylists, setStylists] = useState<Stylish[]>([]); // Thêm trạng thái cho stylist
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null); // Trạng thái cho cơ sở đã chọn
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await getBranchesAll();
        setBranches(response);
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };

    const fetchServices = async () => {
      try {
        const serviceAll = await getAllServices();
        const services1 = await getServicesByType(1);
        const services2 = await getServicesByType(2);
        const services3 = await getServicesByType(3);
        setServicesAll(serviceAll);
        setServicesType1(services1);
        setServicesType2(services2);
        setServicesType3(services3);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchBranches();
    fetchServices();
  }, []);
  const handleBranchChange = async (branchId: string) => {
    setSelectedBranch(branchId);

    // Gọi API để lấy danh sách stylist dựa trên branchId
    try {
      const stylistList = await getStylishByBranchID(branchId);
      setStylists(stylistList);
    } catch (error) {
      console.error("Error fetching stylists:", error);
    }
  };

  const handleConfirm = () => {
    if (selectedServices.length > 0) {
      setCurrentStep(currentStep + 1);
    }
  };
  const handleConfirmBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };
  const handleServiceClick = (service: Services) => {
    const isSelected = selectedServices.some(
      (s) => s.serviceID === service.serviceID
    );

    if (isSelected) {
      setSelectedServices(
        selectedServices.filter((s) => s.serviceID !== service.serviceID)
      );
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };
  const handleDeleteService = (serviceID: string) => {
    setSelectedServices(
      selectedServices.filter((service) => service.serviceID !== serviceID)
    );
  };
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  const formatDuration = (duration: number) => {
    if (duration > 60) {
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      return `${hours} giờ ${minutes} phút`;
    }
    return `${duration} phút`;
  };

  const filteredServicesAll = serviceAll.filter((service) =>
    service.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredServicesType1 = servicesType1.filter((service) =>
    service.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredServicesType2 = servicesType2.filter((service) =>
    service.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredServicesType3 = servicesType3.filter((service) =>
    service.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const steps = [
    {
      title: "Chọn cơ sở và dịch vụ",
      content: (
        <div className="w-5/6 mx-auto flex">
          <div className="flex-1 h-[84vh] overflow-y-auto custom-scrollbar">
            <div className="text-xl text-[#937b34] font-bold pb-1 pr-4  w-fit  border-b-4 border-[#937b34]">
              Thông tin lịch hẹn:
            </div>
            <div className="mt-8 pr-4">
              {/* SERVICE */}
              <div className="text-lg mb-3 font-semibold flex items-center">
                <FaScissors className="mr-2" /> Chọn dịch vụ bạn muốn:
              </div>
              <div className="mb-3">
                <Input
                  placeholder="Tìm kiếm dịch vụ"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  prefix={
                    <SearchOutlined
                      style={{ fontSize: "20px", marginRight: "15px" }}
                    />
                  }
                  className="mb-5 text-base h-12"
                />
              </div>
              <Tabs
                defaultActiveKey="1"
                items={[
                  {
                    label: (
                      <Button
                        type="text"
                        shape="round"
                        className=" text-black font-semibold text-sm"
                      >
                        Tất cả
                      </Button>
                    ),
                    key: "1",
                    children: (
                      <div className="mt-2">
                        {filteredServicesAll.map((service) => (
                          <div
                            key={service.serviceID}
                            className={`border-2  px-4 py-2 flex mb-4 rounded-md ${
                              selectedServices.some(
                                (s) => s.serviceID === service.serviceID
                              )
                                ? "border-[#937b34]" // Màu nền khi dịch vụ được chọn
                                : "border-slate-400" // Màu nền mặc định
                            }`}
                          >
                            <div>
                              <img
                                src={demo}
                                alt={service.serviceName}
                                className="w-36 h-32 rounded-md object-cover object-top mr-4 m-1"
                              />
                            </div>
                            <div className="flex-1 h-32  flex flex-col justify-between">
                              <div className="text-base py-2 font-bold">
                                {service.serviceName}
                              </div>

                              {servicesType3.some(
                                (s) => s.serviceID === service.serviceID
                              ) && (
                                <div className="text-xs line-clamp mb-1 text-gray-700">
                                  <span className="text-gray-700 mr-1 font-bold">
                                    Mô tả:
                                  </span>
                                  <span className="ml-1 font-medium">
                                    {service.description}
                                  </span>
                                </div>
                              )}

                              <div className="text-xs text-slate-700 mb-1">
                                <span className="text-gray-700 font-bold">
                                  Thời gian:
                                </span>
                                <span className="ml-1 font-medium">
                                  {formatDuration(service.duration)}
                                </span>
                              </div>

                              <div className=" text-sm font-semibold mt-auto text-[#937b34]">
                                <span className="font-bold mr-1">Giá:</span>
                                {formatCurrency(service.price)} VNĐ
                              </div>
                            </div>
                            <div className="w-1/12 flex items-center justify-end p-2">
                              {selectedServices.some(
                                (s) => s.serviceID === service.serviceID
                              ) ? (
                                <FaCheckSquare
                                  className="cursor-pointer text-[#937b34]"
                                  size={30}
                                  onClick={() => handleServiceClick(service)}
                                />
                              ) : (
                                <MdAddBox
                                  size={35}
                                  className="cursor-pointer"
                                  onClick={() => handleServiceClick(service)}
                                />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ),
                  },
                  {
                    label: (
                      <Button
                        type="text"
                        shape="round"
                        className=" text-black font-semibold  text-sm p-3"
                      >
                        Cắt Tóc Và Tạo Kiểu
                      </Button>
                    ),
                    key: "2",
                    children: (
                      <div className="mt-2">
                        {filteredServicesType1.map((service) => (
                          <div
                            key={service.serviceID}
                            className={`border-2  px-4 py-2 flex mb-4 rounded-md ${
                              selectedServices.some(
                                (s) => s.serviceID === service.serviceID
                              )
                                ? "border-[#937b34]" // Màu nền khi dịch vụ được chọn
                                : "border-slate-400" // Màu nền mặc định
                            }`}
                          >
                            <div>
                              <img
                                src={demo}
                                alt={service.serviceName}
                                className="w-36 h-32 rounded-md object-cover object-top mr-4 m-1"
                              />
                            </div>
                            <div className="flex-1 h-32  flex flex-col justify-between">
                              <div className="text-base py-2 font-bold">
                                {service.serviceName}
                              </div>

                              <div className="text-xs text-slate-700 mb-1">
                                <span className="text-gray-700 font-bold">
                                  Thời gian:
                                </span>
                                <span className="ml-1 font-medium">
                                  {formatDuration(service.duration)}
                                </span>
                              </div>

                              <div className=" text-sm font-semibold mt-auto text-[#937b34]">
                                <span className="font-bold mr-1">Giá:</span>
                                {formatCurrency(service.price)} VNĐ
                              </div>
                            </div>
                            <div className="w-1/12 flex items-center justify-end p-2">
                              {selectedServices.some(
                                (s) => s.serviceID === service.serviceID
                              ) ? (
                                <FaCheckSquare
                                  className="cursor-pointer text-[#937b34]"
                                  size={30}
                                  onClick={() => handleServiceClick(service)}
                                />
                              ) : (
                                <MdAddBox
                                  size={35}
                                  className="cursor-pointer"
                                  onClick={() => handleServiceClick(service)}
                                />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ),
                  },
                  {
                    label: (
                      <Button
                        type="text"
                        shape="round"
                        className=" text-black font-semibold text-sm p-4"
                      >
                        Nhuộm Tóc và Uốn Tóc
                      </Button>
                    ),
                    key: "3",
                    children: (
                      <div className="mt-2">
                        {filteredServicesType2.map((service) => (
                          <div
                            key={service.serviceID}
                            className={`border-2  px-4 py-2 flex mb-4 rounded-md ${
                              selectedServices.some(
                                (s) => s.serviceID === service.serviceID
                              )
                                ? "border-[#937b34]" // Màu nền khi dịch vụ được chọn
                                : "border-slate-400" // Màu nền mặc định
                            }`}
                          >
                            <div>
                              <img
                                src={demo}
                                alt={service.serviceName}
                                className="w-36 h-32 rounded-md object-cover object-top mr-4 m-1"
                              />
                            </div>
                            <div className="flex-1 h-32  flex flex-col justify-between">
                              <div className="text-base py-2 font-bold">
                                {service.serviceName}
                              </div>

                              <div className="text-xs text-slate-700 mb-1">
                                <span className="text-gray-700 font-bold">
                                  Thời gian:
                                </span>
                                <span className="ml-1 font-medium">
                                  {formatDuration(service.duration)}
                                </span>
                              </div>

                              <div className=" text-sm font-semibold mt-auto text-[#937b34]">
                                <span className="font-bold mr-1">Giá:</span>
                                {formatCurrency(service.price)} VNĐ
                              </div>
                            </div>
                            <div className="w-1/12 flex items-center justify-end p-2">
                              {selectedServices.some(
                                (s) => s.serviceID === service.serviceID
                              ) ? (
                                <FaCheckSquare
                                  className="cursor-pointer text-[#937b34]"
                                  size={30}
                                  onClick={() => handleServiceClick(service)}
                                />
                              ) : (
                                <MdAddBox
                                  size={35}
                                  className="cursor-pointer"
                                  onClick={() => handleServiceClick(service)}
                                />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ),
                  },
                  {
                    label: (
                      <Button
                        type="text"
                        shape="round"
                        className=" text-black font-semibold text-sm p-3"
                      >
                        Combo Hot
                      </Button>
                    ),
                    key: "4",
                    children: (
                      <div className="mt-2">
                        {filteredServicesType3.map((service) => (
                          <div
                            key={service.serviceID}
                            className={`border-2  px-4 py-2 flex mb-4 rounded-md ${
                              selectedServices.some(
                                (s) => s.serviceID === service.serviceID
                              )
                                ? "border-[#937b34]" // Màu nền khi dịch vụ được chọn
                                : "border-slate-400" // Màu nền mặc định
                            }`}
                          >
                            <div>
                              <img
                                src={demo}
                                alt={service.serviceName}
                                className="w-36 h-32 rounded-md object-cover object-top mr-4 m-1"
                              />
                            </div>
                            <div className="flex-1 h-32  flex flex-col justify-between">
                              <div className="text-base py-2 font-bold">
                                {service.serviceName}
                              </div>

                              <div className="text-xs line-clamp mb-1 text-gray-700">
                                <span className="text-gray-700 mr-1 font-bold">
                                  Mô tả:
                                </span>
                                <span className="ml-1 font-medium">
                                  {service.description}
                                </span>
                              </div>

                              <div className="text-xs text-slate-700 mb-1">
                                <span className="text-gray-700 font-bold">
                                  Thời gian:
                                </span>
                                <span className="ml-1 font-medium">
                                  {formatDuration(service.duration)}
                                </span>
                              </div>

                              <div className=" text-sm font-semibold mt-auto text-[#937b34]">
                                <span className="font-bold mr-1">Giá:</span>
                                {formatCurrency(service.price)} VNĐ
                              </div>
                            </div>
                            <div className="w-1/12 flex items-center justify-end p-2">
                              {selectedServices.some(
                                (s) => s.serviceID === service.serviceID
                              ) ? (
                                <FaCheckSquare
                                  className="cursor-pointer text-[#937b34]"
                                  size={30}
                                  onClick={() => handleServiceClick(service)}
                                />
                              ) : (
                                <MdAddBox
                                  size={35}
                                  className="cursor-pointer"
                                  onClick={() => handleServiceClick(service)}
                                />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ),
                  },
                ]}
              />
            </div>
          </div>
          <div className="w-[30%] ml-5 border-2 px-5 border-slate-500 rounded-md h-fit pb-8">
            <div className="flex justify-center mt-6">
              <div className="text-xl text-[#937b34] font-bold w-fit mb-10 text-center border-b-2 border-[#937b34]">
                Xác nhận
              </div>
            </div>
            <div>
              {selectedServices.length === 0 ? (
                <div className="items-center justify-center col w-full">
                  <FaFrownOpen size={100} className="mx-auto text-gray-600" />
                  <div className="text-base font-bold text-center mt-4 text-gray-600">
                    Chưa có dịch vụ nào được chọn
                  </div>
                </div>
              ) : (
                <>
                  {selectedServices.map((service) => (
                    <div
                      key={service.serviceID}
                      className="mb-2 flex justify-between"
                    >
                      <span className="text-base font-bold">
                        {service.serviceName}:
                      </span>
                      <span className="text-base ml-1 flex">
                        <span>{formatCurrency(service.price)} | </span>
                        <span>
                          <RiDeleteBin6Line
                            className="cursor-pointer ml-2 text-[#df4343]"
                            size={25}
                            onClick={() =>
                              handleDeleteService(service.serviceID)
                            } // Thêm hàm xử lý xóa
                          />
                        </span>
                      </span>
                    </div>
                  ))}
                  <hr className="my-4" />
                  <div className="flex justify-between text-base">
                    <span className="font-bold ">Tổng tiền:</span>
                    <span>
                      {formatCurrency(
                        selectedServices.reduce(
                          (total, service) => total + service.price,
                          0
                        )
                      )}
                      VNĐ
                    </span>
                  </div>
                  <div className="flex justify-between text-base">
                    <span className="font-bold ">Tổng thời gian:</span>
                    <span>
                      {formatDuration(
                        selectedServices.reduce(
                          (total, service) => total + service.duration,
                          0
                        )
                      )}
                    </span>
                  </div>
                </>
              )}
            </div>
            <div className="flex justify-center">
              <Button
                type="primary"
                className={`py-5 rounded-full bg-black font-medium text-base  mt-8 ${
                  selectedServices.length === 0
                    ? "opacity-80 cursor-not-allowed"
                    : ""
                }`}
                disabled={selectedServices.length === 0}
                onClick={handleConfirm}
              >
                Xác nhận đặt dịch vụ
              </Button>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Đặt lịch với Stylish",
      content: (
        <div className="w-3/4 mx-auto pt-5 pb-12">
          {/* LOCAL */}
          <div className="mb-6">
            <div className="text-lg mb-3 font-semibold flex items-center">
              <FaLocationDot className="mr-2" />
              Chọn cơ sở gần bạn:
            </div>
            <div>
              <Select
                onChange={handleBranchChange}
                className="custom-select w-full h-fit min-h-16 my-auto flex justify-center text-xl"
                showSearch
                suffixIcon={
                  <SearchOutlined
                    style={{ fontSize: "35px", marginRight: "20px" }}
                  />
                }
                //
                placeholder={
                  <span
                    style={{
                      fontSize: "20px",
                      color: "#a0a0a0",
                      padding: "20px 20px",
                    }}
                  >
                    Tìm kiếm cơ sở
                  </span>
                }
                optionLabelProp="label"
                filterOption={(input, option) =>
                  typeof option?.address === "string" &&
                  option.address.toLowerCase().includes(input.toLowerCase())
                }
                options={branches.map((branch) => ({
                  value: branch.branchID,
                  label: (
                    <div className="space-y-1 pl-2">
                      <strong className="text-base pt-2">
                        {branch.salonBranches}
                      </strong>
                      <div className="text-sm text-slate-600 pb-2">
                        {branch.address}
                      </div>
                    </div>
                  ),
                  address: branch.address,
                }))}
              />
            </div>
          </div>
          <div>
            <div className="text-lg mb-3 font-semibold flex items-center">
              <FaUserClock className="mr-2" />
              Lựa chọn stylish:
            </div>
            <div>
              <div className="flex flex-wrap justify-center">
                {selectedBranch ? (
                  <>
                    <div className="w-40 h-56 shadow-lg border-2 rounded-lg flex justify-center items-center flex-col mr-5 mb-5">
                      <FaUsers size={50} />
                      <span className="mt-4 font-bold mx-1 text-center">
                        Salon chọn giúp bạn
                      </span>
                    </div>
                    {stylists.map((stylist) => (
                      <div
                        key={stylist.stylistId}
                        className={`w-40 h-56  rounded-lg flex flex-col mr-5 mb-5 cursor-pointer ${
                          selectedStylist === stylist.stylistId
                            ? "border-[#937b34] border-4 "
                            : "border-slate-400 border-2"
                        }`}
                        onClick={() => setSelectedStylist(stylist.stylistId)}
                      >
                        <img
                          src={stylist.avatarImage}
                          alt={stylist.stylistName}
                          className="h-40 w-40 object-cover rounded-t-lg"
                        />
                        <span className="text-center mt-2 mb-1 font-medium">
                          {stylist.stylistName}
                        </span>
                        <span className="flex justify-center items-center">
                          <FaStar size={20} className="text-yellow-500" />
                          <span className="font-bold">
                            {stylist.averageRating}/5
                          </span>
                        </span>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="w-full text-center my-5 h-56 ">
                    <div className="w-full flex justify-center text-gray-400 mb-2">
                      <RiMapPinUserFill size={100} />
                    </div>

                    <span className="text-lg font-bold text-gray-400">
                      Vui lòng chọn một salon
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="text-lg mb-3 font-semibold flex items-center">
            <MdAccessTimeFilled className="mr-2" />
            Thời gian đặt lịch
          </div>
          <div className="w-full flex justify-center">
            <Button
              type="primary"
              className={`py-5 rounded-full bg-black font-medium text-base  mt-8  mr-10 ${
                selectedServices.length === 0
                  ? "opacity-80 cursor-not-allowed"
                  : ""
              }`}
              disabled={selectedServices.length === 0}
              onClick={handleConfirm}
            >
              Xác nhận thanh toán
            </Button>
            <Button
              type="primary"
              className={`py-5 rounded-full bg-black font-medium text-base  mt-8 ${
                selectedServices.length === 0
                  ? "opacity-80 cursor-not-allowed"
                  : ""
              }`}
              disabled={selectedServices.length === 0}
              onClick={handleConfirmBack}
            >
              Quay lại
            </Button>
          </div>
        </div>
      ),
    },
    {
      title: "Xác nhận thông tin",
      content: "Nội dung cho bước 3: Xác nhận thông tin",
    },
  ];

  // const next = () => {
  //   setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  // };

  // const prev = () => {
  //   setCurrentStep((prev) => Math.max(prev - 1, 0));
  // };

  return (
    <div>
      <div
        className="bg-cover bg-center flex items-center justify-center "
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div className="bg-black bg-opacity-75 h-60 my-auto w-full flex flex-col items-center justify-center">
          <div className="text-white font-bold text-2xl p-5 mb-8">
            HAIR SALON
          </div>
          <div className="w-3/5">
            <Steps
              className="custom-dot"
              current={currentStep}
              progressDot={customDot}
              items={steps.map((step) => ({
                title: step.title,
              }))}
            />
          </div>
        </div>
      </div>
      <div className="pt-10 bg-[#FFFFFF] ">
        <div className="steps-content">{steps[currentStep].content}</div>
        <div className="steps-action">
          {/* <Button
            type="primary"
            onClick={next}
            disabled={currentStep === steps.length - 1}
          >
            Tiếp theo
          </Button>
          <Button
            style={{ margin: "0 8px" }}
            onClick={prev}
            disabled={currentStep === 0}
          >
            Quay lại
          </Button> */}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
