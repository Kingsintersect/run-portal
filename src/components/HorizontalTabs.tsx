
"use client";

import React, { useState } from "react";
import styled from "styled-components";

const TabsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px;
  margin: auto;
`;

const TabList = styled.div`
  display: flex;
  border-bottom: 2px solid #ddd;
`;

const Tab = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 12px 16px;
  border: none;
  background: ${({ active }) => (active ? "#007bff" : "transparent")};
  color: ${({ active }) => (active ? "#fff" : "#333")};
  font-weight: ${({ active }) => (active ? "bold" : "normal")};
  cursor: pointer;
  text-align: center;
  transition: all 0.3s ease-in-out;

  &:hover {
    background: #0056b3;
    color: #fff;
  }
`;

const TabContent = styled.div`
  padding: 20px;
  border: 2px solid #ddd;
  border-top: none;
  background: #f9f9f9;
`;

const Tabs = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabData = [
    { title: "App Credentials", content: "App Credentials Content" },
    { title: "Information", content: "Information Content" },
    { title: "Feature", content: "Feature Content" },
    { title: "Scopes", content: "Scopes Content" },
    { title: "Activation", content: "Activation Content" },
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

export default Tabs;