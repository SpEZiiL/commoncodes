export default class Exception extends Error {
	private _cause: (Exception | null);

	constructor(message: (string | null) = null,
	            cause: (Exception | null) = null) {
		super(typeof(message) === "string" ? message : "");
		this.name = new.target.name;
		this.message = (typeof(message) === "string" ? message : "");
		Object.setPrototypeOf(this, new.target.prototype);
		this._cause = (cause instanceof Exception ? cause : null);
	}

	get cause(): (Exception | null) {
		return this._cause;
	}
	initCause(cause: Exception): void {
		if(this._cause === null) {
			this._cause = cause;
		}
	}

	static fromError(err: Error): Exception {
		const exc = new Exception(err.message);
		exc.name = err.name;
		exc.stack = err.stack;
		return exc;
	}
}
