export class SessionMap<K, V> {
	#map: Map<K, V>;
	#sessionStorageId: string;

	constructor(sessionStorageId: string) {
		this.#sessionStorageId = sessionStorageId;
		this.#map = this.#getSession(sessionStorageId);
		sessionStorage.setItem(this.#sessionStorageId, JSON.stringify({}));
	}

	#getSession(sessionStorageId: string): Map<K, V> {
		const savedSession = sessionStorage.getItem(sessionStorageId);
		if (!savedSession) return new Map();

		try {
			return new Map(Object.entries(JSON.parse(savedSession))) as Map<K, V>;
		} catch (err) {
			return new Map();
		}
	}

	#saveSession() {
		sessionStorage.setItem(
			this.#sessionStorageId,
			JSON.stringify(Object.fromEntries(this.#map.entries())),
		);
	}

	get(key: K) {
		const res = this.#map.get(key);
		return res;
	}

	set(key: K, value: V) {
		const res = this.#map.set(key, value);
		this.#saveSession();
		return res;
	}

	delete(key: K) {
		const res = this.#map.delete(key);
		this.#saveSession();
		return res;
	}

	clear() {
		return this.#map.clear();
	}

	keys() {
		return this.#map.keys();
	}

	values() {
		return this.#map.values();
	}

	entries() {
		return this.#map.entries();
	}

	has(key: K) {
		return this.#map.has(key);
	}

	get size() {
		return this.#map.size;
	}
}
