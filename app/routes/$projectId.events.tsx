import { Cell, Column, Row, Table, TableBody, TableHeader, Tooltip } from 'react-aria-components';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

export default function Route() {
	return (
		<div className="w-full">
			<ResponsiveContainer width={1000} height={300}>
				<LineChart data={[]}>
					<XAxis dataKey="key" />
					<YAxis />
					<Tooltip />
					<Line type="linear" dataKey="value" stroke="red" animationDuration={1000} />
				</LineChart>
			</ResponsiveContainer>
			<Table aria-label="Events" className="w-full">
				<TableHeader className="bg-white/5">
					<Column isRowHeader>Event</Column>
					<Column>ID</Column>
					<Column>Timestamp</Column>
				</TableHeader>
				<TableBody className="block">
					<Row>
						<Cell>Sign up</Cell>
						<Cell>ecaefaejn</Cell>
						<Cell>14:32</Cell>
					</Row>
				</TableBody>
			</Table>
		</div>
	);
}
