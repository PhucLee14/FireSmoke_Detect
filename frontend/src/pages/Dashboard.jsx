import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Menu, MenuItem } from "@mui/material";
import DetectionsTable from "../components/DetectionsTable";

function Dashboard() {
    const [detections, setDetections] = useState([]);
    const [userMap, setUserMap] = useState({});
    const [detectFilter, setDetectFilter] = useState();
    const [detectUser, setDetectUser] = useState("");
    const [detectDate, setDetectDate] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        axios
            .get("http://localhost:8000/detections/")
            .then(async (res) => {
                const data = res.data;
                setDetections(data);
                console.log(data);

                // Lấy tất cả user_ids duy nhất
                const uniqueUserIds = [
                    ...new Set(
                        data.map((item) => item.user_id).filter(Boolean)
                    ),
                ];

                const tempMap = {};

                // Gọi API lấy userName cho từng user_id
                await Promise.all(
                    uniqueUserIds.map(async (id) => {
                        try {
                            const res = await axios.get(
                                `http://localhost:8000/api/user/${id}`
                            );
                            tempMap[id] = res.data.user?.userName || id;
                        } catch {
                            tempMap[id] = "Unknown";
                        }
                    })
                );

                setUserMap(tempMap);
            })
            .catch((err) => {
                console.error("❌ Lỗi khi lấy dữ liệu:", err);
            });
    }, []);

    useEffect(() => {
        axios
            .get(
                `http://localhost:8000/detections/filter/by-username/${detectUser}`
            )
            .then(async (res) => {
                const data = res.data;
                setDetections(data);

                // Lấy tất cả user_ids duy nhất
                const uniqueUserIds = [
                    ...new Set(
                        data.map((item) => item.user_id).filter(Boolean)
                    ),
                ];

                const tempMap = {};

                // Gọi API lấy userName cho từng user_id
                await Promise.all(
                    uniqueUserIds.map(async (id) => {
                        try {
                            const res = await axios.get(
                                `http://localhost:8000/api/user/${id}`
                            );
                            tempMap[id] = res.data.user?.userName || id;
                        } catch {
                            tempMap[id] = "Unknown";
                        }
                    })
                );

                setUserMap(tempMap);
            });
    }, [detectUser]);

    useEffect(() => {
        axios
            .get(
                `http://localhost:8000/detections/filter/by-date/${detectDate}`
            )
            .then(async (res) => {
                const data = res.data;
                setDetections(data);

                // Lấy tất cả user_ids duy nhất
                const uniqueUserIds = [
                    ...new Set(
                        data.map((item) => item.user_id).filter(Boolean)
                    ),
                ];

                const tempMap = {};

                // Gọi API lấy userName cho từng user_id
                await Promise.all(
                    uniqueUserIds.map(async (id) => {
                        try {
                            const res = await axios.get(
                                `http://localhost:8000/api/user/${id}`
                            );
                            tempMap[id] = res.data.user?.userName || id;
                        } catch {
                            tempMap[id] = "Unknown";
                        }
                    })
                );

                setUserMap(tempMap);
            });
    }, [detectDate]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        console.log("AnchorEl: ", event.currentTarget);
    };

    const handleClose = async (type) => {
        setAnchorEl(null);
        if (type) {
            setDetectFilter(type);

            try {
                const res = await axios.get(
                    `http://localhost:8000/detections/filter/by-type/${type}`
                );
                const data = res.data;
                setDetections(data);

                // 👉 Lấy danh sách user_ids để map lại userMap
                const uniqueUserIds = [
                    ...new Set(
                        data.map((item) => item.user_id).filter(Boolean)
                    ),
                ];
                const tempMap = {};

                await Promise.all(
                    uniqueUserIds.map(async (id) => {
                        try {
                            const res = await axios.get(
                                `http://localhost:8000/api/user/${id}`
                            );
                            tempMap[id] = res.data.user?.userName || id;
                        } catch {
                            tempMap[id] = "Unknown";
                        }
                    })
                );

                setUserMap(tempMap);
            } catch (err) {
                console.error("❌ Lỗi khi filter theo type:", err);
            }
        }
    };

    return (
        <Box
            p={3}
            display={"flex"}
            flexDirection="column"
            alignItems={"center"}
        >
            <Box fontWeight={600} fontSize={"24px"} mb={4}>
                Detections list
            </Box>

            <Box
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
                width={"90%"}
            >
                <Box display={"flex"} m={"8px 0"}>
                    <Box>
                        <Box
                            bgcolor={"#eee"}
                            p={"8px 16px"}
                            borderRadius={5}
                            sx={{
                                cursor: "pointer",
                                display: "inline-block",
                                "&:hover": {
                                    backgroundColor: "#000",
                                    color: "#fff",
                                },
                            }}
                            onClick={handleClick}
                        >
                            <i className="fa-regular fa-filter"></i> Filter
                        </Box>

                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={() => handleClose(null)}
                        >
                            <MenuItem
                                onClick={() => handleClose("fire")}
                                sx={{ paddingRight: "80px" }}
                            >
                                Fire
                            </MenuItem>
                            <MenuItem
                                onClick={() => handleClose("smoke")}
                                sx={{ paddingRight: "80px" }}
                            >
                                Smoke
                            </MenuItem>
                        </Menu>
                    </Box>
                    <Box ml={1}>
                        <input
                            type="date"
                            name=""
                            id=""
                            style={{
                                border: "1px solid #ccc",
                                borderRadius: "16px",
                                bgcolor: "#eee",
                                padding: "8px 16px",
                                width: "160px",
                                outline: "none",
                            }}
                            onChange={(e) => setDetectDate(e.target.value)}
                        />
                    </Box>
                </Box>
                <Box>
                    <input
                        type="text"
                        placeholder="Input user name"
                        style={{
                            padding: "8px 16px",
                            border: "1px solid #ccc",
                            borderRadius: "16px",
                            outline: "none",
                        }}
                        onChange={(e) => setDetectUser(e.target.value)}
                    />
                </Box>
            </Box>

            <DetectionsTable detections={detections} userMap={userMap} />
        </Box>
    );
}

export default Dashboard;
