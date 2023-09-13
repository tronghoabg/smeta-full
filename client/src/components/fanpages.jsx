import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { BiSolidUpArrow, BiSolidDownArrow } from "react-icons/bi";

const TablePage = (props) => {
  const { listPage } = props;
  const { t } = useTranslation();

  const listAdclone = listPage ? [...listPage] : [];
  const [dataAD, setDataAD] = useState(listPage);
  const [selectsort, setSelectsort] = useState({ key: "", count: 0 });

  useEffect(() => {
    setDataAD(listPage);
  }, [listPage]);

  const handleFilters = (values) => {
    var newSelect = { ...selectsort };
    if (values.key !== selectsort.key) {
      newSelect.key = values.key;
      newSelect.count = 1;
    } else {
      newSelect.count = selectsort.count + 1;
    }
    setSelectsort(newSelect);

    if (values.interface === "string") {
      if (newSelect.count % 2 === 0) {
        let newdata = listAdclone.sort((a, b) =>
          b[`${values.key}`].localeCompare(a[`${values.key}`])
        );
        setDataAD(newdata);
      } else {
        let newdata = listAdclone.sort((a, b) =>
          a[`${values.key}`].localeCompare(b[`${values.key}`])
        );
        setDataAD(newdata);
      }
    }
    if (values.interface === "number") {
      if (newSelect.count % 2 === 0) {
        let datas = listAdclone.sort(
          (a, b) => b[`${values.key}`] - a[`${values.key}`]
        );
        setDataAD(datas);
      } else {
        let datas = listAdclone.sort(
          (a, b) => a[`${values.key}`] - b[`${values.key}`]
        );
        setDataAD(datas);
      }
    }
    if (values.interface === "boolean") {
      if (newSelect.count % 2 === 0) {
        let datas = listAdclone.sort((a, b) =>
          a.test === b.test ? 0 : a.test ? 1 : -1
        );
        setDataAD(datas);
      } else {
        let datas = listAdclone.sort((a, b) =>
          a.test === b.test ? 0 : a.test ? -1 : 1
        );
        setDataAD(datas);
      }
    }
  };

  const thTable = [
    { value: t("no"), interface: "number", key: "stt" },
    { value: "Avatar", interface: "string", key: "img" },
    { value: t("id"), interface: "string", key: "id" },
    { value: t("name"), interface: "string", key: "name" },
    { value: "verified", interface: "string", key: "status" },
    { value: t("like"), interface: "number", key: "likecount" },
    { value: t("followers"), interface: "number", key: "followers" },
    { value: t("promotable"), interface: "boolean", key: "promotable" },
  ];

  return (
    <table>
      <thead>
        <tr>
          {thTable.map((value, index) => {
            return (
              <th
                key={index}
                className="btn_header_table"
                onClick={() => {
                  handleFilters(value);
                }}
                style={{
                  minWidth:  `${index > 0 ? "100px" : "50px"}`,
                }}
              >
                <div className="flex_s header_flex">
                  <span>{value.value}</span>
                  <div
                    className={`flex_s header_flex icon_header ${
                      selectsort.count === 0 ||
                      (selectsort.key === value.key && selectsort.count > 0)
                        ? "visible"
                        : "invisible"
                    }`}
                  >
                    <div
                      className={`icon_header1 mb-0.5 ${
                        selectsort.count % 2 === 0 && selectsort.count > 0
                          ? "icon_header_action"
                          : ""
                      }`}
                    >
                      <i className="fa-solid fa-caret-up" />
                    </div>
                    <div
                      className={`icon_header2 ${
                        selectsort.count % 2 === 1 ? "icon_header_action" : ""
                      }`}
                    >
                      <i className="fa-solid fa-caret-down"></i>
                    </div>
                  </div>
                </div>
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {listPage &&
          dataAD.map((item) => {
            return (
              <tr key={`${item.stt}`}>
                <td>{item.stt}</td>
                <td>
                  <div className="avatar">
                    <img src={item.img} alt={item.stt}></img>
                  </div>
                </td>
                <td>
                  <a
                    className="under_text"
                    href={`https://www.facebook.com/profile.php?id=${item.id}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {item.id}
                  </a>
                </td>
                <td>{item.name}</td>
                <td>
                  {
                    <i
                      className="fa-solid fa-circle-check"
                      style={{
                        color: `${item.status ? "#bebfc1" : "#0091ff"}`,
                      }}
                    ></i>
                  }
                </td>
                <td>{item.likecount}</td>
                <td>{item.followers}</td>
                <td>{item.promotable ? "Y" : "N"}</td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
};

export default TablePage;
