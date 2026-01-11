"use client";
import React, { useState } from "react";
import styled from "styled-components";

const TabsContainer = styled.div`
  display: flex;
  width: 100%;
  max-width: 800px;
  margin: auto;
  border: 2px solid #ddd;
  background: #f9f9f9;
`;

const TabList = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
  border-right: 2px solid #ddd;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 12px 16px;
  border: none;
  background: ${({ active }) => (active ? "#007bff" : "transparent")};
  color: ${({ active }) => (active ? "#fff" : "#333")};
  font-weight: ${({ active }) => (active ? "bold" : "normal")};
  cursor: pointer;
  text-align: left;
  width: 100%;
  transition: all 0.3s ease-in-out;

  &:hover {
    background: #0056b3;
    color: #fff;
  }
`;

const TabContent = styled.div`
  flex: 1;
  padding: 20px;
`;

const VerticalTabs = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabData = [
    { title: "Personal Info", content: "Step 1: Fill in your personal information." },
    { title: "Educational Background", content: "Step 2: Provide your education details." },
    { title: "Teaching Experience", content: "Step 3: Describe your teaching experience." },
    { title: "Subjects & Availability", content: "Step 4: Select subjects and schedule." },
    { title: "Submit Application", content: "Step 5: Review and submit your application." },
  ];

  return (
    <TabsContainer>
      <TabList>
        {tabData.map((tab, index) => (
          <Tab key={index} active={activeTab === index} onClick={() => setActiveTab(index)}>
            {tab.title}
          </Tab>
        ))}
      </TabList>
      <TabContent>{tabData[activeTab].content}</TabContent>
    </TabsContainer>
  );
};

export default VerticalTabs;
