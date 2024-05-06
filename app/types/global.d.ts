declare module '*.svg' {
	const content: React.FC<React.SVGProps<SVGElement> & { title?: string }>;
	export default content;
}

interface KeyValue<K = string, V = number> {
	key: K;
	value: V;
}

type Sort = 'ascending' | 'descending';
