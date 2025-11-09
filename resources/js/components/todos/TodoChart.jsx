import React from "react";
import Chart from "react-apexcharts";
import { Card, CardContent } from "@/components/ui/card";

export default function TodoChart({ todos }) {
    const total = todos.length;
    const done = todos.filter((t) => t.is_finished).length;
    const pending = total - done;

    const chartData = {
        series: [done, pending],
        options: {
            labels: ["Selesai", "Belum Selesai"],
            colors: ["#16a34a", "#dc2626"],
            legend: { position: "bottom" },
        },
    };

    return (
        <Card className="mb-6">
            <CardContent>
                <Chart type="pie" height={250} {...chartData} />
            </CardContent>
        </Card>
    );
}

