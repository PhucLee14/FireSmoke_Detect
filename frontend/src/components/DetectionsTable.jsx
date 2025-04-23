import React from "react";
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";

function DetectionsTable({ detections, userMap }) {
    return (
        <TableContainer component={Paper} sx={{ width: "90%" }}>
            <Table>
                <TableHead sx={{ bgcolor: "#efefef" }}>
                    <TableRow>
                        <TableCell sx={{ color: "#777" }}>
                            <strong>User</strong>
                        </TableCell>
                        <TableCell sx={{ color: "#777" }}>
                            <strong>Time</strong>
                        </TableCell>
                        <TableCell sx={{ color: "#777" }}>
                            <strong>Source</strong>
                        </TableCell>
                        <TableCell sx={{ color: "#777" }}>
                            <strong>Detected Image</strong>
                        </TableCell>
                        <TableCell sx={{ color: "#777" }}>
                            <strong>Confidence</strong>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {detections
                        .slice()
                        .reverse()
                        .map((item, index) => (
                            <TableRow
                                key={index}
                                sx={{
                                    "&:hover": {
                                        backgroundColor: "#f5f5f5",
                                    },
                                }}
                            >
                                <TableCell sx={{ fontWeight: "600" }}>
                                    {userMap[item.user_id] || "Loading..."}
                                </TableCell>
                                <TableCell>
                                    {new Date(item.timestamp).toLocaleString(
                                        "vi-VN"
                                    )}
                                </TableCell>
                                <TableCell>{item.source}</TableCell>
                                <TableCell>
                                    <img
                                        src={item.image_url}
                                        alt="detection"
                                        style={{
                                            width: 120,
                                            borderRadius: 8,
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    {item.detections.map((d, i) => (
                                        <Box
                                            key={i}
                                            borderRadius={5}
                                            backgroundColor={
                                                d.class_name === "fire"
                                                    ? "#F8D7DA"
                                                    : "#D6E7FE"
                                            }
                                            color={
                                                d.class_name === "fire"
                                                    ? "#D50004"
                                                    : "#0016D5"
                                            }
                                            display={"inline-block"}
                                            m={0.5}
                                            py={1.5}
                                            px={2}
                                        >
                                            {d.class_name} (
                                            {Math.round(d.confidence * 100)}
                                            %)
                                        </Box>
                                    ))}
                                </TableCell>
                            </TableRow>
                        ))}
                    {detections.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} align="center">
                                Không có dữ liệu.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default DetectionsTable;
