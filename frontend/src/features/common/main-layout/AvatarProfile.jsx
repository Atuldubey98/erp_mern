import { Avatar, Flex, Hide, Text } from "@chakra-ui/react";
import React, { useContext } from "react";
import useAuth from "../../../hooks/useAuth";
import SettingContext from "../../../contexts/SettingContext";
export default function AvatarProfile({ toggleProfilePopup }) {
  const { user } = useAuth();
  const settingContext = useContext(SettingContext);
  const role = settingContext?.role || "";
  return (
    <Flex
      cursor={toggleProfilePopup ? "cursor" : "default"}
      onClick={toggleProfilePopup}
      gap={2}
      alignItems={"center"}
    >
      <Hide below="md">
        <Text fontWeight={"bold"}>{`${
          user?.name
        } (${role.toLocaleUpperCase()})`}</Text>
      </Hide>
      <Avatar name={user?.name} />
    </Flex>
  );
}
