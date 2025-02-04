import { useCallback, useEffect, useState } from "react";
import useQuery from "./useQuery";
import useAsyncCall from "./useAsyncCall";
import instance from "../instance";
import { useParams } from "react-router-dom";
const usePaginatedFetch = ({ url }) => {
  const [data, setData] = useState({
    items: [],
    totalPages: 0,
    totalCount: 0,
    currentPage: 0,
    reachedLimit: true,
  });
  const query = useQuery();
  const [status, setStatus] = useState("idle");
  const page = query.get("page") || 1;
  const search = query.get("query") || "";
  const contactType = query.get("type");
  const { partyId, expenseCategoryId } = useParams();
  const { requestAsyncHandler } = useAsyncCall();
  const fetchFn = useCallback(
    requestAsyncHandler(async () => {
      setStatus("loading");
      const { data } = await instance.get(url, {
        params: {
          page,
          search,
          party: partyId,
          category: expenseCategoryId,
          type: contactType,
        },
      });
      setData({
        items: data.data,
        totalPages: data.totalPages,
        currentPage: data.currentPage,
        totalCount: data.totalCount,
        reachedLimit: data.reachedLimit,
      });
      setStatus("success");
    }, [search, page, contactType])
  );
  useEffect(() => {
    fetchFn();
  }, [search, page, contactType]);
  const onSetItems = (items) => setData({ ...data, items });
  return {
    fetchFn,
    data,
    status,
    onSetItems,
  };
};

export default usePaginatedFetch;
