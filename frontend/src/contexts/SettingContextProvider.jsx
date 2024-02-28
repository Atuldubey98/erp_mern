import { useContext, useEffect, useState } from "react";
import instance from "../instance";
import SettingContext from "./SettingContext";
import AuthContext from "./AuthContext";
import { useNavigate } from "react-router-dom";
export default function SettingContextProvider({ children }) {
  const [setting, setSetting] = useState(null);
  const onSetSettingForOrganization = (newSetting) => setSetting(newSetting);
  const userContext = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    const storedOrgId = localStorage.getItem("organization");
    (async () => {
      if (!storedOrgId && userContext.user) {
        navigate("/organizations");
        return;
      }
      const { data } = await instance.get(
        `/api/v1/organizations/${storedOrgId}/settings`
      );
      setSetting(data.data);
    })();
  }, [userContext.user]);
  return (
    <SettingContext.Provider
      value={{
        setting,
        onSetSettingForOrganization,
      }}
    >
      {children}
    </SettingContext.Provider>
  );
}
