import { Container, Icon, List, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa6";
import { IoSettingsOutline } from "react-icons/io5";
import { NavLink, useParams } from "react-router-dom";
import headerLinks from "../../../constants/headerLinks";
import HeaderLink from "./HeaderLink";
import SettingLinks from "./SettingLinks";
export const SidebarLinksList = () => {
  const [openSettings, setOpenSettings] = useState(false);
  const { orgId = "" } = useParams();
  return (
    <Container marginBlock={3}>
      <List spacing={3}>
        {headerLinks.map((headerLink) => (
          <HeaderLink key={headerLink.label}>
            <Icon as={headerLink.icon} />
            <NavLink to={`/${orgId}${headerLink.link}`}>{headerLink.label}</NavLink>
          </HeaderLink>
        ))}
        <HeaderLink>
          <Icon as={IoSettingsOutline} />
          <Text>Settings</Text>
          <Icon
            as={FaChevronDown}
            cursor={"pointer"}
            onClick={() => setOpenSettings(!openSettings)}
          />
        </HeaderLink>
        {openSettings ? <SettingLinks /> : null}
      </List>
    </Container>
  );
};
