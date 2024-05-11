import { Button } from 'react-aria-components';
import { LuChevronLeft, LuChevronRight, LuChevronsLeft, LuChevronsRight } from 'react-icons/lu';

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	setCurrentPage: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, setCurrentPage }: PaginationProps) => {
	return (
		<div className="flex gap-8 rounded-xl bg-neutral-400/10 px-6 py-3 [&_button:disabled]:cursor-not-allowed [&_button:disabled]:text-neutral-500 [&_svg]:size-6">
			<Button onPress={() => setCurrentPage(1)} isDisabled={currentPage === 1}>
				<LuChevronsLeft />
			</Button>
			<Button onPress={() => setCurrentPage(currentPage - 1)} isDisabled={currentPage === 1}>
				<LuChevronLeft />
			</Button>
			<p
				className="text-center font-semibold tabular-nums"
				style={{ width: `${totalPages.toString().split('').length * 2 + 1}ch` }}
			>
				{currentPage}/{totalPages}
			</p>
			<Button
				onPress={() => setCurrentPage(currentPage + 1)}
				isDisabled={currentPage === totalPages}
			>
				<LuChevronRight />
			</Button>
			<Button onPress={() => setCurrentPage(totalPages)} isDisabled={currentPage === totalPages}>
				<LuChevronsRight />
			</Button>
		</div>
	);
};
