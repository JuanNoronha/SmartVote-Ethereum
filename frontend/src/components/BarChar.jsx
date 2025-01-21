import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
const BarChar = ({ data }) => {
  return (
    <div className="absolute left-0 top-0 h-full w-full bg-red-500">
      <ResponsiveContainer>
        <BarChart
          width={700}
          maxBarSize={40}
          height={500}
          data={data}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1F546A" />
          <XAxis
            dataKey={"name"}
            scale={"auto"}
            stroke="#1F546A"
            fontSize={16}
          />
          <YAxis stroke="#1F546A" allowDecimals={false} type="number" />
          <Tooltip />
          <Legend />
          <Bar dataKey={"votes"} fill="#1FD08C" />
          {/* <Line
            type={"bump"}
            dataKey={"votes"}
            className="stroke-primary-dark"
          /> */}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChar;
