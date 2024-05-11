import { Cell, Column, Row, Table, TableBody, TableHeader } from 'react-aria-components';

export default function Route() {
	return (
		<div className="w-full">
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
